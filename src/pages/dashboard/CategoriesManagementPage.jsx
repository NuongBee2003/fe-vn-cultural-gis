import { useEffect, useMemo, useState } from "react";
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
import { FILTERS } from "@/constants/mapFilters";

const PAGE_SIZES = [5, 10, 15, 20];

const CATEGORIES = FILTERS.filter((filter) => filter.key !== "all").map((filter, index) => ({
  id: index + 1,
  name: filter.label,
  key: filter.key,
  status: "Hoạt động",
}));

export default function CategoriesManagementPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return CATEGORIES;
    }

    return CATEGORIES.filter((category) => {
      return category.name.toLowerCase().includes(query);
    });
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCategories.slice(start, start + pageSize);
  }, [filteredCategories, page, pageSize]);

  return (
    <main className="px-6 py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Quản lý danh mục</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Danh sách các danh mục văn hóa, thể loại và trạng thái phần loại.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_auto] md:w-130">
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
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border bg-background shadow-sm">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Tên danh mục</TableHead>
              <TableHead className="text-right">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.map((category, index) => (
              <TableRow key={category.id}>
                <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell className="text-right">
                  <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-foreground/80">
                    {category.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị {pageItems.length} trên tổng {filteredCategories.length} danh mục
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    >
                      Trang trước
                    </Button>
                    <span className="text-sm text-foreground">
                      {page} / {totalPages}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
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
    </main>
  );
}
