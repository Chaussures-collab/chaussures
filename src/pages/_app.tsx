/** @format */

import { CartProvider } from "@/context/cartContext";
import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";
import type { AppProps } from "next/app";
import AuthUserProvider from "@/context/AuthUserContext";
import { SearchProvider } from "@/context/SearchContext";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

export default function App({ Component, pageProps }: AppProps) {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
  );

  return (
    <AuthUserProvider>
      <CartProvider>
        <Elements stripe={stripePromise}>
          <SearchProvider>
            <ToastContainer />
            <Component {...pageProps} />
          </SearchProvider>{" "}
        </Elements>
      </CartProvider>
    </AuthUserProvider>
  );
}
