/** @format */

import { CartProvider } from "@/context/cartContext";
import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";
import type { AppProps } from "next/app";
import AuthUserProvider from "@/context/AuthUserContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { SearchProvider } from "@/context/SearchContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthUserProvider>
      <CartProvider>
        <PayPalScriptProvider
          options={{
            clientId:
              "AemNB4srMcvG-8emHlc_EakJX0Nar8j4cvLhHaAHNCD8Ug5_r8143HbV1_ukGdx5LPt2IoigS5YATfA4",
            currency: "EUR" // Ajout de la devise ici
          }}
        >
          <SearchProvider>
            <ToastContainer />
            <Component {...pageProps} />
          </SearchProvider>
        </PayPalScriptProvider>
      </CartProvider>
    </AuthUserProvider>
  );
}
