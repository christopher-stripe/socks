import React, { useRef, useReducer } from "react";
import { get, cloneDeep } from "lodash";
import {
  injectStripe,
  CardElement,
  ReactStripeElements
} from "react-stripe-elements";

import { Status } from "../types";
import { Button } from "./Button";
import { Field } from "./Field";
import { Input } from "./Input";
import { Card } from "./Card";
import { STRIPE_ELEMENTS_STYLE } from "../constants";

import "./CheckoutForm.css";

interface OwnProps {
  paymentIntentSecret: string;
}

type Props = OwnProps & ReactStripeElements.InjectedStripeProps;

interface FieldState {
  value: string;
  shouldValidate: boolean;
}

interface State {
  submitStatus: Status;
  submitError: null | any;

  // The card error message is stored as a special case. It cannot be derived,
  // since it the card state is owned by the `CardElement` child :(
  cardError: null | string;

  fields: {
    name: FieldState;
    email: FieldState;
    address: FieldState;
    city: FieldState;
    state: FieldState;
    zip: FieldState;
  };
}

type FieldName = keyof State["fields"];

type Errors = {
  [f in FieldName]?: null | string;
} & { card?: null | string };

type Action =
  | { type: "FIELD_CHANGED"; field: FieldName; value: string }
  | { type: "FIELD_BLURRED"; field: FieldName }
  | { type: "SUBMITTING" }
  | { type: "SUBMIT_FAILED"; error: any }
  | { type: "SUBMIT_COMPLETED" }
  | { type: "CARD_ELEMENT_CHANGED"; event: any };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FIELD_CHANGED": {
      const nextState = cloneDeep(state);

      nextState.fields[action.field] = {
        value: action.value,
        shouldValidate: false
      };

      return nextState;
    }

    case "FIELD_BLURRED": {
      const nextState = cloneDeep(state);

      nextState.fields[action.field].shouldValidate = true;

      return nextState;
    }

    case "SUBMITTING": {
      return { ...state, submitStatus: "running", submitError: null };
    }

    case "SUBMIT_FAILED": {
      return { ...state, submitStatus: "failed", submitError: action.error };
    }

    case "SUBMIT_COMPLETED": {
      return { ...state, submitStatus: "complete" };
    }

    case "CARD_ELEMENT_CHANGED": {
      if (action.event.error && action.event.error.message) {
        return { ...state, cardError: action.event.error.message };
      } else {
        return { ...state, cardError: null };
      }
    }

    default: {
      return state;
    }
  }
};

const INITIAL_STATE: State = {
  submitStatus: "initial",
  submitError: null,
  cardError: null,
  fields: {
    name: { value: "", shouldValidate: false },
    email: { value: "", shouldValidate: false },
    address: { value: "", shouldValidate: false },
    city: { value: "", shouldValidate: false },
    state: { value: "", shouldValidate: false },
    zip: { value: "", shouldValidate: false }
  }
};

const validateState = (
  state: State,
  forceValidate: boolean = false
): Errors => {
  const fields = state.fields;
  const errors: Errors = {};

  if (
    (forceValidate || fields.name.shouldValidate) &&
    fields.name.value.trim() === ""
  ) {
    errors.name = "Name cannot be empty.";
  }

  if (
    (forceValidate || fields.address.shouldValidate) &&
    fields.address.value.trim() === ""
  ) {
    errors.address = "Address cannot be empty.";
  }

  if (
    (forceValidate || fields.city.shouldValidate) &&
    fields.city.value.trim() === ""
  ) {
    errors.city = "City cannot be empty.";
  }

  if (
    (forceValidate || fields.state.shouldValidate) &&
    fields.state.value.trim().length !== 2
  ) {
    errors.state = 'Please use a two-digit state code (e.g "CA").';
  }

  if (
    (forceValidate || fields.state.shouldValidate) &&
    fields.state.value.trim() === ""
  ) {
    errors.state = "State cannot be empty.";
  }

  if (
    (forceValidate || fields.zip.shouldValidate) &&
    fields.zip.value.trim() === ""
  ) {
    errors.zip = "Zip cannot be empty.";
  }

  if (state.cardError) {
    errors.card = state.cardError;
  }

  return errors;
};

const collectErrorMessages = (errors: Errors): string[] => {
  // Collect the error messages from an `Errors` object in the same order that
  // the form fields appear in
  return ["name", "email", "address", "city", "state", "zip", "card"]
    .map(f => get(errors, f))
    .filter((msg): msg is string => !!msg);
};

const CheckoutForm: React.FC<Props> = ({ paymentIntentSecret, stripe }) => {
  const cardElementRef = useRef<any>(null);
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  if (state.submitStatus === "complete") {
    return <Card>Success!</Card>;
  }

  if (state.submitStatus === "failed") {
    return (
      <Card>
        Uh oh, something went wrong.
        <pre>
          <code>{JSON.stringify(state.submitError, " " as any, 2)}</code>
        </pre>
      </Card>
    );
  }

  const errorsByFieldName = validateState(state);
  const errorMessages = collectErrorMessages(errorsByFieldName);
  const canSubmit = state.submitStatus === "initial" && errorsByFieldName;

  const handleSubmit = async () => {
    // TODO: Force validate all fields before submitting
    if (!canSubmit || !stripe || !cardElementRef.current) {
      return;
    }

    dispatch({ type: "SUBMITTING" });

    const { error } = await (stripe as any).confirmCardPayment(
      paymentIntentSecret,
      {
        payment_method: {
          card: cardElementRef.current.getElement(),
          billing_details: {
            name: state.fields.name.value,
            address: {
              line1: state.fields.address.value,
              city: state.fields.city.value,
              state: state.fields.state.value,
              postal_code: state.fields.zip.value
            }
          }
        }
      }
    );

    if (error) {
      dispatch({ type: "SUBMIT_FAILED", error });
    } else {
      dispatch({ type: "SUBMIT_COMPLETED" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch({
      type: "FIELD_CHANGED",
      field: e.target.name as FieldName,
      value: e.target.value
    });

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) =>
    dispatch({
      type: "FIELD_BLURRED",
      field: e.target.name as FieldName
    });

  return (
    <Card>
      <form className="checkout-form">
        <Field label="Your full name" error={!!errorsByFieldName.name} required>
          <Input
            name="name"
            placeholder="Jane Doe"
            value={state.fields.name.value}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Field>
        <Field label="Address" error={!!errorsByFieldName.address} required>
          <Input
            name="address"
            placeholder="123 Fourth Street"
            value={state.fields.address.value}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Field>
        <div className="checkout-form__city-state-zip">
          <Field
            className="checkout-form__city"
            label="City"
            error={!!errorsByFieldName.city}
            required
          >
            <Input
              name="city"
              placeholder="San Francisco"
              value={state.fields.city.value}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Field>
          <Field
            className="checkout-form__state"
            label="State"
            error={!!errorsByFieldName.state}
            required
          >
            <Input
              name="state"
              placeholder="CA"
              value={state.fields.state.value}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Field>
          <Field
            className="checkout-form__zip"
            label="Zip code"
            error={!!errorsByFieldName.zip}
            required
          >
            <Input
              name="zip"
              placeholder="94941"
              value={state.fields.zip.value}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Field>
        </div>
        <Field label="Card" error={!!state.cardError} required>
          <CardElement
            className="checkout-form__card"
            ref={cardElementRef}
            style={STRIPE_ELEMENTS_STYLE}
            onChange={event =>
              dispatch({ type: "CARD_ELEMENT_CHANGED", event })
            }
          />
        </Field>
        {errorMessages.length > 0 && (
          <ul className="checkout-form__errors">
            <p>Uh oh, Oreo! Please correct the following errors.</p>
            {errorMessages.map(e => (
              <li className="checkout-form__error">{e}</li>
            ))}
          </ul>
        )}
        <Button
          className="checkout-form__submit"
          text="Submit"
          onClick={handleSubmit}
          disabled={!canSubmit}
        />
      </form>
    </Card>
  );
};

export const WrappedCheckoutForm = injectStripe(CheckoutForm);
