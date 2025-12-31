/** @format */

// services/orderService.ts
interface OrderPayload {
  stripeSessionId: string;
  amount: number | null;
  currency: string | null;
  customerEmail?: string | null;
  status: "PAID" | "FAILED";
}

export async function saveOrder(order: OrderPayload) {
  console.log("Commande validée :", order);

  // Exemple Firebase / Prisma / Mongo / SQL
  // await db.orders.create({ data: order });

  return true;
}
