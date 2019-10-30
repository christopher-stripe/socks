import React from "react";

import "./Card.css";

interface Props {
  className?: string;
}

export const Card: React.FC<Props> = ({ className, children }) => {
  return <div className={`card ${className}`}>{children}</div>;
};
