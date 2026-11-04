# Plan

Trang Invoices: cạnh ô search hiện số dòng đang thấy, dạng `1 of 2`. Số đổi theo cùng danh sách mà ô search đang lọc. Ô trống đếm đủ danh sách. Không khớp thì `0 of 2`.

## Phạm vi

Trong phạm vi:

- Trang `/billing/invoices`, trong `mat-card`, cùng hàng với `<input type="search">` hiện có: một đoạn chữ ngay bên phải ô search.
- Chữ đúng `visible of total`, một khoảng trắng mỗi bên của `of`, không thêm từ. `visible` là `visibleInvoices().length`. `total` là `data.invoices.length`.
- Với dữ liệu hiện tại (`INV-1001`, `INV-1002`): ô trống hoặc chỉ khoảng trắng thì `2 of 2`; khớp một hóa đơn thì `1 of 2`; không khớp thì `0 of 2`.
- `0 of 2` vẫn hiện khi bảng chỉ còn dòng `No invoices match`. Dòng trống đó không được tính.

Ngoài phạm vi:

- Không đổi filter, `query`, `onQueryInput`, `statusClass`, empty state, cột, sort, menu, link View.
- Không sửa `BillingPortalService`, `getBilling()`, hay `src/app/domains/admin/data/billing-portal.ts`.
- Không thêm chip, query param, debounce, i18n, hay trang khác.
- Coder không tạo hoặc sửa test. Tester thêm case vào `src/app/domains/admin/modules/billing/features/invoices/billing-invoices.component.spec.ts` sau, theo mục Done khi.

Giả định: bộ đếm bám `visibleInvoices()`, nên trim và chữ hoa/thường giữ đúng hành vi search đang có. `total` lấy từ độ dài mảng hóa đơn, không hardcode `2` trong template.

## File

- `src/app/domains/admin/modules/billing/features/invoices/billing-invoices.component.ts`
- `src/app/domains/admin/modules/billing/features/invoices/billing-invoices.component.html`

Không tạo file mới.

## Bước

1. Trong component, thêm `resultCount = computed(() => \`${this.visibleInvoices().length} of ${this.data.invoices.length}\`)`. Không sửa `visibleInvoices`.
2. Trong template, bọc ô search bằng một hàng `flex items-center gap-3`. Ô search giữ `aria-label="Search invoices"`, `[value]`, `(input)`; bỏ `mt-4` khỏi input và cho input `min-w-0 flex-1`. Hàng giữ `mt-4`.
3. Ngay sau input, trong cùng hàng, một phần tử chỉ render `{{ resultCount() }}`. `shrink-0`, `whitespace-nowrap`, để `1 of 2` không bị xuống dòng. Không đặt vào header, menu, hay trong bảng.
4. Không đổi `@for`, nhánh `visibleInvoices().length === 0`, hay chữ `No invoices match`.

## Rủi ro

- Đếm `tbody tr` sẽ ra `1 of 2` khi không khớp, vì dòng `No invoices match` vẫn là một `<tr>`. Phải đếm `visibleInvoices()`.
- Hardcode `2`, hoặc dùng `query().length`, thì ô trống và chuỗi không khớp không ra đúng mẫu.
- Xuống dòng trong template giữa các interpolation dễ thêm khoảng trắng hoặc xuống dòng; một computed giữ đúng `N of M`.
- Thêm chữ (`Showing`, `invoices`, `1/2`) lệch dạng yêu cầu.
- Quên `whitespace-nowrap` / `shrink-0` thì số bị tách khỏi ô search hoặc bị ép xuống dòng.
- Khoảng trắng: ` paid ` vẫn phải ra `1 of 2` (Paid), và ô chỉ có space phải ra `2 of 2`, vì filter đã `trim`.
- `100` khớp cả hai số hóa đơn nên vẫn `2 of 2`. `299` không nằm trong filter nên `0 of 2` và vẫn một ô `No invoices match`.

## Done khi

- Ô trống: thấy đúng chữ `2 of 2` bên phải ô search, cùng hàng; vẫn `INV-1001` (Paid) và `INV-1002` (Pending); không có `No invoices match`.
- Gõ `inv-1001`: chữ thành `1 of 2`; bảng chỉ còn `INV-1001`.
- Gõ `PENDING`: chữ thành `1 of 2`; bảng chỉ còn `INV-1002`.
- Gõ `299`: chữ thành `0 of 2`; không còn số hóa đơn; đúng một ô `No invoices match`.
- Xóa ô, hoặc chỉ còn khoảng trắng: chữ về `2 of 2` và cả hai hóa đơn hiện lại.
- Gõ `100`: vẫn `2 of 2` và cả hai hóa đơn.
- Gõ ` paid `: `1 of 2` và chỉ `INV-1001`.
- Header năm cột và link View của dòng còn lại giữ nguyên. `billing-portal.ts` không đổi.
