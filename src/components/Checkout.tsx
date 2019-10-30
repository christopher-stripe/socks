import React from "react";
import { StripeProvider, Elements } from "react-stripe-elements";
import { RouteComponentProps } from "@reach/router";
import { get } from "lodash";

import { WrappedCheckoutForm } from "./CheckoutForm";
import { stripe } from "../constants";

import "./Checkout.css";

export const Checkout: React.FC<RouteComponentProps> = ({ location }) => {
  const paymentIntentSecret: string | undefined = get(
    location,
    "state.paymentIntentSecret"
  );

  if (!paymentIntentSecret) {
    throw new Error("missing paymentIntentSecret location state");
  }

  return (
    <div className="checkout">
      <StripeProvider stripe={stripe}>
        <Elements>
          <WrappedCheckoutForm paymentIntentSecret={paymentIntentSecret} />
        </Elements>
      </StripeProvider>
    </div>
  );
};
