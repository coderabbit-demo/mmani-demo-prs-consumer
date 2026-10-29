/** Where each SKU is shelved. Unknown SKUs go to the exceptions bin for a human. */
export const EXCEPTIONS_BIN = "EXC-00";

export type BinIndex = ReadonlyMap<string, string>;

export const DEFAULT_BINS: BinIndex = new Map([
  ["TSHIRT-BLK-M", "A-01"],
  ["TSHIRT-WHT-M", "A-02"],
  ["HOODIE-GRY-L", "A-07"],
  ["MUG-CERAMIC", "B-03"],
  ["STICKER-PACK", "C-11"],
  ["BOTTLE-STEEL", "B-05"],
]);
