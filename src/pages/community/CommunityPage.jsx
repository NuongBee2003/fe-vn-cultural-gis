import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Search, SlidersHorizontal, X, Bell } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import CommunityPostCard from "@/components/user/community/CommunityPostCard";
import CreatePostModal from "@/components/user/community/CreatePostModal";

import {
  COMMUNITY_ASSETS,
  COMMUNITY_COMMENTS,
  COMMUNITY_POSTS,
  COMMUNITY_POST_LIKES,
  COMMUNITY_LOCATIONS,
  COMMUNITY_USERS,
} from "@/constants/community";
import { getPosts, getPostDetail } from "@/api/postApi";
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "@/api/notificationApi";
import { useWebSocketNotification } from "@/context/WebSocketContext";

function formatDateTime(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function parseDateInput(value, endOfDay = false) {
  if (!value) return null;
  const parts = String(value).split("-").map((v) => Number(v));
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null;
  const [year, month, day] = parts;
  if (!year || !month || !day) return null;
  return new Date(
    year,
    month - 1,
    day,
    endOfDay ? 23 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 999 : 0,
  );
}

function getInitials(name) {
  const cleaned = String(name || "").trim();
  if (!cleaned) return "?";
  const parts = cleaned.split(/\s+/g).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export default function CommunityPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  const [dbPosts, setDbPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [feedTab, setFeedTab] = useState("all");

  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNoti, setLoadingNoti] = useState(false);
  const notiRef = useRef(null);

  const [activeNotificationPostId, setActiveNotificationPostId] = useState(null);
  const [activeNotificationCommentId, setActiveNotificationCommentId] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const { addNotificationListener } = useWebSocketNotification();

  useEffect(() => {
    const removeListener = addNotificationListener((newNoti) => {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === newNoti.id)) return prev;
        return [newNoti, ...prev];
      });
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      removeListener();
    };
  }, [addNotificationListener]);

  const loadNotifications = useCallback(async () => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    if (!token) return;
    try {
      setLoadingNoti(true);
      const data = await getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    } catch (err) {
      console.error("Lỗi khi tải thông báo:", err);
    } finally {
      setLoadingNoti(false);
    }
  }, []);

  useEffect(() => {
    if (isLogin) {
      loadNotifications();
    }
  }, [isLogin, loadNotifications]);

  useEffect(() => {
    if (notificationsOpen) {
      loadNotifications();
    }
  }, [notificationsOpen, loadNotifications]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = useCallback(async (noti) => {
    setNotificationsOpen(false);
    if (!noti.is_read && noti.id) {
      setNotifications(prev =>
        prev.map(n => n.id === noti.id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      await markNotificationAsRead(noti.id);
    }
    if (noti.post_id) {
      try {
        const latestPost = await getPostDetail(noti.post_id);
        if (latestPost) {
          // If the post is not ours and we are on "mine" tab, switch to "all" tab
          const isOwnPost = Number(latestPost.user_id) === Number(currentUser?.id);
          if (!isOwnPost && feedTab === "mine") {
            setFeedTab("all");
          }

          setDbPosts(prev => {
            const exists = prev.some(p => p.id === latestPost.id);
            if (exists) {
              return prev.map(p => p.id === latestPost.id ? latestPost : p);
            } else {
              return [latestPost, ...prev];
            }
          });

          setActiveNotificationPostId(latestPost.id);
          setActiveNotificationCommentId(noti.comment_id || null);
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết bài viết từ thông báo:", err);
      }

      setTimeout(() => {
        const element = document.getElementById(`post-card-${noti.post_id}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.classList.add("ring-2", "ring-amber-500", "duration-500");
          setTimeout(() => {
            element.classList.remove("ring-2", "ring-amber-500");
          }, 2000);
        }
      }, 300);
    }
  }, [currentUser, feedTab]);

  // Handle click on WebSocket toast (real-time popup)
  useEffect(() => {
    const handleWsClick = (e) => {
      const { post_id, comment_id, noti_id } = e.detail;
      if (post_id) {
        const notiObj = {
          id: noti_id,
          post_id: Number(post_id),
          comment_id: comment_id ? Number(comment_id) : null,
          is_read: false
        };
        handleNotificationClick(notiObj);
      }
    };

    window.addEventListener("ws_notification_click", handleWsClick);
    return () => {
      window.removeEventListener("ws_notification_click", handleWsClick);
    };
  }, [handleNotificationClick]);

  // Handle URL query parameters on mount or change
  useEffect(() => {
    const postId = searchParams.get("post_id");
    const commentId = searchParams.get("comment_id");
    const notiId = searchParams.get("noti_id");

    if (postId) {
      const notiObj = {
        id: notiId ? Number(notiId) : null,
        post_id: Number(postId),
        comment_id: commentId ? Number(commentId) : null,
        is_read: !notiId
      };
      handleNotificationClick(notiObj);

      // Clear search params to prevent multiple triggers
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("post_id");
      newParams.delete("comment_id");
      newParams.delete("noti_id");
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams, handleNotificationClick]);

  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
    await markAllNotificationsAsRead();
  };

  const pageScrollRef = useRef(null);
  const lastScrollTopRef = useRef(0);
  const headerCollapsedRef = useRef(false);
  const scrollTickingRef = useRef(false);
  const lockUntilRef = useRef(0);

  // Check login state on mount / update
  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    setIsLogin(localStorage.getItem("isLogin") === "true" || !!token);

    const userRaw = localStorage.getItem("user") || localStorage.getItem("adminUser");
    if (userRaw) {
      try {
        setCurrentUser(JSON.parse(userRaw));
      } catch {
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  }, [createModalOpen]); // check again if modal changes (in case of login state updates)

  const loadPosts = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const data = await getPosts(filters);
      setDbPosts(data);
    } catch (err) {
      console.error("Lỗi khi load posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePostCreated = useCallback(() => {
    loadPosts({ date_from: dateFrom, date_to: dateTo });
    setFeedTab("mine");
  }, [loadPosts, dateFrom, dateTo]);

  useEffect(() => {
    loadPosts({ date_from: dateFrom, date_to: dateTo });
  }, [loadPosts, dateFrom, dateTo]);

  const postFeed = useMemo(() => {
    const query = search.trim().toLowerCase();

    /** @type {any[]} */
    const enriched = dbPosts.map((p) => {
      // Map 'accepted' to 'published' for FE status badge support
      const statusMapped = p.status === 'accepted' ? 'published' : p.status;
      
      const createdAtLabel = p.created_at ? formatDateTime(p.created_at) : "";

      return {
        id: p.id,
        user_id: p.user_id,
        title: p.title,
        content: p.content,
        status: statusMapped,
        category: p.location?.place?.category?.name || p.location?.place?.category || null,
        location: p.location ? {
          id: p.location.id,
          name: p.location.place?.name || p.location.address || "",
          lat: p.location.lat ? Number(p.location.lat) : null,
          lng: p.location.lng ? Number(p.location.lng) : null
        } : null,
        created_at: p.created_at,
        createdAtLabel,
        author: {
          name: p.user?.username || "(Ẩn danh)",
          avatar: p.user?.avatar || ""
        },
        assets: p.assets || [],
        comments: (p.comments || []).map(c => ({
          id: c.id,
          parent_id: c.parent_id,
          content: c.content,
          createdAtLabel: c.createdAtLabel || (c.created_at ? formatDateTime(c.created_at) : ""),
          editYN: c.editYN || 'N',
          delYN: c.delYN || 'N',
          author: {
            name: c.user?.username || "(Ẩn danh)",
            avatar: c.user?.avatar || ""
          }
        })),
        likeCount: p.likeCount || 0,
        likedYN: p.likedYN || 'N',
      };
    });

    const filtered = query
      ? enriched.filter((post) => {
          const hay = `${post.title} ${post.content} ${post.author.name}`.toLowerCase();
          return hay.includes(query);
        })
      : enriched;

    const filteredByTab = filtered.filter((post) => {
      if (feedTab === "mine") {
        return Number(post.user_id) === Number(currentUser?.id);
      } else {
        // Tab tất cả bài viết chỉ hiện bài đã duyệt (accepted/published)
        return post.status === "published" || post.status === "accepted";
      }
    });

    const sorted = [...filteredByTab].sort((a, b) => {
      const ta = new Date(a.created_at).getTime();
      const tb = new Date(b.created_at).getTime();
      if (Number.isNaN(ta) || Number.isNaN(tb)) return 0;
      return sort === "oldest" ? ta - tb : tb - ta;
    });

    return sorted;
  }, [
    dbPosts,
    search,
    sort,
    feedTab,
    currentUser,
  ]);

  useEffect(() => {
    const el = pageScrollRef.current;
    if (!el) return;

    const onScroll = () => {
      if (scrollTickingRef.current) return;
      scrollTickingRef.current = true;

      requestAnimationFrame(() => {
        scrollTickingRef.current = false;

        const scrollTop = el.scrollTop || 0;
        const last = lastScrollTopRef.current;
        const delta = scrollTop - last;
        const now = performance.now();

        if (now < lockUntilRef.current) {
          lastScrollTopRef.current = scrollTop;
          return;
        }

        if (scrollTop < 48) {
          if (headerCollapsedRef.current) {
            headerCollapsedRef.current = false;
            setHeaderCollapsed(false);
            lockUntilRef.current = now + 220;
          }
        } else {
          if (delta > 12 && !headerCollapsedRef.current) {
            headerCollapsedRef.current = true;
            setHeaderCollapsed(true);
            lockUntilRef.current = now + 220;
          } else if (delta < -12 && headerCollapsedRef.current) {
            headerCollapsedRef.current = false;
            setHeaderCollapsed(false);
            lockUntilRef.current = now + 220;
          }
        }

        lastScrollTopRef.current = scrollTop;
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const filtersPanel = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <p className="text-sm font-semibold text-slate-900">Bộ lọc</p>
        <button
          type="button"
          onClick={() => setFiltersOpen(false)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-slate-50"
          aria-label="Đóng bộ lọc"
        >
          <X size={18} className="text-slate-600" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-600">Từ ngày</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus-visible:border-amber-400 focus-visible:ring-3 focus-visible:ring-amber-200/70"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-600">Đến ngày</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus-visible:border-amber-400 focus-visible:ring-3 focus-visible:ring-amber-200/70"
            />
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative flex-1 min-w-0 h-full w-full overflow-hidden bg-slate-50">
      <div className="h-full overflow-y-auto" ref={pageScrollRef}>
        <div className="px-4 pt-14 pb-8 md:px-6 md:py-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="sticky top-0 z-[40] bg-slate-50 pb-4">
              <div
                className={
                  "overflow-hidden transition-[opacity,transform] duration-200 will-change-[opacity,transform] " +
                  (headerCollapsed
                    ? "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
                    : "max-h-[240px] opacity-100 translate-y-0")
                }
              >
                <header>
                  <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                    Cộng đồng
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
                    Chia sẻ trải nghiệm văn hóa
                  </h1>
                  <p className="mt-3 text-sm leading-6 text-slate-500 max-w-2xl">
                    Tổng hợp bài viết từ cộng đồng về di sản, lễ hội, lịch sử và những câu chuyện Việt Nam.
                  </p>
                </header>
              </div>

              <div
                className={
                  (headerCollapsed ? "mt-0" : "mt-6") +
                  " rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                }
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex flex-1 items-center gap-2 rounded-full bg-slate-50 px-4 py-2.5 shadow-sm">
                    <Search size={16} className="text-slate-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Tìm bài viết..."
                      className="flex-1 border-none outline-none text-[13.5px] text-slate-800 bg-transparent"
                    />
                    {search ? (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="p-0 bg-transparent border-none cursor-pointer flex items-center"
                        aria-label="Xóa tìm kiếm"
                      >
                        <X size={16} className="text-slate-400" />
                      </button>
                    ) : null}
                  </div>

                  {!headerCollapsed ? (
                    <>
                      <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus-visible:border-amber-400 focus-visible:ring-3 focus-visible:ring-amber-200/70"
                        aria-label="Sắp xếp"
                      >
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setFiltersOpen(true)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        aria-label="Mở bộ lọc"
                        title="Lọc"
                      >
                        <SlidersHorizontal size={18} className="text-slate-600" />
                      </button>

                      {isLogin && (
                        <div className="relative" ref={notiRef}>
                          <button
                            type="button"
                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 cursor-pointer relative ${
                              notificationsOpen
                                ? "border-amber-400 bg-amber-50 text-amber-600 ring-2 ring-amber-200/50"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-amber-300"
                            }`}
                            aria-label="Thông báo"
                            title="Thông báo"
                          >
                            <Bell size={18} />
                            {unreadCount > 0 && (
                              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                                {unreadCount}
                              </span>
                            )}
                          </button>

                          {notificationsOpen && (
                            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl z-[100] flex flex-col max-h-[450px] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                                <span className="font-semibold text-slate-900 text-sm">Thông báo</span>
                                {unreadCount > 0 && (
                                  <button
                                    type="button"
                                    onClick={handleMarkAllAsRead}
                                    className="text-xs font-medium text-amber-600 hover:text-amber-700 cursor-pointer border-none bg-transparent"
                                  >
                                    Đánh dấu tất cả đã đọc
                                  </button>
                                )}
                              </div>

                              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 min-h-0">
                                {loadingNoti && notifications.length === 0 ? (
                                  <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-500"></div>
                                  </div>
                                ) : notifications.length === 0 ? (
                                  <div className="px-4 py-8 text-center text-xs text-slate-400">
                                    Không có thông báo nào.
                                  </div>
                                ) : (
                                  notifications.map((noti) => {
                                    const timeLabel = noti.created_at ? formatDateTime(noti.created_at) : "";
                                    
                                    return (
                                      <button
                                        key={noti.id}
                                        type="button"
                                        onClick={() => handleNotificationClick(noti)}
                                        className={`w-full text-left px-4 py-3 hover:bg-slate-50 flex gap-3 transition-colors cursor-pointer items-start border-none ${
                                          !noti.is_read ? "bg-amber-50/40" : "bg-transparent"
                                        }`}
                                      >
                                        <div className="h-9 w-9 shrink-0 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-semibold overflow-hidden">
                                          {noti.actor?.avatar ? (
                                            <img
                                              src={noti.actor.avatar}
                                              alt={noti.actor.username}
                                              className="h-full w-full object-cover"
                                            />
                                          ) : (
                                            getInitials(noti.actor?.username || "U")
                                          )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs text-slate-800 leading-normal">
                                            <span className="font-semibold text-slate-900">{noti.actor?.username || "Người dùng"}</span>{" "}
                                            {noti.message || "đã thực hiện một hành động"}
                                          </p>
                                          <span className="text-[10px] text-slate-400 mt-1 block">
                                            {timeLabel}
                                          </span>
                                        </div>

                                        {!noti.is_read && (
                                          <div className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                        )}
                                      </button>
                                    );
                                  })
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mx-auto w-full max-w-3xl space-y-4 pb-8">
              {isLogin && (
                <div className="space-y-4">
                  {/* Trigger box */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-semibold">
                      {getInitials(currentUser?.username || "Me")}
                    </div>
                    <button
                      type="button"
                      onClick={() => setCreateModalOpen(true)}
                      className="flex-1 rounded-full bg-slate-50 border border-slate-100 hover:bg-slate-100/80 px-4 py-2.5 text-left text-sm text-slate-500 transition-colors cursor-pointer"
                    >
                      Bạn đang nghĩ gì thế? Chia sẻ trải nghiệm văn hóa của bạn...
                    </button>
                  </div>

                  {/* Tabs Switcher */}
                  <div className="flex border-b border-slate-200 pb-1 gap-6">
                    <button
                      type="button"
                      onClick={() => setFeedTab("all")}
                      className={`pb-2.5 text-sm font-semibold transition-colors cursor-pointer border-b-2 relative ${
                        feedTab === "all"
                          ? "border-amber-500 text-amber-600"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Tất cả bài viết
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeedTab("mine")}
                      className={`pb-2.5 text-sm font-semibold transition-colors cursor-pointer border-b-2 relative ${
                        feedTab === "mine"
                          ? "border-amber-500 text-amber-600"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Bài viết của tôi
                    </button>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                </div>
              ) : postFeed.length ? (
                postFeed.map((post) => (
                  <div key={post.id} id={`post-card-${post.id}`}>
                    <CommunityPostCard
                      post={post}
                      showStatus={feedTab === "mine"}
                      autoOpenComments={activeNotificationPostId === post.id}
                      highlightCommentId={activeNotificationPostId === post.id ? activeNotificationCommentId : null}
                    />
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                  Không tìm thấy bài viết phù hợp.
                </div>
              )}
            </div>
          </div>
        </div>

        {filtersOpen ? (
          <aside className="hidden lg:block fixed right-6 top-6 bottom-6 z-[2100] w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            {filtersPanel}
          </aside>
        ) : null}

        {filtersOpen ? (
          <div className="lg:hidden fixed inset-0 z-[2100]">
            <button
              type="button"
              className="absolute inset-0 bg-black/30"
              aria-label="Đóng lớp phủ"
              onClick={() => setFiltersOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-[320px] bg-white shadow-xl">
              {filtersPanel}
            </div>
          </div>
        ) : null}

        {createModalOpen && (
          <CreatePostModal
            onClose={() => setCreateModalOpen(false)}
            onPostCreated={handlePostCreated}
          />
        )}
      </div>
    </div>
  );
}
