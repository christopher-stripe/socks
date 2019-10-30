import { Result } from "../types";

type CreatePaymentIntentOK = { secret: string };

type CreatePaymentIntentError = { code: string; message?: string };

export const createPaymentIntent = async (
  amount: number
): Promise<Result<CreatePaymentIntentOK, CreatePaymentIntentError>> => {
  try {
    const response = await fetch("/api/payment_intents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    });

    if (response.status !== 201) {
      throw new Error();
    }

    const json = await response.json();

    return { ok: json };
  } catch (e) {
    console.error(e);

    return { err: { code: "unknown", message: "An unknown error occured" } };
  }
};
