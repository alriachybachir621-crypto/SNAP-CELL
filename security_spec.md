# SNAP CELL Security Specification

## Data Invariants
1. Public visitors can read catalog data (`products`, `categories`, `services`, `gallery`, `shopSettings`, `appMeta`, and `test/connection`), and read files in Firebase Storage.
2. Only an authenticated user whose token email equals `"admin@snapcell.app"` may create, update, or delete any Firestore document or upload/delete in Firebase Storage.
3. Every document ID must match `^[a-zA-Z0-9_-]+$` and be <= 128 characters.
4. Every string field is strictly bounded by `size()` limits matching `firebase-blueprint.json`.
5. Every array (`options`, `images`) is bounded (`<= 20` and `<= 10`) and validated for element type when non-empty.
6. Product `price` must be a non-negative number (`>= 0`), `condition` must be `"new"` or `"used"`, and `updatedAt` must equal `request.time`.
7. Unknown/shadow fields are rejected via `keys().hasOnly(...)` on create and `affectedKeys().hasOnly(...)` on update.

## Dirty Dozen Adversarial Payloads
1. Unauthenticated product create -> `PERMISSION_DENIED`
2. Authenticated non-admin (`other@example.com`) product create -> `PERMISSION_DENIED`
3. Authenticated non-admin `shopSettings` update -> `PERMISSION_DENIED`
4. Authenticated non-admin `appMeta` write -> `PERMISSION_DENIED`
5. Shadow field injection (`isFeaturedAdminSecret: true`) by admin -> `PERMISSION_DENIED`
6. Negative product price (`price: -10`) -> `PERMISSION_DENIED`
7. Oversized `nameEn` (> 140 chars) -> `PERMISSION_DENIED`
8. Invalid `condition` (`"refurbished"`) -> `PERMISSION_DENIED`
9. Oversized `images` array (> 10 items) -> `PERMISSION_DENIED`
10. Invalid document ID (`../bad/id` or > 128 chars) -> `PERMISSION_DENIED`
11. Unauthenticated delete on `categories` -> `PERMISSION_DENIED`
12. Client-forged `updatedAt` timestamp (not `request.time`) -> `PERMISSION_DENIED`
