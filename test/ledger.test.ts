import { test } from "node:test";
import assert from "node:assert/strict";
import { journalForOrder, maxRefundCents, revenueBySku } from "../src/finance/ledger.ts";
import { placedOrder } from "./fixtures.ts";

test("journal balances: receivable + discount = revenue", () => {
  const entries = journalForOrder(placedOrder);
  const debits = entries.reduce((sum, e) => sum + e.debitCents, 0);
  const credits = entries.reduce((sum, e) => sum + e.creditCents, 0);
  assert.equal(debits, credits);
  assert.equal(credits, 6500);
});

test("refunds are capped at the amount paid", () => {
  assert.equal(maxRefundCents(placedOrder), 5850);
});

test("revenue is attributed to the SKUs sold", () => {
  assert.deepEqual([...revenueBySku(placedOrder)], [["TSHIRT-BLK-M", 5000], ["MUG-CERAMIC", 1500]]);
});
