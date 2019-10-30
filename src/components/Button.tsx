import React from "react";

import "./Button.css";

interface Props {
  text: string;
  onClick?: () => any;
  disabled?: boolean;
  type?: "button" | "submit";
  role?: "primary";
  className?: string;
}

export const Button: React.FC<Props> = ({
  text,
  onClick,
  disabled = false,
  type = "button",
  role = "primary",
  className = ""
}) => {
  return (
    <button
      className={`button button--${role} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {text}
    </button>
  );
};
