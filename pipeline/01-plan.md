# Plan

Trang Invoices: thêm chip All, Paid, Pending. Chip và ô search cùng lọc (cả hai điều kiện). All là mặc định. Không dòng nào khớp thì vẫn `No invoices match`.

## Phạm vi

Trong phạm vi:

- Trang `/billing/invoices`, trong `mat-card` của `billing-invoices`, thêm một hàng chip ngay trên hàng search hiện có. Ba nút, nhãn đúng `All`, `Paid`, `Pending`.
- `All` được chọn lúc mở trang. Bấm chip đổi lựa chọn; không tắt hết chip. Bấm lại chip đang chọn thì giữ nguyên.
- Lọc là giao của hai điều kiện, trên cùng `visibleInvoices`:
  - Chip: `All` không lọc status; `Paid` chỉ `invoice.status === 'Paid'`; `Pending` chỉ `invoice.status === 'Pending'`. So khớp đúng chữ, không phải chuỗi con.
  - Search giữ nguyên: `query` trim, không phân biệt hoa thường, khớp nếu `invoice.number`, `invoice.date`, hoặc `invoice.status` chứa chuỗi. Ô trống hoặc chỉ khoảng trắng coi như không có từ khóa.
- `resultCount` giữ dạng `` `${visibleInvoices().length} of ${data.invoices.length}` ``. Tử số là danh sách sau cả chip lẫn search. Mẫu số vẫn là toàn bộ `data.invoices` (hiện `2`), không thu thành số dòng của riêng chip.
- Hết dòng thì vẫn một ô `colspan="5"` với đúng chữ `No invoices match`, và count `0 of 2`. Dòng trống không bị tính.
- Dữ liệu hiện tại không đổi: `INV-1001` Paid, `INV-1002` Pending.

Ngoài phạm vi:

- Không thêm chip `Failed`, không thêm status khác, không thêm hóa đơn, không sửa `BillingPortalService` hay `src/app/domains/admin/data/billing-portal.ts`.
- Không đụng trang Spending (`reports-spending`), dashboard, notifications, route, menu, cột, sort, `statusClass`, link View, hay `onQueryInput`.
- Không đưa filter lên query param. Gõ search không tự đưa chip về All; đổi chip không xóa ô search.
- Không đổi hàng search: `input` vẫn `aria-label="Search invoices"`, `nextElementSibling` vẫn là span count. Chip không nằm trong hàng đó và không chen giữa input và count.
- Coder không tạo hoặc sửa test. Tester thêm case vào `src/app/domains/admin/modules/billing/features/invoices/billing-invoices.component.spec.ts` sau, theo mục Done khi.

Giả định: chip là `<button type="button">` cùng kiểu nút lọc của notifications (`rounded-full`, nền `bg-primary-600 text-white` khi chọn, nền trung tính khi không). Không thêm `MatChip`. `aria-pressed` là `true` đúng trên chip đang chọn để test nhận ra All mặc định. Hàng chip là anh em phía trên hàng `mt-4 flex items-center gap-3`, không phải con của hàng đó.

## File

- `src/app/domains/admin/modules/billing/features/invoices/billing-invoices.component.ts`
- `src/app/domains/admin/modules/billing/features/invoices/billing-invoices.component.html`

Không tạo file mới. Không sửa `src/app/domains/admin/modules/billing/features/invoices/billing-invoices.component.spec.ts` ở bước Coder.

## Bước

1. Trong component, thêm kiểu `'all' | 'Paid' | 'Pending'`, signal `statusFilter` khởi tạo `'all'`, và mảng nhãn `All` / `Paid` / `Pending`. Thêm hàm gán signal khi bấm chip.
2. Sửa `visibleInvoices` để vừa lọc status theo chip vừa giữ filter search hiện tại. `All` và query rỗng (sau trim) trả về đúng `data.invoices`. Không sửa `resultCount`, `onQueryInput`, hay `statusClass`.
3. Trong template, sau `mat-card-header` và trước hàng search, thêm hàng chip `flex flex-wrap items-center gap-1.5` với `role="group"` và `aria-label="Invoice status"`. Mỗi chip là button, `[attr.aria-pressed]` theo signal, `(click)` gọi hàm ở bước 1. Hàng search, input, span `resultCount()`, bảng, và nhánh `No invoices match` giữ nguyên.

## Rủi ro

- Chèn chip vào giữa `input` và span count làm `nextElementSibling` trong spec hiện tại trỏ sai. Chip phải đứng ở hàng riêng phía trên.
- Đổi class hàng search (`mt-4`, `flex`, `items-center`, `gap-3`) hoặc class input / count làm các assertion layout hiện có gãy dù filter đúng.
- Lọc OR (chip hoặc search) sẽ cho `PENDING` vẫn ra `INV-1002` khi đang chọn Paid. Phải là AND.
- So status bằng `includes` hoặc chữ thường sẽ khiến chip Paid nuốt cả chuỗi không phải status `Paid`. Chip so bằng `===` với `'Paid'` / `'Pending'`.
- Đưa mẫu số về số dòng của chip (Paid thành `1 of 1`) lệch count đang có. Mẫu số vẫn `data.invoices.length`.
- All không phải mặc định thì các case search cũ (ô trống `2 of 2`, `inv-1001` `1 of 2`, `PENDING` còn `INV-1002`, `299` ra `0 of 2`) fail vì trang mở đã lọc mất một hóa đơn.
- ` paid ` với chip Pending phải ra rỗng: search chỉ khớp status `Paid` của `INV-1001`, chip lại đòi `Pending`. Ngược lại, chip Paid và query `PENDING` cũng rỗng, vẫn một ô `No invoices match`.
- Query `100` với All vẫn cả hai hóa đơn (`2 of 2`); với Paid chỉ `INV-1001`; với Pending chỉ `INV-1002`.
- `299` và `348` vẫn không khớp amount. Chip Paid cộng `299` vẫn `0 of 2`.
- Nhãn chip làm `textContent` của cả trang luôn có chữ `Paid` và `Pending`. Test mới phải đọc status ở ô trong `tbody`, không kết luận “không còn Paid” từ cả host.
- Thêm chip Failed hoặc một hóa đơn mới nằm ngoài yêu cầu và làm `2 of 2` thành số khác.

## Done khi

- Mở trang: ba chip `All`, `Paid`, `Pending`; chỉ `All` có `aria-pressed="true"`. Bảng còn `INV-1001` (Paid) và `INV-1002` (Pending). Count `2 of 2`. Không có `No invoices match`.
- Bấm Paid, ô search trống: chỉ `INV-1001`; count `1 of 2`; `Paid` pressed, `All` không pressed.
- Bấm Pending, ô search trống: chỉ `INV-1002`; count `1 of 2`.
- Bấm lại All: cả hai hóa đơn và `2 of 2`.
- All giữ nguyên hành vi search cũ: `inv-1001` → chỉ `INV-1001`, `1 of 2`; `PENDING` → chỉ `INV-1002`, `1 of 2`; `100` → cả hai, `2 of 2`; ` paid ` → chỉ `INV-1001`, `1 of 2`; `299` hoặc `348` → không số hóa đơn, một ô đúng `No invoices match`, count `0 of 2`; xóa ô hoặc chỉ khoảng trắng → `2 of 2` và cả hai hóa đơn.
- Paid và query `100`: chỉ `INV-1001`, `1 of 2`. Pending và query `100`: chỉ `INV-1002`, `1 of 2`.
- Paid và query `PENDING`: không số hóa đơn, một ô `No invoices match`, `0 of 2`. Pending và query ` paid `: cùng empty state đó.
- Đổi chip không xóa chữ trong ô search; gõ tiếp không tự chọn lại All.
- Hàng search và span count giữ chỗ cũ (count là phần tử ngay sau input). Header năm cột, menu, link View không đổi. Không có chip Failed. `billing-portal.ts` và trang Spending không đổi.
