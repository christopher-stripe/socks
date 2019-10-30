import React from "react";
import { RouteComponentProps } from "@reach/router";

import { ProductCard } from "./ProductCard";
import "./Home.css";

export const Home: React.FC<RouteComponentProps> = () => {
  return (
    <div className="home">
      <ProductCard
        name="Socks"
        amount={500}
        imageURL="https://i.imgur.com/8e1YKVA.jpg"
      />
    </div>
  );
};
