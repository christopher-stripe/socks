const STRIPE_PUBLISHABLE_KEY = process.env
  .REACT_APP_STRIPE_PUBLISHABLE_KEY as string;

export const stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY, {
  betas: ["new_intent_api_beta_1"]
});

// Usually the brand style is stored in CSS variables and consumed via a
// branded component library. But the react-stripe-elements components are
// unable to access these variables since they are rendered in iframes. So, we
// duplicate the brand variables here and hope they don't get out of sync 🤞
export const STRIPE_ELEMENTS_STYLE = {
  base: {
    fontWeight: "500",
    fontFamily: "system-ui, sans-serif",
    fontSize: "14px",
    color: "#080808",
    "::placeholder": {
      color: "#ccc"
    }
  },
  invalid: {
    color: "#e44138"
  }
};
