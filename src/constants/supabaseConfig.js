// Các bucket names trong Supabase
export const SUPABASE_BUCKETS = {
  ICON_LOCATION: 'icon_location',   // Icon marker cho category
  LOCATION_IMAGES: 'image_location', // Ảnh minh họa cho địa điểm
  POST_IMAGES: 'post',               // Ảnh bài viết của user
  CUISINE_IMAGES: 'cuisines',        // Ảnh ẩm thực
  CUSTOM_IMAGES: 'customs',          // Ảnh phong tục
  FOLK_ART_IMAGES: 'folk-arts',      // Ảnh nghệ thuật dân gian
  EXHIBITION_IMAGES: 'exhibitions',  // Ảnh triển lãm ảo
  PRODUCT_IMAGES: 'product',         // Ảnh sản phẩm của business
  AVATAR: 'avatar',                  // Ảnh đại diện của user
};

// Cấu hình tải ảnh
export const IMAGE_UPLOAD_CONFIG = {
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
};

// Helper function để validate file
export const validateImageFile = (file) => {
  if (!file) {
    throw new Error('No file provided');
  }

  if (!IMAGE_UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`File type not allowed. Supported: ${IMAGE_UPLOAD_CONFIG.ALLOWED_TYPES.join(', ')}`);
  }

  if (file.size > IMAGE_UPLOAD_CONFIG.MAX_SIZE_BYTES) {
    throw new Error(`File size exceeds ${IMAGE_UPLOAD_CONFIG.MAX_SIZE_MB}MB limit`);
  }

  return true;
};
