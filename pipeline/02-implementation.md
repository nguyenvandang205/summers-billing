# Implementation

## Đã làm

Đã thêm ô tìm kiếm client-side trên trang `/billing/invoices`, đúng plan.

- `query` là `signal('')`. `visibleInvoices` trim query; chuỗi rỗng hoặc chỉ khoảng trắng trả về đủ `this.data.invoices`. Ngược lại lọc invoice khi `number`, `date`, hoặc `status` (lowercase) `includes` query đã lowercase. Không lọc amount, id, hay `invoiceUrl`.
- Handler `onQueryInput` gán `query` từ `input`. Không import `FormsModule`.
- Input `type="search"` nằm trong `mat-card`, dưới header "Billing history", ngay trên khối cuộn của bảng. `aria-label="Search invoices"`, `[value]="query()"`, sự kiện `input` gọi handler.
- `@for` dùng `visibleInvoices()`, vẫn `track invoice.id`. Cột, status, amount, link View, sort, menu giữ nguyên.
- Khi không còn dòng, một `<tr>` với một `<td colspan="5">No invoices match</td>`. Header năm cột vẫn hiện. Không render dòng hóa đơn trong trường hợp đó.
- Không sửa `BillingPortalService`, `getBilling()`, hay `billing-portal.ts`. Không tạo file test.

Đã kiểm tra trên `/billing/invoices`: ô trống hiện INV-1001 (Paid) và INV-1002 (Pending); `inv-1001` còn INV-1001; `PENDING` còn INV-1002; `Oct` còn hóa đơn tháng 10; `299` còn đúng một ô `No invoices match`; khoảng trắng và xóa ô đưa lại đủ hai dòng; ` paid ` còn INV-1001.

## File đã sửa

- `src/app/domains/admin/modules/billing/features/invoices/billing-invoices.component.ts`
- `src/app/domains/admin/modules/billing/features/invoices/billing-invoices.component.html`
- `pipeline/02-implementation.md`
