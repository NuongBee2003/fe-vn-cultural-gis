import { useEffect, useMemo, useState } from "react";
import { ALL_LOCATIONS } from "@/constants/mapLocations";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table-data/table";

const PAGE_SIZES = [5, 10, 15, 20];

export default function PlacesManagementPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredLocations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return ALL_LOCATIONS;
    }

    return ALL_LOCATIONS.filter((location) => {
      return (
        location.name.toLowerCase().includes(query) ||
        location.category.toLowerCase().includes(query)
      );
    });
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredLocations.length / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredLocations.slice(start, start + pageSize);
  }, [filteredLocations, page, pageSize]);

  return (
    <main className="px-6 py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Quản lý địa điểm</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Xem danh sách địa điểm và điều hướng trang để quản lý dữ liệu.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_auto] md:w-[520px]">
          <label className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Tìm kiếm</span>
            <Input
              placeholder="Tên địa điểm hoặc thể loại..."
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
              <TableHead>Tên địa điểm</TableHead>
              <TableHead>Thể loại</TableHead>
              <TableHead>Vĩ/ Kinh độ</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.map((location, index) => (
              <TableRow key={`${location.name}-${index}`}>
                <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                <TableCell>{location.name}</TableCell>
                <TableCell>{location.category}</TableCell>
                <TableCell>
                  {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" type="button">
                    Chi tiết
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
                    Hiển thị {pageItems.length} trên tổng {filteredLocations.length} địa điểm
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
