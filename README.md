# mmani-demo-prs-consumer — fulfillment & finance

Downstream service owned by the Warehouse & Finance team. When the
[`mmani-demo-prs`](https://github.com/coderabbit-demo/mmani-demo-prs) orders service completes
checkout it sends `order.placed`; this service fetches the order, releases a pick list to the
warehouse, and posts the order's revenue to the ledger.

```
orders service ──POST /events/order-placed──▶ handleOrderPlaced
       ▲                                         │
       └──────────── GET /orders/:id ◀───────────┘──▶ buildPickList ──▶ warehouse
                                                  └─▶ journalForOrder ─▶ ledger
```

## The contract this service depends on

`GET /orders/:id` → `Order` (mirrored in [`src/contract.ts`](src/contract.ts)).

| Field | Used in | Assumption |
| --- | --- | --- |
| `lines[].sku` | `src/warehouse/pickList.ts` | A physical catalog SKU that has a shelf location |
| `lines[].quantity` | `src/warehouse/pickList.ts` | Integer `>= 1`; becomes units picked and stock decremented |
| `lines[].lineTotalCents` | `src/finance/ledger.ts` `revenueBySku` | Non-negative revenue for that SKU |
| `totals.subtotalCents` | `src/finance/ledger.ts` | Sum of line totals; credited to product revenue |
| `totals.discountCents` | `src/finance/ledger.ts` | `0..subtotalCents`; debited to sales discounts |
| `totals.netCents` | `src/finance/ledger.ts` | `subtotalCents - discountCents`, never negative; receivable and refund cap |

A discount represented as an order line, a non-positive quantity, or a negative net amount
breaks pick lists, stock counts, and the ledger.

## Run

```bash
npm install
npm test
ORDERS_API_URL=http://localhost:4002 npm start   # listens on :4100
```

Node 24+ runs the TypeScript sources directly (type stripping); `npm run typecheck` runs `tsc`.
