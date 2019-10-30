import React from "react";

import "./Field.css";

interface Props {
  label: string;
  error?: boolean;
  className?: string;
  required?: boolean;
}

export const Field: React.FC<Props> = ({
  label: text,
  error,
  className = "",
  required = false,
  children
}) => {
  const modifierClass = error ? "field--error" : "";

  return (
    <div className={`field ${modifierClass} ${className}`}>
      <label className="field__label">{text}</label>
      <div className="field__input">{children}</div>
    </div>
  );
};
