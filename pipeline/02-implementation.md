# Implementation

## Đã làm

Đã thêm bộ đếm `visible of total` cạnh ô search trên `/billing/invoices`, đúng plan.

- `resultCount` là `computed` trả về `` `${this.visibleInvoices().length} of ${this.data.invoices.length}` ``. Không sửa `visibleInvoices`, `query`, `onQueryInput`, hay `statusClass`.
- `total` lấy từ `data.invoices.length`, không hardcode `2`. Ô trống hoặc chỉ khoảng trắng vẫn đếm đủ danh sách (`2 of 2` với dữ liệu hiện tại). Khớp một hóa đơn là `1 of 2`. Không khớp là `0 of 2`. Dòng `No invoices match` không được tính.
- Template bọc input trong hàng `mt-4 flex items-center gap-3`. Input giữ `aria-label="Search invoices"`, `[value]`, `(input)`; bỏ `mt-4` khỏi input; thêm `min-w-0 flex-1`. Ngay sau input, một `span` chỉ render `{{ resultCount() }}`, có `shrink-0` và `whitespace-nowrap`.
- Không đổi `@for`, nhánh `visibleInvoices().length === 0`, chữ `No invoices match`, cột, sort, menu, hay link View. Không sửa `BillingPortalService`, `getBilling()`, hay `billing-portal.ts`. Không tạo file mới và không sửa test.

## File đã sửa

- `src/app/domains/admin/modules/billing/features/invoices/billing-invoices.component.ts`
- `src/app/domains/admin/modules/billing/features/invoices/billing-invoices.component.html`
