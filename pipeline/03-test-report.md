# Test report

## Kết quả

`PASS`

## Case

Spec: `src/app/domains/admin/modules/billing/features/invoices/billing-invoices.component.spec.ts` (10 tests). Drives the search input (`aria-label="Search invoices"`) and reads the rendered count next to it plus the table. Does not change production code.

- Ô trống: chữ đúng `2 of 2` là phần tử ngay bên phải ô search, cùng hàng `mt-4 flex items-center gap-3`. Input có `min-w-0 flex-1`, không còn `mt-4`. Span đếm có `shrink-0 whitespace-nowrap`, `textContent` đúng `2 of 2` (một khoảng trắng mỗi bên `of`, không thêm từ). Span không nằm trong `table`, `thead`, `mat-card-header`, hay `mat-menu`. Vẫn `INV-1001` (Paid) và `INV-1002` (Pending); không có `No invoices match`; header Invoice, Date, Status, Amount, Action; hai link View.
- `inv-1001`: chữ `1 of 2`; bảng chỉ còn `INV-1001`; không có INV-1002 hay `No invoices match`; header năm cột còn; một link View `href="#"`.
- `PENDING`: chữ `1 of 2`; chỉ INV-1002 (Pending); không có INV-1001 hay `No invoices match`.
- `299`: chữ `0 of 2` dù `tbody` vẫn còn một `<tr>`; không còn INV-1001 / INV-1002; đúng một `td[colspan="5"]` với chữ `No invoices match`; header năm cột còn; không còn link View. Dòng trống không bị đếm thành `1 of 2`.
- Chỉ khoảng trắng (`   `) sau `299`: chữ về `2 of 2`; cả hai hóa đơn trở lại; dòng `No invoices match` biến mất.
- Xóa ô (chuỗi rỗng) sau `PENDING`: chữ về `2 of 2`; cả hai hóa đơn trở lại; không còn `No invoices match`.
- `100`: vẫn `2 of 2` và cả INV-1001 và INV-1002.
- ` paid ` (trim): chữ `1 of 2` và chỉ INV-1001.
- `348`: không khớp amount; chữ `0 of 2`; đúng một ô `No invoices match`; một `tbody tr` không được tính.
- Đoạn ngày đang hiện trên hóa đơn đầu (token duy nhất, lowercase): chữ `1 of 2` và chỉ còn hóa đơn đó.
- `src/app/domains/admin/data/billing-portal.ts` không đổi (`git diff --stat` không liệt kê file này).

## Lệnh đã chạy

1. `npm ci` → exit 0. Cài dependency vì chưa có `node_modules`. Cảnh báo `EBADENGINE` (package yêu cầu Node `>=24`, môi trường đang `v22.23.4`); cài đặt vẫn xong.

2. `npm test -- --watch=false` → `ng test --watch=false`. Exit 0.

```
Test Files  1 passed (1)
     Tests  10 passed (10)
  Duration  2.70s
```
