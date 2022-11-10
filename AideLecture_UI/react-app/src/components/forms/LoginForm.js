import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidationSchema } from "../../validations/login";
import Submit from "./buttons/Submit";
import Return from "./buttons/Return";
import TextInput from "./fields/TextInputHook";

const LoginForm = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(loginValidationSchema),
  });

  return (
    <form className="error" onSubmit={handleSubmit(props.handleSubmit)}>
      <TextInput
        name="email"
        type="email"
        label="Adresse Courriel"
        className="mb-4"
        id={`txt${props.role}LoginEmail`}
        register={register}
        errors={errors}
      />

      <TextInput
        name="password"
        type="password"
        label="Mot de passe"
        className="mb-4"
        id={`txt${props.role}LoginPassword`}
        register={register}
        errors={errors}
      />

      <Submit gradient={`gradient-${props.submit.role}`} label="Se connecter">
        <Link className="text-muted" to={props.submit.to}>
          {props.submit.message}
        </Link>
      </Submit>

      <Return
        message="Vous n'avez pas de compte ?"
        color="danger"
        path="/page/user/create"
        btnLabel="Céer un compte"
      />
    </form>
  );
};

export default LoginForm;
