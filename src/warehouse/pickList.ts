import type { Order } from "../contract.ts";
import { EXCEPTIONS_BIN, type BinIndex } from "./bins.ts";

export interface PickTask {
  sku: string;
  bin: string;
  units: number;
}

/**
 * Turn a placed order into one pick task per SKU. Relies on the upstream
 * contract that every order line is a physical SKU with `quantity >= 1`, so
 * units are summed as-is and the warehouse decrements on-hand stock by them.
 */
export function buildPickList(order: Order, bins: BinIndex): PickTask[] {
  const units = new Map<string, number>();
  for (const line of order.lines) {
    units.set(line.sku, (units.get(line.sku) ?? 0) + line.quantity);
  }
  return [...units].map(([sku, count]) => ({
    sku,
    bin: bins.get(sku) ?? EXCEPTIONS_BIN,
    units: count,
  }));
}

/** Apply picked units to on-hand stock. */
export function decrementOnHand(onHand: Map<string, number>, tasks: PickTask[]): void {
  for (const task of tasks) {
    onHand.set(task.sku, (onHand.get(task.sku) ?? 0) - task.units);
  }
}
