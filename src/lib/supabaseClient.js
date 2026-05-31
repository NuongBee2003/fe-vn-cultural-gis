import { createClient } from '@supabase/supabase-js';
import { SUPABASE_BUCKETS, validateImageFile } from '@/constants/supabaseConfig';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload file lên Supabase
 * @param {File} file - File cần upload
 * @param {string} bucketName - Tên bucket (từ SUPABASE_BUCKETS constants)
 * @returns {Promise<string>} - Public URL của file
 */
export const uploadImageToSupabase = async (file, bucketName = SUPABASE_BUCKETS.ICON_LOCATION) => {
  try {
    // Validate file
    validateImageFile(file);

    // Tạo tên file unique
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`; 
    console.log('🚀 Uploading file:', { fileName, bucketName, fileSize: file.size });

    // Upload file
    const { error: uploadError, data } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      throw uploadError;
    }

    console.log('✅ Upload successful:', data);

    // Lấy public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    console.log('🔗 Public URL:', publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('❌ Upload error details:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

/**
 * Xóa file từ Supabase
 * @param {string} fileUrl - URL của file cần xóa
 * @param {string} bucketName - Tên bucket
 */
export const deleteImageFromSupabase = async (fileUrl, bucketName = SUPABASE_BUCKETS.ICON_LOCATION) => {
  try {
    // Extract file path from URL
    const urlParts = fileUrl.split('/');
    const filePath = `${urlParts[urlParts.length - 1]}`;

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
};
