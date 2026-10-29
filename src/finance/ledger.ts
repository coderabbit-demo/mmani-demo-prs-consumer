import type { Order } from "../contract.ts";

export type Account = "accounts_receivable" | "sales_discounts" | "product_revenue";

export interface JournalEntry {
  orderId: string;
  account: Account;
  debitCents: number;
  creditCents: number;
}

/**
 * Double-entry journal for a placed order:
 *   Dr accounts_receivable  netCents
 *   Dr sales_discounts      discountCents
 *       Cr product_revenue      subtotalCents
 * Upstream guarantees `netCents + discountCents === subtotalCents` and that no
 * amount is negative, so the entries are posted as-is.
 */
export function journalForOrder(order: Order): JournalEntry[] {
  const { subtotalCents, discountCents, netCents } = order.totals;
  const entries: JournalEntry[] = [
    { orderId: order.id, account: "accounts_receivable", debitCents: netCents, creditCents: 0 },
    { orderId: order.id, account: "product_revenue", debitCents: 0, creditCents: subtotalCents },
  ];
  if (discountCents > 0) {
    entries.push({
      orderId: order.id,
      account: "sales_discounts",
      debitCents: discountCents,
      creditCents: 0,
    });
  }
  return entries;
}

/** Revenue per SKU for the merchandising dashboard. */
export function revenueBySku(order: Order): Map<string, number> {
  const revenue = new Map<string, number>();
  for (const line of order.lines) {
    revenue.set(line.sku, (revenue.get(line.sku) ?? 0) + line.lineTotalCents);
  }
  return revenue;
}

/** The most a customer can be refunded for an order: what they actually paid. */
export function maxRefundCents(order: Order): number {
  return order.totals.netCents;
}
