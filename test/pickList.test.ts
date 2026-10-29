import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPickList, decrementOnHand } from "../src/warehouse/pickList.ts";
import { DEFAULT_BINS } from "../src/warehouse/bins.ts";
import { placedOrder } from "./fixtures.ts";

test("one pick task per SKU from its shelf", () => {
  assert.deepEqual(buildPickList(placedOrder, DEFAULT_BINS), [
    { sku: "TSHIRT-BLK-M", bin: "A-01", units: 2 },
    { sku: "MUG-CERAMIC", bin: "B-03", units: 1 },
  ]);
});

test("picked units reduce on-hand stock", () => {
  const onHand = new Map([["TSHIRT-BLK-M", 10], ["MUG-CERAMIC", 4]]);
  decrementOnHand(onHand, buildPickList(placedOrder, DEFAULT_BINS));
  assert.deepEqual([...onHand], [["TSHIRT-BLK-M", 8], ["MUG-CERAMIC", 3]]);
});
