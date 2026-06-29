import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button/button";
import Pagination from "@/components/ui/pagination/Pagination";
import { Input } from "@/components/ui/input/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table-data/table";
import { ImageOff, Loader2, Search, Edit2, Trash2, Plus, X, MapPin, Calendar } from "lucide-react";
import { holidayApi } from "@/api/holidayApi";
import { searchPlaceLocationsByDB } from "@/api/locationApi";
import { uploadImageToSupabase, deleteImageFromSupabase } from "@/lib/supabaseClient";
import { SUPABASE_BUCKETS, IMAGE_UPLOAD_CONFIG } from "@/constants/supabaseConfig";

export default function HolidaysManagementPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isMutating, setIsMutating] = useState(false);

  // Search suggested places states
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    category: "Ngày lễ quốc gia",
    date_label: "",
    name: "",
    description: "",
    image_url: "",
    history: "",
    activities: [],
    foods: [],
    place_ids: [],
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState({});

  async function loadData() {
    try {
      setLoading(true);
      const res = await holidayApi.getAllHolidays({
        page,
        limit: pageSize,
        search: search.trim(),
      });
      if (res.success) {
        setItems(res.data || []);
        if (res.pagination) {
          setTotalItems(res.pagination.totalItems);
          setTotalPages(res.pagination.totalPages);
        } else {
          setTotalItems(res.data.length);
          setTotalPages(1);
        }
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách ngày lễ:", error);
    } finally {
      setLoading(false);
    }
  }

  // Debounce search location
  useEffect(() => {
    if (locationQuery.trim().length < 2) {
      setLocationResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingLocation(true);
      try {
        const results = await searchPlaceLocationsByDB(locationQuery.trim());
        setLocationResults(results || []);
      } catch (err) {
        console.error("Lỗi tìm kiếm địa điểm:", err);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [locationQuery]);

  useEffect(() => {
    loadData();
  }, [page, pageSize, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleOpenCreate = () => {
    setSelectedItem(null);
    setFormData({
      category: "Ngày lễ quốc gia",
      date_label: "",
      name: "",
      description: "",
      image_url: "",
      history: "",
      activities: [""],
      foods: [{ name: "", reason: "" }],
      place_ids: [],
    });
    setSelectedPlaces([]);
    setLocationQuery("");
    setLocationResults([]);
    setSelectedFile(null);
    setErrors({});
    setIsOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    
    // Parse activities and foods if strings
    let parsedActivities = [];
    try {
      parsedActivities = Array.isArray(item.activities) 
        ? item.activities 
        : JSON.parse(item.activities || "[]");
    } catch (e) {
      parsedActivities = [];
    }
    if (parsedActivities.length === 0) parsedActivities = [""];

    let parsedFoods = [];
    try {
      parsedFoods = Array.isArray(item.foods) 
        ? item.foods 
        : JSON.parse(item.foods || "[]");
    } catch (e) {
      parsedFoods = [];
    }
    if (parsedFoods.length === 0) parsedFoods = [{ name: "", reason: "" }];

    // Parse place_ids
    let parsedPlaceIds = [];
    try {
      parsedPlaceIds = Array.isArray(item.place_ids)
        ? item.place_ids
        : JSON.parse(item.place_ids || "[]");
    } catch (e) {
      parsedPlaceIds = [];
    }

    const initialPlaces = (item.places || []).map(p => ({
      id: p.id,
      name: p.name || "Địa điểm liên kết"
    }));

    setFormData({
      category: item.category || "Ngày lễ quốc gia",
      date_label: item.date_label || "",
      name: item.name || "",
      description: item.description || "",
      image_url: item.image_url || "",
      history: item.history || "",
      activities: parsedActivities,
      foods: parsedFoods,
      place_ids: parsedPlaceIds,
    });

    setSelectedPlaces(initialPlaces);
    setLocationQuery("");
    setLocationResults([]);

    setSelectedFile(null);
    setErrors({});
    setIsOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Dynamic Activities handlers
  const handleAddActivity = () => {
    setFormData((prev) => ({ ...prev, activities: [...prev.activities, ""] }));
  };

  const handleActivityChange = (index, value) => {
    setFormData((prev) => {
      const newActs = [...prev.activities];
      newActs[index] = value;
      return { ...prev, activities: newActs };
    });
  };

  const handleRemoveActivity = (index) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index),
    }));
  };

  // Dynamic Foods handlers
  const handleAddFood = () => {
    setFormData((prev) => ({ ...prev, foods: [...prev.foods, { name: "", reason: "" }] }));
  };

  const handleFoodChange = (index, field, value) => {
    setFormData((prev) => {
      const newFoods = [...prev.foods];
      newFoods[index] = { ...newFoods[index], [field]: value };
      return { ...prev, foods: newFoods };
    });
  };

  const handleRemoveFood = (index) => {
    setFormData((prev) => ({
      ...prev,
      foods: prev.foods.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > IMAGE_UPLOAD_CONFIG.MAX_SIZE_BYTES) {
      alert(`Kích thước file vượt quá giới hạn ${IMAGE_UPLOAD_CONFIG.MAX_SIZE_MB}MB.`);
      return;
    }

    try {
      setUploadingImage(true);
      const publicUrl = await uploadImageToSupabase(file, SUPABASE_BUCKETS.HOLIDAY_IMAGES);
      setFormData((prev) => ({ ...prev, image_url: publicUrl }));
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      alert("Không thể upload ảnh lên hệ thống.");
    } finally {
      setUploadingImage(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên ngày lễ không được để trống";
    if (!formData.date_label.trim()) newErrors.date_label = "Nhãn ngày/thời gian không được để trống";
    if (!formData.category) newErrors.category = "Danh mục không được để trống";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsMutating(true);
      
      // Clean up activities & foods
      const cleanActivities = formData.activities.filter(act => act.trim() !== "");
      const cleanFoods = formData.foods.filter(food => food.name.trim() !== "");

      const payload = {
        ...formData,
        activities: cleanActivities,
        foods: cleanFoods,
        place_ids: formData.place_ids || []
      };

      if (selectedItem) {
        await holidayApi.updateHoliday(selectedItem.id, payload);
      } else {
        await holidayApi.createHoliday(payload);
      }

      setIsOpen(false);
      loadData();
    } catch (error) {
      console.error("Lỗi khi lưu ngày lễ:", error);
      alert(error.message || "Có lỗi xảy ra khi lưu ngày lễ.");
    } finally {
      setIsMutating(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ngày lễ "${item.name}"?`)) return;

    try {
      setIsMutating(true);
      
      // Xóa ảnh cũ trên Supabase nếu có
      if (item.image_url && item.image_url.includes("supabase")) {
        try {
          await deleteImageFromSupabase(item.image_url, SUPABASE_BUCKETS.HOLIDAY_IMAGES);
        } catch (err) {
          console.warn("Lỗi khi xóa ảnh trên Supabase:", err);
        }
      }

      await holidayApi.deleteHoliday(item.id);
      loadData();
    } catch (error) {
      console.error("Lỗi khi xóa ngày lễ:", error);
      alert(error.message || "Có lỗi xảy ra khi xóa ngày lễ.");
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <main className="px-6 py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Quản lý lịch lễ</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quản lý thông tin chi tiết các ngày lễ Tết cổ truyền và ngày kỷ niệm văn hóa.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_auto]">
            <label className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Tìm kiếm</span>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tên hoặc mô tả..."
                  value={search}
                  onChange={handleSearchChange}
                  className="pl-9"
                />
              </div>
            </label>
            
            <div className="flex items-end">
              <Button onClick={handleOpenCreate} className="bg-[#B8922E] hover:bg-[#a67d22]">
                <Plus size={16} className="mr-1" />
                Thêm ngày lễ
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="mt-6 rounded-lg border bg-card">
        {loading ? (
          <div className="flex h-60 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            <span className="ml-2 text-sm text-muted-foreground">Đang tải lịch lễ...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Hình ảnh</TableHead>
                <TableHead className="w-[200px]">Tên ngày lễ</TableHead>
                <TableHead className="w-[150px]">Danh mục</TableHead>
                <TableHead className="w-[120px]">Nhãn ngày</TableHead>
                <TableHead className="w-[200px]">Địa điểm liên kết</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.image_url ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden border">
                          <img
                            src={item.image_url.includes(".") && !item.image_url.startsWith("http")
                              ? `${import.meta.env.BASE_URL || "/"}src/assets/img/holiday/${item.image_url}`
                              : item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=200"; // fallback
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-slate-100 border border-dashed">
                          <ImageOff size={16} className="text-gray-400 mb-1" />
                          <span className="text-[9px] text-gray-500">No image</span>
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="font-semibold text-foreground">
                      {item.name}
                    </TableCell>

                    <TableCell className="text-xs">
                      <span className="inline-block rounded-full bg-amber-50 text-amber-700 px-2.5 py-0.5 text-xs font-medium border border-amber-100">
                        {item.category}
                      </span>
                    </TableCell>

                    <TableCell className="text-xs font-medium text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{item.date_label}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {item.places?.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {item.places.map(p => (
                            <div key={p.id} className="flex items-center gap-1">
                              <MapPin size={12} className="text-emerald-650 shrink-0" />
                              <span className="truncate max-w-[180px] font-medium text-slate-700" title={p.name}>
                                {p.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Chưa liên kết</span>
                      )}
                    </TableCell>

                    <TableCell className="text-right space-x-2 whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(item)}
                        disabled={isMutating}
                      >
                        <Edit2 size={14} className="mr-1" />
                        Sửa
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item)}
                        disabled={isMutating}
                      >
                        <Trash2 size={14} className="mr-1" />
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    Không tìm thấy ngày lễ nào khớp với từ khóa tìm kiếm.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="text-sm text-muted-foreground">
                    Hiển thị <span className="font-medium text-foreground">{items.length}</span> trên tổng số{" "}
                    <span className="font-medium text-foreground">{totalItems}</span> ngày lễ.
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-end">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {/* Form Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-xl bg-background p-6 shadow-2xl relative border overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground rounded-lg p-1 hover:bg-muted"
            >
              <X size={20} />
            </button>

            <h2 className="mb-4 text-lg font-semibold pr-8">
              {selectedItem ? "Cập nhật thông tin ngày lễ" : "Thêm ngày lễ mới"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Tên ngày lễ */}
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Tên ngày lễ *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Tết Nguyên đán, Quốc khánh..."
                    disabled={isMutating}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                {/* Danh mục */}
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Danh mục *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    disabled={isMutating}
                  >
                    <option value="Ngày lễ quốc gia">Ngày lễ quốc gia</option>
                    <option value="Lễ Tết & lễ hội truyền thống">Lễ Tết & lễ hội truyền thống</option>
                    <option value="Ngày kỷ niệm văn hóa - xã hội">Ngày kỷ niệm văn hóa - xã hội</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Thời gian hiển thị */}
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Nhãn ngày/thời gian *</label>
                  <Input
                    name="date_label"
                    value={formData.date_label}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 1/1, Rằm tháng Giêng, 2/9..."
                    disabled={isMutating}
                  />
                  {errors.date_label && <p className="text-xs text-red-500 mt-1">{errors.date_label}</p>}
                </div>

                {/* Địa điểm gợi ý (Autocomplete Search) */}
                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="block text-sm font-medium text-foreground">
                    Địa điểm gợi ý (Đã chọn: {selectedPlaces.length})
                  </label>

                  {/* Hiển thị địa điểm đã chọn */}
                  {selectedPlaces.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-dashed rounded-lg mb-2">
                      {selectedPlaces.map((place) => (
                        <div
                          key={place.id}
                          className="flex items-center gap-1.5 rounded bg-indigo-50 border border-indigo-150 px-2 py-1 text-xs text-indigo-750 font-medium"
                        >
                          <MapPin size={12} className="text-indigo-650 shrink-0" />
                          <span className="truncate max-w-[120px]" title={place.name}>
                            {place.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedPlaces = selectedPlaces.filter((p) => p.id !== place.id);
                              setSelectedPlaces(updatedPlaces);
                              setFormData((prev) => ({ ...prev, place_ids: updatedPlaces.map(p => p.id) }));
                            }}
                            className="rounded-full hover:bg-indigo-100 text-indigo-500 hover:text-indigo-750 p-0.5 shrink-0"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tìm kiếm địa điểm */}
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Search size={14} className="text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      placeholder="Tìm địa điểm để đề xuất..."
                      className="w-full h-9 rounded-lg border border-input pl-9 pr-8 text-sm bg-transparent outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      disabled={isMutating}
                    />

                    {isSearchingLocation && (
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <Loader2 size={14} className="animate-spin text-slate-400" />
                      </div>
                    )}

                    {/* Dropdown kết quả */}
                    {locationResults.length > 0 && (
                      <div className="absolute left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto rounded-lg border border-input bg-background py-1 shadow-lg">
                        {locationResults.map((loc) => {
                          const isAlreadySelected = selectedPlaces.some((p) => p.id === loc.placeId);
                          return (
                            <button
                              key={loc.id}
                              type="button"
                              onClick={() => {
                                if (!isAlreadySelected) {
                                  const updatedPlaces = [...selectedPlaces, { id: loc.placeId, name: loc.name }];
                                  setSelectedPlaces(updatedPlaces);
                                  setFormData((prev) => ({ ...prev, place_ids: updatedPlaces.map(p => p.id) }));
                                }
                                setLocationQuery("");
                                setLocationResults([]);
                              }}
                              className="w-full px-3 py-1.5 text-left hover:bg-secondary transition-colors flex flex-col gap-0.5"
                              disabled={isAlreadySelected}
                            >
                              <span className={`text-xs font-semibold ${isAlreadySelected ? "text-muted-foreground" : "text-foreground"}`}>
                                {loc.name} {isAlreadySelected && "(Đã chọn)"}
                              </span>
                              <span className="text-[10px] text-muted-foreground truncate">
                                {loc.address}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mô tả ngắn */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Mô tả ngắn</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="flex min-h-[50px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Mô tả tóm tắt ý nghĩa ngày lễ..."
                  disabled={isMutating}
                />
              </div>

              {/* Lịch sử ý nghĩa chi tiết */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Ý nghĩa & Lịch sử chi tiết</label>
                <textarea
                  name="history"
                  value={formData.history}
                  onChange={handleInputChange}
                  rows={3}
                  className="flex min-h-[70px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Ý nghĩa văn hóa, nguồn gốc lịch sử chi tiết..."
                  disabled={isMutating}
                />
              </div>

              {/* Dynamic Activities */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground flex justify-between items-center">
                  <span>Hoạt động tiêu biểu</span>
                  <Button type="button" size="xs" onClick={handleAddActivity} className="h-6 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border">
                    <Plus size={12} className="mr-0.5" /> Thêm hoạt động
                  </Button>
                </label>
                <div className="space-y-2 mt-1">
                  {formData.activities.map((act, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <Input
                        value={act}
                        onChange={(e) => handleActivityChange(idx, e.target.value)}
                        placeholder={`Hoạt động ${idx + 1}`}
                        disabled={isMutating}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveActivity(idx)}
                        disabled={isMutating}
                        className="shrink-0 h-9 w-9"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Foods */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground flex justify-between items-center">
                  <span>Ẩm thực gợi ý</span>
                  <Button type="button" size="xs" onClick={handleAddFood} className="h-6 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border">
                    <Plus size={12} className="mr-0.5" /> Thêm ẩm thực
                  </Button>
                </label>
                <div className="space-y-2 mt-1">
                  {formData.foods.map((food, idx) => (
                    <div key={idx} className="flex gap-2 items-start border p-2.5 rounded-lg bg-slate-50/50">
                      <div className="flex-1 space-y-1.5">
                        <Input
                          value={food.name}
                          onChange={(e) => handleFoodChange(idx, "name", e.target.value)}
                          placeholder="Tên món ăn (Ví dụ: Bánh tét, Thịt kho...)"
                          disabled={isMutating}
                        />
                        <Input
                          value={food.reason}
                          onChange={(e) => handleFoodChange(idx, "reason", e.target.value)}
                          placeholder="Lý do gợi ý/Ý nghĩa"
                          disabled={isMutating}
                          className="text-xs"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveFood(idx)}
                        disabled={isMutating}
                        className="shrink-0 h-9 w-9 mt-1"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ảnh */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Ảnh minh họa</label>
                <div className="mb-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isMutating || uploadingImage}
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-1.5 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-[#B8922E] file:text-white
                      hover:file:bg-[#a67d22]
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {formData.image_url && (
                  <div className="mb-3">
                    <img
                      src={formData.image_url.includes(".") && !formData.image_url.startsWith("http")
                        ? `${import.meta.env.BASE_URL || "/"}src/assets/img/holiday/${formData.image_url}`
                        : formData.image_url}
                      alt="preview"
                      className="h-28 w-28 object-cover rounded-lg border"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=200";
                      }}
                    />
                  </div>
                )}

                <Input
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="Hoặc dán URL ảnh trực tiếp"
                  disabled={isMutating || uploadingImage}
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isMutating || uploadingImage}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={isMutating || uploadingImage}
                  className="bg-[#B8922E] hover:bg-[#a67d22]"
                >
                  {uploadingImage
                    ? "Đang tải ảnh..."
                    : isMutating
                    ? "Đang lưu..."
                    : selectedItem
                    ? "Cập nhật"
                    : "Thêm mới"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
