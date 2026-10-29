/**
 * The slice of the Orders API contract this service depends on, mirrored from
 * coderabbit-demo/mmani-demo-prs (`packages/contracts/src/orders.ts`). The
 * orders service owns these shapes; any change upstream must be reflected here.
 *
 * Invariants we rely on (documented upstream, not re-validated everywhere):
 * - every line is a physical catalog SKU with an integer `quantity >= 1`;
 * - `unitPriceCents >= 0` and `lineTotalCents = quantity * unitPriceCents`;
 * - `subtotalCents` is the sum of `lineTotalCents`;
 * - `0 <= discountCents <= subtotalCents` and `netCents = subtotalCents - discountCents`.
 */

export type OrderStatus = "cart" | "placed" | "cancelled";

export interface OrderLine {
  sku: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
}

export interface OrderTotals {
  subtotalCents: number;
  discountCents: number;
  netCents: number;
}

export interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  lines: OrderLine[];
  totals: OrderTotals;
  placedAt: string | null;
}

/** Event the orders service sends when checkout completes. */
export interface OrderPlacedEvent {
  type: "order.placed";
  orderId: string;
}
