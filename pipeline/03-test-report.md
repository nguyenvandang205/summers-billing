# Test report

## Kết quả

`PASS`

## Case

Spec: `src/app/domains/admin/modules/billing/features/invoices/billing-invoices.component.spec.ts` (10 tests). Drives the search input (`aria-label="Search invoices"`) and reads the rendered table. Does not change production code.

- Ô trống: INV-1001 (Paid) và INV-1002 (Pending); không có `No invoices match`; header Invoice, Date, Status, Amount, Action; hai link View.
- `inv-1001`: chỉ INV-1001; không có INV-1002 hay `No invoices match`; header năm cột còn; một link View `href="#"`.
- `PENDING`: chỉ INV-1002 (Pending); không có INV-1001 hay `No invoices match`.
- `299`: không còn INV-1001 / INV-1002; đúng một `td[colspan="5"]` với chữ `No invoices match`; header năm cột còn; không còn link View.
- Chỉ khoảng trắng (`   `) sau `299`: cả hai hóa đơn trở lại; dòng `No invoices match` biến mất.
- Xóa ô (chuỗi rỗng) sau `PENDING`: cả hai hóa đơn trở lại; không còn `No invoices match`.
- Đoạn ngày đang hiện trên hóa đơn đầu (token duy nhất, lowercase): chỉ còn hóa đơn đó.
- `348`: không khớp amount; cùng empty state `No invoices match`.
- ` paid ` (trim): chỉ INV-1001.
- `100`: cả INV-1001 và INV-1002 (substring).
- `src/app/domains/admin/data/billing-portal.ts` không đổi (`git status` không liệt kê file này).

## Lệnh đã chạy

1. `npm test -- --watch=false` → `ng test --watch=false`. Lần đầu fail lúc build: `TS2322` trong spec (`Element[]` không gán được cho `HTMLAnchorElement[]`). Sửa type predicate của test, không đổi production.

2. `npm test -- --watch=false` → `ng test --watch=false`. Exit 0.

```
Test Files  1 passed (1)
     Tests  10 passed (10)
  Duration  3.83s
```
