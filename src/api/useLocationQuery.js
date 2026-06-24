

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { 
  getLocationsByCategory, 
  getLocationsByGeo,
  getAllLocations,
  getPlaceDetail, 
  createPlaceReview,
  createPlace,
  getCategories,
  getAssetsByLocationId,
  getAllLocationsByCategory,
  searchPlaceLocationsByDB,
  getAllPlaces,
} from "./locationApi";

/**
 * 1. Hook lấy danh sách locations theo Category ID
 * Tự động cache dữ liệu, chỉ fetch lại khi categoryId thay đổi hoặc cache hết hạn (stale).
 */
export function useLocationsByCategory(categoryId) {
  return useQuery({
    queryKey: ["locations", "category", categoryId],
    queryFn: () => getLocationsByCategory(categoryId),
    enabled: !!categoryId, // Chỉ kích hoạt khi có categoryId hợp lệ
    staleTime: 5 * 60 * 1000, // Cache dữ liệu trong 5 phút
  });
}

/**
 * 2. Hook lấy danh sách locations theo khung nhìn bản đồ (bbox)
 */
export function useLocationsByGeo(bbox, limit = 50) {
  return useQuery({
    queryKey: ["locations", "geo", bbox, limit],
    queryFn: () => getLocationsByGeo(bbox, limit),
    enabled: !!bbox,
    staleTime: 1 * 60 * 1000,
    // Giữ data cũ trong khi fetch mới → markers không biến mất (chống flicker)
    placeholderData: keepPreviousData,
    // Tránh refetch tự động khi user alt-tab → request mới đè lên response chưa render xong
    refetchOnWindowFocus: false,
    // Chỉ retry 1 lần nếu lỗi, tránh flood request gây race condition
    retry: 1,
  });
}

/**
 * 3. Hook lấy chi tiết một Địa điểm (Place) kèm review, rating, ảnh...
 */
export function usePlaceDetail(placeId) {
  return useQuery({
    queryKey: ["place", placeId],
    queryFn: () => getPlaceDetail(placeId),
    enabled: !!placeId,
    staleTime: 3 * 60 * 1000, // Cache 3 phút
  });
}

/**
 * 2.5. Hook lấy tất cả locations với phân trang (dành cho admin)
 */
export function useAllLocations(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["locations", "all", page, limit],
    queryFn: () => getAllLocations(page, limit),
    staleTime: 1 * 60 * 1000, // Cache 1 phút
  });
}

/**
 * Hook lấy tất cả Places với phân trang, lọc theo categoryId và tìm kiếm query
 */
export function useAllPlaces(page = 1, limit = 20, categoryId = null, query = "", userId = null) {
  return useQuery({
    queryKey: ["places", "all", page, limit, categoryId, query, userId],
    queryFn: () => getAllPlaces(page, limit, categoryId, query, userId),
    staleTime: 1 * 60 * 1000, // Cache 1 phút
    placeholderData: keepPreviousData,
  });
}
export function useAllLocationsByCategory(page = 1, limit = 20, categoryId, options = {}) {
  return useQuery({
    queryKey: ["locations", "category", categoryId, page, limit],
    queryFn: () => getAllLocationsByCategory(page, limit, categoryId),
    staleTime: 1 * 60 * 1000, // Cache 1 phút
    placeholderData: keepPreviousData,
    enabled: options.enabled !== false && !!categoryId,
  });
}
/**
 * 4. Mutation Hook để viết đánh giá địa điểm (Review)
 * Tự động xóa cache (invalidate) của place chi tiết để hiển thị review mới ngay lập tức.
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ placeId, rating, comment, token, locationId }) => 
      createPlaceReview(placeId, rating, comment, token, locationId),
    onSuccess: (data, variables) => {
      // Invalidate cache của place này để buộc tải lại danh sách review mới nhất
      queryClient.invalidateQueries({ queryKey: ["place", variables.placeId] });
      queryClient.invalidateQueries({ queryKey: ["place-reviews", variables.placeId] });
    },
  });
}

/**
 * 5. Mutation Hook để tạo mới địa điểm kèm các locations
 */
export function useCreatePlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (placeData) => createPlace(placeData),
    onSuccess: () => {
      // Khi thêm địa điểm thành công, xóa mọi cache locations để bản đồ hiển thị điểm mới
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
}

/**
 * 6. Hook lấy danh sách danh mục (categories) từ server
 */
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 30 * 60 * 1000, // Cache 30 phút vì danh mục ít khi thay đổi
  });
}

/**
 * 7. Hook lấy danh sách assets (hình ảnh) theo location_id
 */
export function useAssetsByLocationId(locationId) {
  return useQuery({
    queryKey: ["assets", "location", locationId],
    queryFn: () => getAssetsByLocationId(locationId),
    enabled: !!locationId,
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });
}

/**
 * 8. Hook tìm kiếm địa điểm bằng DB (hỗ trợ tiếng Việt có/không dấu)
 * @param {string} query - Từ khóa tìm kiếm
 * @param {number} [limit=10]
 */
export function useSearchLocations(query, limit = 10) {
  const trimmed = (query || "").trim();
  return useQuery({
    queryKey: ["search", "db", trimmed, limit],
    queryFn: () => searchPlaceLocationsByDB(trimmed, limit),
    enabled: trimmed.length >= 1,
    staleTime: 30 * 1000, // Cache 30 giây
    placeholderData: [],
  });
}

/**
 * 9. Hook lấy reviews + rating_avg của một Place
 * Dùng GET /api/v1/place/:id (trả về locations[].reviews[])
 */
export function usePlaceReviews(placeId, locationId = null) {
  return useQuery({
    queryKey: ["place-reviews", placeId, locationId],
    queryFn: () => getPlaceDetail(placeId),
    enabled: !!placeId,
    staleTime: 2 * 60 * 1000,
    select: (data) => {
      let filteredReviews = [];
      if (locationId) {
        // Chỉ lấy reviews thuộc chi nhánh này
        const loc = (data?.locations || []).find(l => l.id === locationId);
        if (loc && Array.isArray(loc.reviews)) {
          filteredReviews = loc.reviews.map(r => ({
            ...r,
            locationAddress: loc.address
          }));
        }
      } else {
        // Gom tất cả reviews từ các chi nhánh
        for (const loc of data?.locations || []) {
          if (Array.isArray(loc.reviews)) {
            filteredReviews.push(
              ...loc.reviews.map(r => ({
                ...r,
                locationAddress: loc.address
              }))
            );
          }
        }
      }

      // Sắp xếp mới nhất lên đầu
      filteredReviews.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      // Tính rating_avg cụ thể cho tập review đã lọc
      let totalRating = 0;
      let count = 0;
      for (const r of filteredReviews) {
        const rating = Number(r.rating);
        if (!Number.isNaN(rating)) {
          totalRating += rating;
          count++;
        }
      }
      const ratingAvg = count > 0 ? Number((totalRating / count).toFixed(2)) : null;

      return {
        reviews: filteredReviews,
        rating_avg: ratingAvg,
        total: filteredReviews.length,
        locations: data?.locations || [],
      };
    },
  });
}
