/** @format */

// /components/CheckoutButton.tsx
"use client";
import React from "react";

interface Props {
  items: { id: string; name: string; price: number; quantity: number }[];
}

export default function CheckoutButton({ items }: Props) {
  const handleCheckout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    });

    const data = await res.json();
    if (data.url) window.location.href = data.url; // Redirection vers Stripe
  };

  return <button onClick={handleCheckout}>Payer</button>;
}
