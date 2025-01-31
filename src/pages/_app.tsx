/** @format */

import { CartProvider } from "@/context/cartContext";
import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";
import type { AppProps } from "next/app";
import AuthUserProvider from "@/context/AuthUserContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthUserProvider>
      <CartProvider>
        <PayPalScriptProvider
          options={{
            clientId:
              "AVSnmI-2-1KSNcq5J79BbO_eukxGkU1r77GQ7gLS_IhLMYgmPlUwMXwq69eYbBmL1O9e1oEK8cD01LhD"
          }}
        >
          <ToastContainer />
          <Component {...pageProps} />
        </PayPalScriptProvider>
      </CartProvider>
    </AuthUserProvider>
  );
}
