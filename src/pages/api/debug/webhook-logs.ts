/**
 * Endpoint pour voir les logs des webhooks récents
 * Stocke les logs en mémoire pour le diagnostic
 */

import type { NextApiRequest, NextApiResponse } from "next";

type WebhookLog = {
  timestamp: string;
  type: string;
  paymentIntentId?: string;
  status: string;
  message: string;
  error?: string;
  details?: Record<string, unknown>;
};

// Stockage en mémoire des logs (sera perdu au redémarrage du serveur)
let webhookLogs: WebhookLog[] = [];

type ResponseData = {
  logsCount: number;
  logs: WebhookLog[];
  action?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
): Promise<void> {
  if (req.method === "GET") {
    // Retourner les logs
    return res.status(200).json({
      logsCount: webhookLogs.length,
      logs: webhookLogs.slice(-50) // Derniers 50 logs
    });
  }

  if (req.method === "POST") {
    // Ajouter un log (appelé par stripe.ts)
    const { type, paymentIntentId, status, message, error, details } = req.body;

    if (!type || !status || !message) {
      return res.status(400).json({
        logsCount: webhookLogs.length,
        logs: webhookLogs,
        action: "error"
      });
    }

    const log: WebhookLog = {
      timestamp: new Date().toISOString(),
      type,
      paymentIntentId,
      status,
      message,
      error,
      details
    };

    webhookLogs.push(log);

    // Garder seulement les 200 derniers logs
    if (webhookLogs.length > 200) {
      webhookLogs = webhookLogs.slice(-200);
    }

    return res.status(200).json({
      logsCount: webhookLogs.length,
      logs: webhookLogs,
      action: "logged"
    });
  }

  if (req.method === "DELETE") {
    // Effacer les logs
    webhookLogs = [];
    return res.status(200).json({
      logsCount: 0,
      logs: [],
      action: "cleared"
    });
  }

  return res.status(405).json({
    logsCount: webhookLogs.length,
    logs: webhookLogs
  });
}
