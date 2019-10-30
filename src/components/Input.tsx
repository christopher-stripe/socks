import React from "react";

import "./Input.css";

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => any;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => any;
  name?: string;
  placeholder?: string;
  className?: string;
  type?: "text";
}

export const Input: React.FC<Props> = ({
  value,
  onChange,
  onBlur,
  name,
  placeholder = "",
  className = "",
  type = "text"
}) => {
  return (
    <input
      className={`input ${className}`}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};
