// Security Rules Verification Specification for SNAP CELL
// Verifies the Dirty Dozen adversarial payloads against firestore.rules:
// 1-4: Public/non-admin writes to products, categories, services, gallery, shopSettings, appMeta -> PERMISSION_DENIED
// 5-12: Malformed payloads (shadow fields, negative price, oversized strings/arrays, invalid condition/ID, forged timestamps) -> PERMISSION_DENIED

export const DIRTY_DOZEN_CASES = [
  { id: 1, name: 'Unauthenticated product create', expected: 'PERMISSION_DENIED' },
  { id: 2, name: 'Non-admin email product create', expected: 'PERMISSION_DENIED' },
  { id: 3, name: 'Non-admin shopSettings update', expected: 'PERMISSION_DENIED' },
  { id: 4, name: 'Non-admin appMeta write', expected: 'PERMISSION_DENIED' },
  { id: 5, name: 'Shadow field injection on product', expected: 'PERMISSION_DENIED' },
  { id: 6, name: 'Negative product price', expected: 'PERMISSION_DENIED' },
  { id: 7, name: 'Oversized nameEn (>140 chars)', expected: 'PERMISSION_DENIED' },
  { id: 8, name: 'Invalid condition enum', expected: 'PERMISSION_DENIED' },
  { id: 9, name: 'Oversized images array (>10)', expected: 'PERMISSION_DENIED' },
  { id: 10, name: 'Invalid document ID pattern', expected: 'PERMISSION_DENIED' },
  { id: 11, name: 'Unauthenticated category delete', expected: 'PERMISSION_DENIED' },
  { id: 12, name: 'Client-forged updatedAt timestamp', expected: 'PERMISSION_DENIED' },
] as const;
