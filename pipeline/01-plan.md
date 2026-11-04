# Plan

Thêm ô tìm kiếm phía trên bảng Invoices. Lọc client-side hai hóa đơn từ `BillingPortalService.getBilling()`: INV-1001 (Paid) và INV-1002 (Pending).

## Phạm vi

Trong phạm vi:

- Trang `/billing/invoices`: một ô tìm kiếm nằm trên bảng, trong `mat-card`, dưới header "Billing history".
- Gõ thì bảng chỉ còn dòng có số hóa đơn (`number`), ngày (`date`), hoặc `status` chứa chuỗi tìm (không phân biệt hoa thường). Khớp một trong ba trường là đủ.
- Xóa hết chữ thì hiện lại đủ hai dòng.
- Không khớp thì giữ header bảng và hiện đúng một dòng, một ô `colspan="5"`, chữ đúng `No invoices match`.

Ngoài phạm vi:

- Không sửa `BillingPortalService`, `getBilling()`, hay dữ liệu hóa đơn trong `src/app/domains/admin/data/billing-portal.ts`.
- Không tìm theo amount, id, hay `invoiceUrl`. `299` và `348` không được làm khớp dòng.
- Không đổi sort, menu, link View, `statusClass`, route khác, query param, debounce, hay i18n.
- Coder không tạo file test. Tester thêm test sau theo mục Done khi.

Giả định: chuỗi tìm được `trim`. Chỉ toàn khoảng trắng thì coi như rỗng và hiện full danh sách. Ngày so khớp đúng chuỗi đã format `d MMM yyyy` trên invoice (date-fns, locale mặc định), không parse lại.

## File

- `src/app/domains/admin/modules/billing/features/invoices/billing-invoices.component.ts`
- `src/app/domains/admin/modules/billing/features/invoices/billing-invoices.component.html`

Không tạo file mới.

## Bước

1. Trong component, thêm `query = signal('')` và `visibleInvoices = computed(...)`. Query sau `trim()` rỗng thì trả `this.data.invoices`. Ngược lại lọc invoice mà `number`, `date`, hoặc `status` — đưa về lowercase — `includes` query đã lowercase.
2. Thêm handler gán `query` từ giá trị input. Không import `FormsModule`.
3. Trong template, đặt `<input type="search">` ngay trên khối cuộn của bảng. `aria-label="Search invoices"`. `[value]="query()"` và sự kiện input gọi handler.
4. Đổi `@for` sang `visibleInvoices()`, vẫn `track invoice.id`. Giữ cột, status, amount, link View.
5. Khi `visibleInvoices().length === 0`, render một `<tr>` với một `<td colspan="5">No invoices match</td>`. Không render dòng hóa đơn trong trường hợp đó. Header vẫn hiện.

## Rủi ro

- Quên `toLowerCase` một phía: `paid` trượt `Paid`, `inv-1001` trượt `INV-1001`.
- Lỡ đưa amount vào filter thì `299` khớp INV-1001 dù yêu cầu không tìm số tiền.
- Ngày phụ thuộc `new Date()` trong service. INV-1002 là hôm nay (`d MMM yyyy`); INV-1001 là lùi một tháng. Component không hardcode ngày lịch.
- `100` khớp cả INV-1001 và INV-1002. `p` khớp cả Paid và Pending. Đó là substring đúng.
- Không `trim` thì ` paid ` không khớp Paid.
- Empty state thay cả bảng, sai copy, hoặc thiếu ô khi `@for` rỗng.
- `[value]` không cập nhật khi xóa chữ thì danh sách không trở lại đủ hai dòng.

## Done khi

- Ô trống: thấy INV-1001 (Paid) và INV-1002 (Pending); không thấy `No invoices match`.
- Gõ `inv-1001`: chỉ còn INV-1001. Gõ `PENDING`: chỉ còn INV-1002.
- Gõ một đoạn của ngày đang hiện trên một hóa đơn: chỉ còn hóa đơn đó.
- Gõ `299`: không còn số hóa đơn nào; đúng một ô `No invoices match`.
- Xóa ô, hoặc chỉ còn khoảng trắng: cả hai hóa đơn trở lại; dòng `No invoices match` biến mất.
- Header năm cột và link View của dòng còn lại giữ nguyên.
- `billing-portal.ts` không đổi.
