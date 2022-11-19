import React from "react";
import { Field } from "redux-form";
import Form from "react-bootstrap/Form";

const renderError = ({ error, touched }) => {
  if (touched && error) {
    return <div className="invalid-feedback">{error}</div>;
  }
};

const renderInput = ({ input, label, field, disabled, meta }) => {
  const className = `form-control ${
    meta.error && meta.touched ? "is-invalid" : ""
  }`;
  return (
    <div className={`form-outline ${field.className}`}>
      <Form.Select
        id={field.id}
        {...input}
        disabled={disabled}
        className={className}
      >
        <option key="aucune-valeur" value="aucune-valeur">
          Veuillez sélectionner un quiz
        </option>
        {field.options.map((option, index) => {
          return (
            <option key={index} value={option.id}>
              {option.name}
            </option>
          );
        })}
      </Form.Select>
      <label className="form-label" htmlFor={field.id}>
        {label.text}
      </label>
      {renderError(meta)}
    </div>
  );
};

const Dropdown = ({ input, label, disabled = false }) => {
  return (
    <Field
      name={input.name}
      component={renderInput}
      label={label}
      field={input}
      disabled={disabled}
      defaultValue={input.value}
    />
  );
};

export default Dropdown;
