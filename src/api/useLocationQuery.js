

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getLocationsByCategory, 
  getLocationsByGeo, 
  getPlaceDetail, 
  createPlaceReview,
  createPlace,
  getCategories
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
    enabled: !!bbox, // Chỉ fetch khi có bbox hợp lệ từ bản đồ
    staleTime: 1 * 60 * 1000, // Cache trong 1 phút vì người dùng di chuyển bản đồ thường xuyên
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
 * 4. Mutation Hook để viết đánh giá địa điểm (Review)
 * Tự động xóa cache (invalidate) của place chi tiết để hiển thị review mới ngay lập tức.
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ placeId, rating, comment, token }) => 
      createPlaceReview(placeId, rating, comment, token),
    onSuccess: (data, variables) => {
      // Invalidate cache của place này để buộc tải lại danh sách review mới nhất
      queryClient.invalidateQueries({ queryKey: ["place", variables.placeId] });
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

