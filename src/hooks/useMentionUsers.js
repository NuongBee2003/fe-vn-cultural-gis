/**
 * useMentionUsers
 *
 * Singleton cache: API chỉ gọi một lần duy nhất cho toàn phiên.
 *
 * QUAN TRỌNG: id = u.id (số nguyên) để FE gửi mentioned_user_ids xuống BE.
 * display = u.username để react-mentions hiển thị @username trong text.
 */
import { useEffect, useState } from "react";
import { userApi } from "@/api/user/userApi";

let cache = null;
let pendingFetch = null;

function toMentionUser(u) {
  return {
    id: u.id,               // numeric ID → gửi xuống BE làm mentioned_user_ids
    display: u.username,    // hiển thị @username trong text / dropdown
    avatar: u.avatar ?? null,
  };
}

export function useMentionUsers() {
  const [users, setUsers] = useState(cache ?? []);

  useEffect(() => {
    if (cache) return; // useState đã khởi tạo đúng giá trị

    if (!pendingFetch) {
      pendingFetch = userApi
        .getAllUsers()
        .then((list) => {
          const mapped = Array.isArray(list) ? list.map(toMentionUser) : [];
          cache = mapped;
          return mapped;
        })
        .catch((err) => {
          console.warn("[useMentionUsers] Không tải được danh sách user:", err.message);
          pendingFetch = null;
          return [];
        });
    }

    pendingFetch.then(setUsers);
  }, []);

  return users;
}
