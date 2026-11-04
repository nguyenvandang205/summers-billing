# Review

## Verdict

`APPROVE`

## Lý do

Diff khớp plan. Production chỉ sửa `billing-invoices.component.ts` và `.html`: thêm `InvoiceStatusFilter` (`'all' | 'Paid' | 'Pending'`), signal `statusFilter` khởi tạo `'all'`, mảng nhãn `All` / `Paid` / `Pending`, và `setStatusFilter` chỉ gán signal (bấm lại chip đang chọn giữ nguyên). `visibleInvoices` là giao hai điều kiện: chip khác `All` so `invoice.status ===` đúng chữ; search giữ trim, không phân biệt hoa thường, `includes` trên `number`, `date`, `status`. `All` và query rỗng sau trim trả về đúng `data.invoices`. Không sửa `resultCount`, `onQueryInput`, hay `statusClass`; mẫu số vẫn `data.invoices.length`. Template thêm hàng chip `flex flex-wrap items-center gap-1.5`, `role="group"`, `aria-label="Invoice status"`, sau `mat-card-header` và trước hàng search. Mỗi chip là `<button type="button">` cùng kiểu nút lọc notifications, `aria-pressed` chỉ `true` trên chip đang chọn. Hàng search, input, span count, bảng, và `No invoices match` giữ nguyên. Không thêm chip Failed, không sửa dữ liệu, không đụng `billing-portal.ts` hay trang Spending. Spec chỉ được Tester bổ sung case (đổi tên describe và xuống dòng một điều kiện cũ); assertion search sẵn có không đổi.

Hai mươi hai test PASS (`ng test --watch=false`, 22/22) phủ mục Done khi: mở trang chỉ `All` pressed, bảng còn `INV-1001` (Paid) và `INV-1002` (Pending), count `2 of 2`; Paid và Pending với ô trống ra đúng một hóa đơn và `1 of 2`; bấm lại All trả `2 of 2`; bấm lại chip đang chọn giữ lọc; search cũ (`inv-1001`, `PENDING`, `100`, ` paid `, `299`, `348`, khoảng trắng, xóa ô) vẫn đúng khi All là mặc định và không tự đổi chip; Paid/`100` chỉ `INV-1001`, Pending/`100` chỉ `INV-1002`; Paid/`PENDING` và Pending/` paid ` ra một ô `No invoices match` và `0 of 2`; đổi chip không xóa ô, gõ tiếp không tự chọn All; `299` và `348` vẫn không khớp amount; status đọc từ ô trong `tbody`. Rủi ro đã chặn: chip đứng hàng riêng nên count vẫn là phần tử ngay sau input; hàng search không đổi class; lọc là AND và so status bằng `===`; mẫu số không thu thành `1 of 1`; All mặc định nên case search cũ không mất hóa đơn. Không có lỗi chặn merge.
