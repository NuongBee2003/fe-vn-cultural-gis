import React, { useState, useEffect } from "react";
import DashboardSectionPage from "./DashboardSectionPage";
import { Input } from "@/components/ui/input/input";
import { Button } from "@/components/ui/button/button";
import { settingApi } from "@/api/admin/settingApi";
import { useNotify } from "@/context/NotifyContext";
import { uploadImageToSupabase } from "@/lib/supabaseClient";
import { SUPABASE_BUCKETS } from "@/constants/supabaseConfig";
import { Save, Upload, Loader2, Image as ImageIcon, X, Edit } from "lucide-react";

export default function SettingsManagementPage() {
  const [settingsData, setSettingsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [localValues, setLocalValues] = useState({});
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const notify = useNotify();

  const actualData = Array.isArray(settingsData) 
    ? settingsData 
    : (settingsData?.data && Array.isArray(settingsData.data)) 
      ? settingsData.data 
      : [];

  useEffect(() => {
    if (actualData.length > 0) {
      const initialValues = {};
      actualData.forEach((setting) => {
        if (setting && setting.setting_key) {
          initialValues[setting.setting_key] = setting.setting_value || "";
        }
      });
      setLocalValues((prev) => Object.keys(prev).length === 0 ? initialValues : prev);
    }
  }, [actualData]);

  useEffect(() => {
    let active = true;
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const result = await settingApi.getAllSettings();
        if (!active) return;
        setSettingsData(Array.isArray(result) ? result : (result.data || []));
      } catch (error) {
        console.error("Lỗi khi lấy cấu hình hệ thống:", error);
        if (!active) return;
        setSettingsData([]);
      } finally {
        if (!active) return;
        setIsLoading(false);
      }
    };

    loadSettings();
    return () => {
      active = false;
    };
  }, []);

  const openEditModal = (key, currentValue) => {
    setEditingKey(key);
    setEditValue(currentValue || "");
    setEditFile(null);
    setEditPreview(currentValue || "");
  };

  const closeEditModal = () => {
    setEditingKey(null);
    setEditValue("");
    setEditFile(null);
    setEditPreview("");
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setEditFile(selectedFile);
      setEditPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSaveSingle = async () => {
    if (!editingKey) return;
    
    try {
      setIsSaving(true);
      let valueToSave = editValue;

      // Nếu có ảnh mới
      if (editFile) {
        const targetBucket = editingKey === "LOGO" ? "logo" : SUPABASE_BUCKETS.LOCATION_IMAGES;
        valueToSave = await uploadImageToSupabase(
          editFile,
          targetBucket
        );
      }

      await settingApi.updateSettings([{
        setting_key: editingKey,
        setting_value: valueToSave,
      }]);
      
      // Cập nhật local state ngay lập tức để UI không bị giật
      setLocalValues(prev => ({ ...prev, [editingKey]: valueToSave }));
      setSettingsData((prev) =>
        prev.map((setting) =>
          setting.setting_key === editingKey
            ? { ...setting, setting_value: valueToSave }
            : setting
        )
      );
      notify.success("Cập nhật thành công!");
      closeEditModal();
      
    } catch (error) {
      console.error(error);
      notify.error("Lỗi khi lưu cấu hình: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const renderFieldRow = (setting) => {
    const key = setting.setting_key;
    const isImage = key === "LOGO" || key.includes("IMAGE") || key.includes("ICON");
    const currentValue = localValues[key] || "";

    return (
      <div key={key} className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-gray-100 last:border-0 gap-6 hover:bg-gray-50/50 transition-colors px-2 rounded-lg">
        <div className="sm:w-1/3 shrink-0">
          <label className="block text-sm font-semibold text-gray-800">
            {key}
          </label>
          {setting.description && (
            <span className="text-xs text-gray-500 mt-1 block">{setting.description}</span>
          )}
        </div>
        
        <div className="flex-1 overflow-hidden">
          {isImage ? (
            <div className="h-14 w-auto max-w-[12rem] bg-gray-50 rounded border border-gray-100 flex items-center justify-center p-1">
              {currentValue ? (
                <img src={currentValue} alt={key} className="h-full w-full object-contain" />
              ) : (
                <span className="text-xs text-gray-400">Chưa có ảnh</span>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-700 truncate max-w-full">
              {currentValue || <span className="text-gray-400 italic">Chưa có dữ liệu</span>}
            </div>
          )}
        </div>
        
        <div className="sm:w-28 flex justify-end shrink-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => openEditModal(key, currentValue)}
            className="flex items-center gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Edit size={14} />
            Sửa
          </Button>
        </div>
      </div>
    );
  };

  const renderModal = () => {
    if (!editingKey) return null;

    const isImage = editingKey === "LOGO" || editingKey.includes("IMAGE") || editingKey.includes("ICON");
    const settingObj = actualData.find(s => s.setting_key === editingKey) || {};

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h3 className="font-semibold text-gray-800">Chỉnh sửa {editingKey}</h3>
              {settingObj.description && (
                <p className="text-xs text-gray-500 mt-0.5">{settingObj.description}</p>
              )}
            </div>
            <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6">
            {isImage ? (
              <div className="flex flex-col items-center">
                <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 relative group mb-4">
                  {editPreview ? (
                    <img src={editPreview} alt="Preview" className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-sm">Chưa có hình ảnh</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <label className="cursor-pointer text-white flex flex-col items-center p-4">
                      <Upload size={24} className="mb-2" />
                      <span className="text-sm font-medium">Chọn ảnh để tải lên</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <label className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800 w-full text-center py-2 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  Tải ảnh từ máy tính
                </label>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giá trị mới</label>
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder={`Nhập giá trị cho ${editingKey}`}
                  className="w-full"
                  autoFocus
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100 bg-gray-50/50">
            <Button variant="ghost" onClick={closeEditModal} disabled={isSaving}>
              Hủy
            </Button>
            <Button 
              onClick={handleSaveSingle} 
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Lưu thay đổi"}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardSectionPage
      title="Cài đặt hệ thống"
      description="Quản lý các cấu hình và thiết lập chung của ứng dụng"
    >
      <div className="bg-white p-6 rounded-lg border border-gray-200 max-w-4xl shadow-sm">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="flex flex-col">
            
            {actualData && actualData.length > 0 && (
              <div className="hidden sm:flex bg-gray-100/80 px-4 py-3 border-b border-gray-200 rounded-t-lg font-semibold text-gray-700 gap-6">
                <div className="w-1/3 shrink-0">Cấu hình</div>
                <div className="flex-1">Giá trị</div>
                <div className="w-28 text-right shrink-0">Thao tác</div>
              </div>
            )}

            <div className="flex flex-col pt-2">
              {actualData && actualData.map((setting) => renderFieldRow(setting))}
            </div>

            {(!actualData || actualData.length === 0) && (
              <div className="text-gray-500 text-sm">
                <p>Chưa có cấu hình nào trong hệ thống, hoặc dữ liệu không đúng định dạng.</p>
                {settingsData && <pre className="mt-4 p-2 bg-gray-100 rounded text-xs">{JSON.stringify(settingsData, null, 2)}</pre>}
              </div>
            )}
          </div>
        )}
      </div>

      {renderModal()}
    </DashboardSectionPage>
  );
}
