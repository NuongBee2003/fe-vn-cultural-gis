import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button/button";
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
import { useCategories } from "@/api/user/useLocationQuery";
import { useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/api/user/categoryApi";
import CategoryFormModal from "@/components/dashboard/CategoryFormModal";
import { deleteImageFromSupabase } from "@/lib/supabaseClient";
import { SUPABASE_BUCKETS } from "@/constants/supabaseConfig";

import { useNotify } from "@/context/NotifyContext";

const PAGE_SIZES = [5, 10, 15, 20];

export default function CategoriesManagementPage() {
  const notify = useNotify();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { data: rawCategories = [] } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const CATEGORIES = useMemo(() => {
    if (!rawCategories || !Array.isArray(rawCategories)) {
      return [];
    }
    return rawCategories.map((c, index) => ({
      id: c.id || index + 1,
      name: c.name || "",
      icon_marker: c.icon_marker || "",
      color: c.color || "#B8922E",
      key: c.name || index,
      status: "Hoạt động",
    }));
  }, [rawCategories]);






  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return CATEGORIES;
    }

    return CATEGORIES.filter((category) => {
      return category.name.toLowerCase().includes(query);
    });
  }, [search, CATEGORIES]);

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / pageSize));
  const activePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (activePage - 1) * pageSize;
    return filteredCategories.slice(start, start + pageSize);
  }, [filteredCategories, activePage, pageSize]);

  return (
    <main className="px-6 py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Quản lý danh mục</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Danh sách các danh mục văn hóa, thể loại và trạng thái phần loại.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_auto]">
            <label className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Tìm kiếm</span>
              <Input
                placeholder="Tên danh mục..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Số hàng / trang</span>
              <select
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
              >
                {PAGE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <Button
            onClick={() => {
              setSelectedCategory(null);
              setIsModalOpen(true);
            }}
            className="bg-[#B8922E] hover:bg-[#a67d22] h-8"
          >
            + Tạo danh mục
          </Button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border bg-background shadow-sm">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Tên danh mục</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Màu sắc</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.map((category, index) => (
              <TableRow key={category.id}>
                <TableCell>{(activePage - 1) * pageSize + index + 1}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  {category.icon_marker ? (
                    <img
                       src={category.icon_marker}
                      alt={category.name}
                      className="h-8 w-8 object-cover rounded"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">Không có</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: category.color || "#B8922E" }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {category.color || "#B8922E"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsModalOpen(true);
                    }}
                    disabled={updateMutation.isPending}
                  >
                    Sửa
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={async () => {
                      const ok = await notify.confirm(
                        `Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`,
                        { title: "Xóa danh mục", confirmLabel: "Xóa" }
                      );
                      if (!ok) return;

                      deleteMutation.mutate(category.id, {
                        onSuccess: async () => {
                          notify.success("Đã xóa danh mục thành công.");
                          if (category.icon_marker && category.icon_marker.includes("supabase.co")) {
                            try {
                              await deleteImageFromSupabase(category.icon_marker, SUPABASE_BUCKETS.ICON_LOCATION);
                            } catch (err) {
                              console.error("Lỗi xóa icon trên Supabase:", err);
                            }
                          }
                        },
                        onError: (error) => {
                          notify.error(error.message || "Không thể xóa danh mục này");
                        }
                      });
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị {pageItems.length} trên tổng {filteredCategories.length} danh mục
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={activePage === 1}
                      onClick={() => setPage((prev) => Math.max(Math.min(prev, totalPages) - 1, 1))}
                    >
                      Trang trước
                    </Button>
                    <span className="text-sm text-foreground">
                      {activePage} / {totalPages}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={activePage === totalPages}
                      onClick={() => setPage((prev) => Math.min(Math.min(prev, totalPages) + 1, totalPages))}
                    >
                      Trang sau
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* Modal Form */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        initialData={selectedCategory}
        isLoading={createMutation.isPending || updateMutation.isPending}
        onSubmit={async (formData) => {
          try {
            if (selectedCategory) {
              await updateMutation.mutateAsync({
                id: selectedCategory.id,
                data: formData,
              });
            } else {
              await createMutation.mutateAsync(formData);
            }
            setIsModalOpen(false);
            setSelectedCategory(null);
          } catch (error) {
            console.error(error);
          }
        }}
      />
    </main>
  );
}
