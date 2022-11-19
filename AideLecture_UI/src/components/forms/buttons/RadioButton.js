import React from "react";
import { Field } from "redux-form";
import Form from "react-bootstrap/Form";

const renderInput = ({ input, field, disabled, checked, meta }) => {
  input.value = field.radioValue;
  return (
    <div className={`form-outline ${field.className}`}>
      <Form.Check
        type="radio"
        inline
        id={field.id}
        name={field.name}
        {...input}
        disabled={disabled}
        checked={checked}
      />
    </div>
  );
};

const RadioButton = ({ input, disabled = false }) => {
  return (
    <Field
      name={input.name}
      component={renderInput}
      field={input}
      disabled={disabled}
      checked={input.checked}
    />
  );
};

export default RadioButton;
