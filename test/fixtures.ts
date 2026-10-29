import type { Order } from "../src/contract.ts";

export const placedOrder: Order = {
  id: "ord_1001",
  customerId: "cus_ada",
  status: "placed",
  placedAt: "2026-10-01T10:00:00.000Z",
  lines: [
    { sku: "TSHIRT-BLK-M", name: "Logo tee", quantity: 2, unitPriceCents: 2500, lineTotalCents: 5000 },
    { sku: "MUG-CERAMIC", name: "Ceramic mug", quantity: 1, unitPriceCents: 1500, lineTotalCents: 1500 },
  ],
  totals: { subtotalCents: 6500, discountCents: 650, netCents: 5850 },
};
