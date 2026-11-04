# Review

## Verdict

`APPROVE`

## Lý do

Diff khớp plan. Production chỉ sửa `billing-invoices.component.ts` và `.html`: thêm `resultCount` computed từ `visibleInvoices().length` và `data.invoices.length`, không hardcode `2`, không sửa `visibleInvoices`, `query`, `onQueryInput`, hay `statusClass`. Template bọc ô search trong hàng `mt-4 flex items-center gap-3`, input giữ `aria-label`, `[value]`, `(input)`, thêm `min-w-0 flex-1` và bỏ `mt-4`; `span` ngay sau input chỉ render `{{ resultCount() }}` với `shrink-0 whitespace-nowrap`. `@for`, nhánh rỗng, chữ `No invoices match`, cột, menu, link View, và `billing-portal.ts` không đổi. Spec chỉ được Tester bổ sung case, đúng phạm vi.

Mười test PASS (`npm test -- --watch=false`, 10/10) phủ mục Done khi: ô trống `2 of 2` cùng hàng, vẫn INV-1001 (Paid) và INV-1002 (Pending); `inv-1001` và `PENDING` ra `1 of 2` đúng một hóa đơn; `299` ra `0 of 2` dù còn một `tbody tr` và đúng một ô `No invoices match`; khoảng trắng và xóa ô về `2 of 2`; `100` vẫn `2 of 2`; ` paid ` ra `1 of 2` chỉ INV-1001; header năm cột và link View còn. Rủi ro đếm nhầm dòng trống, hardcode tổng, thêm chữ, hoặc thiếu `whitespace-nowrap` / `shrink-0` đều đã được chặn trong code và trong assert. Không có lỗi chặn merge.
