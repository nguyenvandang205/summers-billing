# Implementation

## Đã làm

Đã thêm chip All, Paid, Pending trên `/billing/invoices`, lọc giao với search hiện có, đúng plan.

- Kiểu `InvoiceStatusFilter = 'all' | 'Paid' | 'Pending'`. Signal `statusFilter` khởi tạo `'all'`. Mảng `statusFilters` có nhãn `All`, `Paid`, `Pending`. `setStatusFilter` gán signal khi bấm chip; bấm lại chip đang chọn giữ nguyên giá trị.
- `visibleInvoices` lọc AND: chip `All` không lọc status; `Paid` và `Pending` so `invoice.status ===` đúng chữ. Search giữ trim, không phân biệt hoa thường, khớp `number`, `date`, hoặc `status` bằng `includes`. `All` và query rỗng sau trim trả về đúng `data.invoices`. Không sửa `resultCount`, `onQueryInput`, hay `statusClass`. Mẫu số vẫn `data.invoices.length`.
- Template: hàng chip `flex flex-wrap items-center gap-1.5`, `role="group"`, `aria-label="Invoice status"`, đứng sau `mat-card-header` và trước hàng search. Mỗi chip là `<button type="button">` kiểu nút lọc notifications (`rounded-full`, `bg-primary-600 text-white` khi chọn, nền trung tính khi không). `aria-pressed` là `true` chỉ trên chip đang chọn. Hàng search, input, span count, bảng, và `No invoices match` giữ nguyên. Không thêm chip Failed, không sửa dữ liệu, không tạo file mới, không sửa test.

## File đã sửa

- `src/app/domains/admin/modules/billing/features/invoices/billing-invoices.component.ts`
- `src/app/domains/admin/modules/billing/features/invoices/billing-invoices.component.html`
