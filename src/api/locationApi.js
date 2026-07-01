/**
 * API Client cho các dịch vụ liên quan đến Địa điểm (Place) và Vị trí (Location)
 * Kết nối trực tiếp với backend Express (port 3002).
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api/v1";

/**
 * Hàm Helper ánh xạ (mapping) dữ liệu từ DB (Sequelize) sang cấu trúc mà giao diện FE đang dùng.
 * Giúp tương thích hoàn toàn với Map.jsx và các component hiện tại mà không phải sửa nhiều code UI.
 */
export function mapDbLocationToFe(dbLoc) {
  if (!dbLoc) return null;
  
  // Extract images từ dbLoc.assets, sắp xếp theo is_primary
  const assets = dbLoc.assets || [];
  const sortedAssets = [...assets].sort((a, b) => {
    // is_primary = true (1) lên đầu
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return a.id - b.id; // Sau đó sort theo id
  });
  const images = sortedAssets.map(asset => asset.url);
  
  return {
    id: dbLoc.id,
    placeId: dbLoc.place_id,
    name: dbLoc.place?.name || "Địa điểm không tên",
    description: dbLoc.place?.description || "",
    category: dbLoc.place?.category?.name || "Khác",
    category_id: dbLoc.place?.category?.id || null,
    categoryId: dbLoc.place?.category_id || null,
    lat: Number(dbLoc.lat),
    lng: Number(dbLoc.lng),
    address: dbLoc.address || "",
    iconMarker: dbLoc.place?.category?.icon_marker || "",
    markerColor: dbLoc.place?.category?.color || "#3b82f6",
    images: images, // Thêm images array
  };
}

/**
 * 1. Lấy danh sách điểm (locations) nằm trong khung nhìn bản đồ (bbox - bounding box)
 * @param {string} bbox Bounding box dạng "minLng,minLat,maxLng,maxLat"
 * @param {number} limit Giới hạn số lượng trả về (mặc định 50)
 */
export async function getLocationsByGeo(bbox, limit = 100) {
  try {
    const payload = { bbox, limit };
    console.log("📡 Fetching locations with payload:", payload);

    const res = await fetch(`${BASE_URL}/location/geo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    console.log("✅ Locations fetched successfully:", result);
    // Giả sử API trả về định dạng { success: true, data: [...] }
    const list = result.data || [];
    return list.map(mapDbLocationToFe);
  } catch (error) {
    console.error("❌ Lỗi khi fetch getLocationsByGeo:", error);
    throw error;
  }
}

/**
 * Lấy thông tin chi tiết một location theo ID.
 * @param {number} id ID của vị trí
 */
export async function getLocationById(id) {
  try {
    const res = await fetch(`${BASE_URL}/location/${id}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const result = await res.json();
    if (result.success && result.data) {
      return mapDbLocationToFe(result.data);
    }
    return null;
  } catch (error) {
    console.error(`❌ Lỗi khi fetch getLocationById (${id}):`, error);
    throw error;
  }
}

/**
 * 2. Lấy danh sách điểm (locations) lọc theo Category ID
 * @param {number} categoryId ID của danh mục cần lọc
 */
export async function getLocationsByCategory(categoryId) {
  try {
    const res = await fetch(`${BASE_URL}/location/category/${categoryId}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    const list = result.data || [];
    return list.map(mapDbLocationToFe);
  } catch (error) {
    console.error(`Lỗi khi fetch getLocationsByCategory (${categoryId}):`, error);
    throw error;
  }
}

/**
 * 2.5. Lấy tất cả locations với phân trang (dành cho admin)
 * @param {number} page Số trang (mặc định 1)
 * @param {number} limit Số items trên mỗi trang (mặc định 20)
 */
export async function getAllLocations(page = 1, limit = 20) {
  try {
    const query = new URLSearchParams({ page, limit });
    const res = await fetch(`${BASE_URL}/location?${query.toString()}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    console.log("✅ All locations fetched:", result);

    const list = result.data || [];
    return {
      data: list.map(mapDbLocationToFe),
      meta: result.meta || { total: 0, page: 1, limit: 20, totalPages: 0 },
    };
  } catch (error) {
    console.error(`Lỗi khi fetch getAllLocations:`, error);
    throw error;
  }
}
export async function getAllLocationsByCategory(page = 1, limit = 20, categoryId) {
  try {
    const query = new URLSearchParams({ page, limit, categoryId });
    const res = await fetch(`${BASE_URL}/location/getALL/categories/${categoryId}?${query.toString()}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    console.log("✅ All locations fetched:", result);

    const list = result.data || [];
    return {
      data: list.map(mapDbLocationToFe),
      meta: result.meta || { total: 0, page: 1, limit: 20, totalPages: 0 },
    };
  } catch (error) {
    console.error(`Lỗi khi fetch getAllLocations:`, error);
    throw error;
  }
}

/**
 * Lấy danh sách Places có phân trang, lọc theo categoryId và tìm kiếm query
 */
export async function getAllPlaces(page = 1, limit = 20, categoryId = null, query = "", userId = null) {
  try {
    const params = new URLSearchParams({ page, limit });
    if (categoryId) params.append("categoryId", categoryId);
    if (query) params.append("query", query);
    if (userId) params.append("userId", userId);

    const res = await fetch(`${BASE_URL}/place?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return {
      data: result.data || [],
      meta: result.meta || { total: 0, page: 1, limit: 20, totalPages: 0 },
    };
  } catch (error) {
    console.error(`Lỗi khi fetch getAllPlaces:`, error);
    throw error;
  }
}

/**
 * 3. Lấy chi tiết thông tin của 1 Location từ ID
 * @param {number} locationId ID của location cần xem chi tiết
 */
export async function getLocationDetail(locationId) {
  try {
    const res = await fetch(`${BASE_URL}/location/${locationId}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data; // Trả về thông tin gốc từ DB
  } catch (error) {
    console.error(`Lỗi khi lấy chi tiết location ${locationId}:`, error);
    throw error;
  }
}

/**
 * 4. Lấy chi tiết một địa điểm lớn (Place) kèm danh sách locations, assets, reviews, rating_avg...
 * Đây là API cực mạnh để hiển thị đầy đủ thông tin ở Panel bên phải.
 * @param {number} placeId ID của địa điểm cần lấy chi tiết
 */
export async function getPlaceDetail(placeId) {
  try {
    const res = await fetch(`${BASE_URL}/place/${placeId}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    // BE route.get('/:id') trả về thẳng object Place
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Lỗi khi lấy chi tiết place ${placeId}:`, error);
    throw error;
  }
}

/**
 * 5. Viết đánh giá (review) cho địa điểm
 * @param {number} placeId ID địa điểm cần đánh giá
 * @param {number} rating Số sao (1 đến 5)
 * @param {string} comment Nội dung đánh giá
 * @param {string} token JWT token của user đã đăng nhập
 */
export async function createPlaceReview(placeId, rating, comment, token, locationId = null) {
  try {
    const res = await fetch(`${BASE_URL}/place/${placeId}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ rating, comment, location_id: locationId }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error(`Lỗi khi tạo review cho place ${placeId}:`, error);
    throw error;
  }
}

/**
 * 6. Tạo mới địa điểm (Place) kèm danh sách vị trí (Locations) - (Dành cho Admin/Người dùng thêm điểm)
 * @param {Object} placeData Dữ liệu place cần tạo, ví dụ:
 * {
 *   name: "Chùa Bà Thiên Hậu",
 *   description: "Một ngôi chùa cổ...",
 *   category_id: 2,
 *   locations: [
 *     { lat: 10.75, lng: 106.66, address: "Nguyễn Trãi, Q5", district_id: 1 }
 *   ]
 * }
 */
export async function createPlace(placeData) {
  try {
    const res = await fetch(`${BASE_URL}/place`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(placeData),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Lỗi khi tạo mới địa điểm:", error);
    throw error;
  }
}

/**
 * 7. Lấy danh sách danh mục (categories) từ server
 */
export async function getCategories() {
  try {
    console.log("📡 Fetching categories from:", `${BASE_URL}/category`);
    const res = await fetch(`${BASE_URL}/category`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    console.log("✅ Categories fetched successfully:", result);
    // Backend trả về array trực tiếp hoặc object có `.data` property
    const data = Array.isArray(result) ? result : (result.data || []);
    console.log("📦 Categories after mapping:", data);
    return data;
  } catch (error) {
    console.error("❌ Lỗi khi fetch getCategories:", error);
    throw error;
  }
}

/**
 * 8. Lấy danh sách assets (hình ảnh) theo location_id
 * @param {number} locationId ID của location cần lấy assets
 */
export async function getAssetsByLocationId(locationId) {
  try {
    console.log("📡 Fetching assets for locationId:", locationId);
    const res = await fetch(`${BASE_URL}/location/assets/${locationId}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    console.log("✅ Assets fetched successfully:", result);
    return result.data || [];
  } catch (error) {
    console.error(`❌ Lỗi khi fetch getAssetsByLocationId (${locationId}):`, error);
    throw error;
  }
}

/**
 * 9. Tìm kiếm địa điểm theo tên/địa chỉ bằng DB (hỗ trợ tiếng Việt có/không dấu)
 * @param {string} query Từ khóa tìm kiếm
 * @param {number} [limit=10] Số kết quả tối đa
 */
export async function searchPlaceLocationsByDB(query, limit = 10) {
  try {
    const params = new URLSearchParams({ query, limit });
    const res = await fetch(`${BASE_URL}/search/place-locations-db?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    const items = result.data || [];

    // Map sang cấu trúc FE (tương thích với Map.jsx + LocationDetailPanel)
    // Mỗi địa điểm (Place) có thể có nhiều chi nhánh (Locations). Ta flat ra thành các chi nhánh riêng biệt.
    const searchResults = [];
    items.forEach((item) => {
      const locations = item.locations || [];
      if (locations.length === 0) {
        searchResults.push({
          id: item.place_id,
          placeId: item.place_id,
          name: item.name || "Địa điểm không tên",
          description: item.description || "",
          category: item.category?.name || "Khác",
          category_id: item.category?.id || null,
          categoryId: item.category?.id || null,
          lat: null,
          lng: null,
          address: "",
          iconMarker: item.category?.icon_marker || "",
          markerColor: item.category?.color || "#3b82f6",
          thumbnail: item.thumbnail || null,
          images: item.thumbnail ? [item.thumbnail] : [],
          allLocations: [],
        });
      } else {
        locations.forEach((loc) => {
          searchResults.push({
            id: loc.location_id,
            placeId: item.place_id,
            name: item.name || "Địa điểm không tên",
            description: item.description || "",
            category: item.category?.name || "Khác",
            category_id: item.category?.id || null,
            categoryId: item.category?.id || null,
            lat: loc.lat ? Number(loc.lat) : null,
            lng: loc.lng ? Number(loc.lng) : null,
            address: loc.address || "",
            iconMarker: item.category?.icon_marker || "",
            markerColor: item.category?.color || "#3b82f6",
            thumbnail: item.thumbnail || null,
            images: item.thumbnail ? [item.thumbnail] : [],
            allLocations: item.locations || [],
          });
        });
      }
    });

    return searchResults;
  } catch (error) {
    console.error("❌ Lỗi khi tìm kiếm địa điểm:", error);
    throw error;
  }
}
