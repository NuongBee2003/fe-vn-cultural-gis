import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { X, Upload, Download, CheckCircle, AlertTriangle, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table-data/table";

export default function ExcelImportModal({ isOpen, onClose, categories, onSubmit, isMutating }) {
  const [fileData, setFileData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [importResults, setImportResults] = useState(null); // { successCount: 0, failCount: 0, details: [] }
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Tải file mẫu Excel
  const handleDownloadTemplate = () => {
    const data = [
      ["Tên địa điểm", "Mô tả", "Danh mục", "Địa chỉ", "Vĩ độ", "Kinh độ", "Hình ảnh (phân tách bằng dấu phẩy)"],
      ["Bún thang chị Ba", "Quán bún thang ngon nức tiếng", "Quán ăn", "177 ter Cách Mạng Tháng Tám, Quận 3, TP.HCM", 10.77474, 106.68736, "https://example.com/image1.jpg,https://example.com/image2.jpg"],
      ["Mẹ Quê", "Hội tụ đầy đủ các đặc sản 3 miền", "Khác", "493a/2 Cách Mạng Tháng Tám, Quận 10, TP.HCM", 10.78867, 106.67303, ""]
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Đặt độ rộng cho các cột
    const wscols = [
      { wch: 25 }, // Tên địa điểm
      { wch: 30 }, // Mô tả
      { wch: 15 }, // Danh mục
      { wch: 45 }, // Địa chỉ
      { wch: 12 }, // Vĩ độ
      { wch: 12 }, // Kinh độ
      { wch: 50 }, // Hình ảnh
    ];
    ws["!cols"] = wscols;

    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Template_Import_Dia_Diem.xlsx");
  };

  // Đọc file Excel tải lên
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMsg("");
    setFileData([]);
    setImportResults(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (rows.length < 2) {
          setErrorMsg("File Excel trống hoặc không đúng định dạng mẫu.");
          return;
        }

        // Bỏ qua hàng tiêu đề
        const headers = rows[0].map(h => String(h || "").trim());
        const mappedData = [];

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0 || row.every(cell => cell === null || cell === undefined || cell === "")) {
            continue; // Bỏ qua dòng trống
          }

          const rawName = row[0];
          const rawDescription = row[1];
          const rawCategory = row[2];
          const rawAddress = row[3];
          const rawLat = row[4];
          const rawLng = row[5];
          const rawImages = row[6];

          // Tìm category_id tương ứng dựa theo tên danh mục
          const matchedCategory = categories.find(
            (c) => String(c.name || "").toLowerCase() === String(rawCategory || "").toLowerCase()
          );

          // Kiểm tra tính hợp lệ của dòng dữ liệu
          const errors = [];
          if (!rawName) errors.push("Thiếu tên địa điểm");
          if (!rawAddress) errors.push("Thiếu địa chỉ");
          if (rawLat === undefined || rawLat === null || isNaN(Number(rawLat))) errors.push("Vĩ độ không hợp lệ");
          if (rawLng === undefined || rawLng === null || isNaN(Number(rawLng))) errors.push("Kinh độ không hợp lệ");
          if (!matchedCategory && rawCategory) {
            errors.push(`Danh mục "${rawCategory}" không tồn tại trên hệ thống`);
          }

          // Tách mảng ảnh
          const images = rawImages 
            ? String(rawImages).split(",").map(url => url.trim()).filter(Boolean)
            : [];

          mappedData.push({
            index: i,
            name: String(rawName || "").trim(),
            description: String(rawDescription || "").trim(),
            categoryName: String(rawCategory || "").trim(),
            category_id: matchedCategory ? matchedCategory.id : null,
            address: String(rawAddress || "").trim(),
            lat: rawLat ? Number(rawLat) : null,
            lng: rawLng ? Number(rawLng) : null,
            images,
            errors,
            isValid: errors.length === 0,
          });
        }

        setFileData(mappedData);
      } catch (err) {
        console.error("Lỗi đọc file Excel: ", err);
        setErrorMsg("Không thể đọc file Excel. Vui lòng kiểm tra lại định dạng file.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleConfirmImport = async () => {
    const validItems = fileData.filter(item => item.isValid);
    if (validItems.length === 0) {
      alert("Không có dữ liệu hợp lệ để import.");
      return;
    }

    setImporting(true);
    setProgress({ current: 0, total: validItems.length });

    let successCount = 0;
    let failCount = 0;
    const details = [];

    for (let i = 0; i < validItems.length; i++) {
      const item = validItems[i];
      try {
        const payload = {
          name: item.name,
          description: item.description || null,
          category_id: item.category_id,
          locations: [
            {
              address: item.address,
              lat: item.lat,
              lng: item.lng,
              images: item.images,
            }
          ]
        };

        await onSubmit(payload);
        successCount++;
        details.push({ name: item.name, status: "success", message: "Thành công" });
      } catch (err) {
        console.error(`Lỗi import địa điểm "${item.name}": `, err);
        failCount++;
        details.push({ name: item.name, status: "fail", message: err.message || "Lỗi hệ thống" });
      }
      setProgress(prev => ({ ...prev, current: i + 1 }));
    }

    setImporting(false);
    setImportResults({ successCount, failCount, details });
    setFileData([]);
    setFileName("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-4xl max-h-[85vh] rounded-xl bg-background shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Import địa điểm từ Excel</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Hỗ trợ file định dạng .xlsx, .xls</p>
          </div>
          <button
            onClick={onClose}
            disabled={importing}
            className="rounded-full p-1.5 hover:bg-secondary transition-colors disabled:opacity-40"
          >
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* File Template & Upload */}
          {!importing && !importResults && (
            <div className="grid gap-4 md:grid-cols-2">
              {/* Tải Template */}
              <div className="flex flex-col items-center justify-center p-6 border rounded-xl bg-secondary/30 border-dashed text-center">
                <Download size={32} className="text-[#B8922E] mb-3" />
                <h3 className="font-medium text-sm">Chưa có file mẫu?</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                  Tải xuống file Excel mẫu đã được thiết lập sẵn các cột tiêu chuẩn.
                </p>
                <Button
                  onClick={handleDownloadTemplate}
                  variant="outline"
                  size="sm"
                  className="mt-4 border-[#B8922E] text-[#B8922E] hover:bg-[#B8922E]/10"
                >
                  Tải File Mẫu
                </Button>
              </div>

              {/* Upload File */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-6 border rounded-xl hover:bg-secondary/20 cursor-pointer border-dashed text-center transition-colors"
              >
                <Upload size={32} className="text-muted-foreground mb-3" />
                <h3 className="font-medium text-sm">Chọn file từ máy tính</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                  {fileName ? `File đã chọn: ${fileName}` : "Click để chọn file Excel"}
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".xlsx, .xls"
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Lỗi định dạng */}
          {errorMsg && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg flex items-center gap-2">
              <AlertTriangle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Tiến trình Upload */}
          {importing && (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <Loader2 size={40} className="animate-spin text-[#B8922E]" />
              <div className="text-center">
                <p className="font-medium text-sm">Đang nhập dữ liệu vào hệ thống...</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Đang xử lý dòng {progress.current} / {progress.total}
                </p>
              </div>
              <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#B8922E] transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Kết quả Import */}
          {importResults && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                  <span className="block text-2xl font-bold text-green-600">{importResults.successCount}</span>
                  <span className="text-xs text-green-700 font-medium">Thành công</span>
                </div>
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                  <span className="block text-2xl font-bold text-red-600">{importResults.failCount}</span>
                  <span className="text-xs text-red-700 font-medium">Thất bại</span>
                </div>
              </div>

              <div className="border rounded-lg max-h-[250px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên địa điểm</TableHead>
                      <TableHead className="w-[120px]">Trạng thái</TableHead>
                      <TableHead>Chi tiết</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importResults.details.map((detail, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{detail.name}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-0.5 
                            ${detail.status === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                          >
                            {detail.status === "success" ? "Thành công" : "Lỗi"}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{detail.message}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Bảng xem trước dữ liệu */}
          {fileData.length > 0 && !importing && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Xem trước dữ liệu ({fileData.length} địa điểm)</h3>
                <span className="text-xs text-muted-foreground">
                  Số dòng hợp lệ: {fileData.filter(d => d.isValid).length} / {fileData.length}
                </span>
              </div>
              <div className="border rounded-lg max-h-[300px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">Dòng</TableHead>
                      <TableHead>Tên địa điểm</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Địa chỉ</TableHead>
                      <TableHead>Tọa độ (Vĩ, Kinh)</TableHead>
                      <TableHead>Hình ảnh</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fileData.map((row, idx) => (
                      <TableRow key={idx} className={row.isValid ? "" : "bg-destructive/5 hover:bg-destructive/10"}>
                        <TableCell className="text-xs text-muted-foreground font-mono">{row.index}</TableCell>
                        <TableCell className="font-medium">{row.name || "—"}</TableCell>
                        <TableCell>
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium 
                            ${row.category_id ? "bg-secondary" : "bg-yellow-100 text-yellow-800"}`}>
                            {row.categoryName || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate" title={row.address}>{row.address || "—"}</TableCell>
                        <TableCell className="text-xs font-mono">
                          {row.lat !== null && row.lng !== null ? `${row.lat}, ${row.lng}` : "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {row.images.length > 0 ? `${row.images.length} ảnh` : "—"}
                        </TableCell>
                        <TableCell>
                          {row.isValid ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                              <CheckCircle size={14} /> Hợp lệ
                            </span>
                          ) : (
                            <span className="inline-flex flex-col gap-0.5 text-xs text-destructive font-medium" title={row.errors.join("; ")}>
                              <span className="flex items-center gap-1">
                                <AlertTriangle size={14} /> Lỗi
                              </span>
                              <span className="text-[10px] text-muted-foreground leading-normal">{row.errors[0]}</span>
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-secondary/10 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={importing}
          >
            Đóng
          </Button>

          {!importResults && fileData.length > 0 && !importing && (
            <Button
              onClick={handleConfirmImport}
              disabled={fileData.filter(d => d.isValid).length === 0}
              className="bg-[#B8922E] hover:bg-[#a67d22] flex items-center gap-1.5"
            >
              <Play size={15} />
              Bắt đầu Import ({fileData.filter(d => d.isValid).length} hợp lệ)
            </Button>
          )}

          {importResults && (
            <Button
              onClick={() => {
                setImportResults(null);
                onClose();
              }}
              className="bg-[#B8922E] hover:bg-[#a67d22]"
            >
              Hoàn tất
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
