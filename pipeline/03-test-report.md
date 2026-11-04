# Test report

## Kết quả

`PASS`

## Case

Spec: `src/app/domains/admin/modules/billing/features/invoices/billing-invoices.component.spec.ts` (22 tests). Drives the search input (`aria-label="Search invoices"`) and the status chips (`role="group"`, `aria-label="Invoice status"`). Status is read from the status cell in `tbody`, not from the whole host: chip labels always contain `Paid` and `Pending`. Does not change production code. The 10 existing search tests are unchanged and still pass with `All` as the default.

- Ô trống, All mặc định: chữ đúng `2 of 2` là phần tử ngay bên phải ô search, cùng hàng `mt-4 flex items-center gap-3`. Input có `min-w-0 flex-1`, không còn `mt-4`. Span đếm có `shrink-0 whitespace-nowrap`, `textContent` đúng `2 of 2`. Span không nằm trong `table`, `thead`, `mat-card-header`, hay `mat-menu`. Vẫn `INV-1001` và `INV-1002`; không có `No invoices match`; header Invoice, Date, Status, Amount, Action; hai link View.
- `inv-1001`: chữ `1 of 2`; bảng chỉ còn `INV-1001`; không có INV-1002 hay `No invoices match`; header năm cột còn; một link View `href="#"`.
- `PENDING`: chữ `1 of 2`; chỉ INV-1002; không có INV-1001 hay `No invoices match`.
- `299`: chữ `0 of 2` dù `tbody` vẫn còn một `<tr>`; không còn INV-1001 / INV-1002; đúng một `td[colspan="5"]` với chữ `No invoices match`; header năm cột còn; không còn link View. Dòng trống không bị đếm thành `1 of 2`.
- Chỉ khoảng trắng (`   `) sau `299`: chữ về `2 of 2`; cả hai hóa đơn trở lại; dòng `No invoices match` biến mất.
- Xóa ô (chuỗi rỗng) sau `PENDING`: chữ về `2 of 2`; cả hai hóa đơn trở lại; không còn `No invoices match`.
- `100`: vẫn `2 of 2` và cả INV-1001 và INV-1002.
- ` paid ` (trim): chữ `1 of 2` và chỉ INV-1001.
- `348`: không khớp amount; chữ `0 of 2`; đúng một ô `No invoices match`; một `tbody tr` không được tính.
- Đoạn ngày đang hiện trên hóa đơn đầu (token duy nhất, lowercase): chữ `1 of 2` và chỉ còn hóa đơn đó.
- Mở trang: hàng chip đứng ngay sau `mat-card-header` và ngay trước hàng search (`previousElementSibling`), không nằm trong hàng search và không chen giữa input và span count. Hàng chip có `flex flex-wrap items-center gap-1.5`. Đúng ba `<button type="button">` nhãn `All`, `Paid`, `Pending`. Không có chip `Failed`. Chỉ `All` có `aria-pressed="true"`; Paid và Pending là `false`. Chip chọn có `rounded-full`, `bg-primary-600`, `text-white`; chip không chọn có `rounded-full` và `bg-neutral-100`, không có `bg-primary-600`. `tbody` status đúng `Paid` rồi `Pending`. Count `2 of 2`. Không có `No invoices match`. `mat-menu` vẫn nằm trong header. Hai link View.
- Bấm Paid, ô search trống: `tbody` chỉ `INV-1001` với status `Paid` (không đọc “hết Pending” từ cả host — host vẫn còn chữ Pending trên chip). Count `1 of 2`, không phải `1 of 1`. `Paid` pressed, `All` và `Pending` không pressed. Một link View `href="#"`.
- Bấm Pending, ô search trống: `tbody` chỉ `INV-1002` với status `Pending`. Count `1 of 2`. Host vẫn còn chữ Paid trên chip All/Paid.
- Bấm lại All sau Paid: cả hai hóa đơn, status `Paid` và `Pending` trong `tbody`, count `2 of 2`, chỉ All pressed.
- Bấm lại chip đang chọn: Paid giữ Paid (`INV-1001`, `1 of 2`); Pending giữ Pending (`INV-1002`, `1 of 2`). Luôn đúng một chip pressed.
- Gõ search không tự đổi chip: lần lượt `inv-1001`, `PENDING`, `100`, ` paid `, `299`, `348`, `   `, chuỗi rỗng — All vẫn là chip pressed duy nhất và chữ trong ô giữ nguyên từng giá trị đó.
- Paid và query `100`: chỉ `INV-1001`, status `Paid` trong `tbody`, `1 of 2`, ô search vẫn `100`. Pending và query `100`: chỉ `INV-1002`, status `Pending`, `1 of 2`, ô search vẫn `100`. Quay lại All với query `100`: cả hai, `2 of 2`.
- Paid và query `PENDING` (AND, không phải OR): không số hóa đơn, một ô `No invoices match`, count `0 of 2`, header năm cột còn, chip vẫn Paid. Host vẫn chứa chữ Paid và Pending vì nhãn chip.
- Pending và query ` paid `: cùng empty state, ô search vẫn ` paid `, chip vẫn Pending.
- Đổi chip không xóa ô search. Đang Paid với `100`, gõ tiếp `1002`: ô thành `1002`, không tự chọn lại All, `tbody` không còn hóa đơn, `0 of 2`, một ô `No invoices match`.
- Amount không nằm trong search: Paid và `299` ra `0 of 2`. Đổi sang Pending rồi gõ `348`: ô vẫn `348`, chip vẫn Pending, `0 of 2`, một ô `No invoices match`.
- Khoảng trắng và chuỗi rỗng không phải từ khóa nhưng chip vẫn lọc: Pending với `   ` hoặc ô xóa sạch vẫn chỉ `INV-1002`, status `Pending` trong `tbody`, `1 of 2`, không có `No invoices match`.
- `src/app/domains/admin/data/billing-portal.ts` và `src/app/domains/admin/modules/reports/features/reports-spending/` không đổi (`git diff --stat` không in hai đường dẫn đó).

## Lệnh đã chạy

1. `npm test -- --watch=false` → `ng test --watch=false`. Exit 0.

```
Test Files  1 passed (1)
     Tests  22 passed (22)
  Duration  3.66s
```

2. `git diff --stat -- src/app/domains/admin/data/billing-portal.ts src/app/domains/admin/modules/reports/features/reports-spending/` → không có output. Hai file không nằm trong diff.
