import React from "react";

const TextInput = ({
  name,
  type,
  label,
  className,
  id,
  disabled = false,
  register,
  errors,
}) => {
  return (
    <div className={`form-outline ${className}`}>
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <input
        name={name}
        type={type}
        className={`form-control ${errors && errors[name] ? "is-invalid" : ""}`}
        id={id}
        autoComplete="off"
        disabled={disabled}
        {...register(name)}
      />
      {errors && errors[name] && (
        <div className="invalid-feedback">{errors[name].message}</div>
      )}
    </div>
  );
};

export default TextInput;
