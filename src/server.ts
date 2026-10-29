import { createServer } from "node:http";
import { createOrdersClient } from "./ordersClient.ts";
import { DEFAULT_BINS } from "./warehouse/bins.ts";
import { handleOrderPlaced } from "./events/orderPlaced.ts";
import type { OrderPlacedEvent } from "./contract.ts";

const orders = createOrdersClient({
  baseUrl: process.env.ORDERS_API_URL ?? "http://localhost:4002",
  serviceToken: process.env.ORDERS_SERVICE_TOKEN ?? "dev-service-token",
});

const server = createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/events/order-placed") {
    let body = "";
    for await (const chunk of req) body += chunk;
    try {
      const event = JSON.parse(body) as OrderPlacedEvent;
      const result = await handleOrderPlaced(event, {
        orders,
        bins: DEFAULT_BINS,
        enqueuePicks: async (id, tasks) => console.log("picks", id, tasks),
        postJournal: async (entries) => console.log("journal", entries),
      });
      res.writeHead(202, { "content-type": "application/json" }).end(JSON.stringify(result));
    } catch (err) {
      console.error(err);
      res.writeHead(502).end();
    }
    return;
  }
  res.writeHead(404).end();
});

server.listen(Number(process.env.PORT ?? 4100));
