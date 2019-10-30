import React, { useState } from "react";
import { navigate } from "@reach/router";

import { createPaymentIntent } from "../api";
import { Button } from "./Button";
import { Card } from "./Card";

import "./ProductCard.css";

interface Props {
  name: string;
  amount: number;
  imageURL: string;
}

const formatDollars = (cents: number): string => {
  return `$${cents / 100}`;
};

export const ProductCard: React.FC<Props> = ({ amount, imageURL }) => {
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);

  const handleClick = async () => {
    if (isCreatingIntent) {
      return;
    }

    setIsCreatingIntent(true);

    const result = await createPaymentIntent(500);

    setIsCreatingIntent(false);

    if ("err" in result) {
      window.alert(result.err.message);
      return;
    }

    navigate("/checkout", { state: { paymentIntentSecret: result.ok.secret } });
  };

  return (
    <Card className="product-card">
      <div
        className="product-card__image"
        style={{ backgroundImage: `url('${imageURL}')` }}
      />
      <div className="product-card__details">
        <div className="product-card__amount">{formatDollars(amount)}</div>
        <Button
          text="Buy now"
          onClick={handleClick}
          disabled={isCreatingIntent}
        />
      </div>
    </Card>
  );
};
