import type { Order } from "./contract.ts";

export interface OrdersClientOptions {
  /** Base URL of the orders service, e.g. "http://orders:4002". */
  baseUrl: string;
  /** Service token accepted by the orders service for internal reads. */
  serviceToken: string;
  timeoutMs?: number;
  fetch?: typeof fetch;
}

export class OrdersApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "OrdersApiError";
    this.status = status;
  }
}

/** Read-only client for `GET /orders/:id` on the orders service. */
export function createOrdersClient(options: OrdersClientOptions) {
  const baseUrl = options.baseUrl.replace(/\/+$/, "");
  const doFetch = options.fetch ?? fetch;
  const timeoutMs = options.timeoutMs ?? 3000;

  return {
    async getOrder(orderId: string): Promise<Order> {
      const res = await doFetch(`${baseUrl}/orders/${encodeURIComponent(orderId)}`, {
        headers: { accept: "application/json", "x-service-token": options.serviceToken },
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!res.ok) {
        throw new OrdersApiError(`GET /orders/${orderId} failed with ${res.status}`, res.status);
      }
      return (await res.json()) as Order;
    },
  };
}

export type OrdersClient = ReturnType<typeof createOrdersClient>;
