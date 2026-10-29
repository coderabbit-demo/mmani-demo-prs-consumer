import type { OrderPlacedEvent } from "../contract.ts";
import type { OrdersClient } from "../ordersClient.ts";
import type { BinIndex } from "../warehouse/bins.ts";
import { buildPickList, type PickTask } from "../warehouse/pickList.ts";
import { journalForOrder, type JournalEntry } from "../finance/ledger.ts";

export interface OrderPlacedDeps {
  orders: OrdersClient;
  bins: BinIndex;
  enqueuePicks(orderId: string, tasks: PickTask[]): Promise<void>;
  postJournal(entries: JournalEntry[]): Promise<void>;
}

/**
 * Handle `order.placed` from the orders service: fetch the order, release it to
 * the warehouse, and post its revenue. Orders not in `placed` status are skipped.
 */
export async function handleOrderPlaced(event: OrderPlacedEvent, deps: OrderPlacedDeps) {
  const order = await deps.orders.getOrder(event.orderId);
  if (order.status !== "placed") {
    return { status: "skipped" as const };
  }
  const tasks = buildPickList(order, deps.bins);
  await deps.enqueuePicks(order.id, tasks);
  await deps.postJournal(journalForOrder(order));
  return { status: "released" as const, tasks: tasks.length };
}
