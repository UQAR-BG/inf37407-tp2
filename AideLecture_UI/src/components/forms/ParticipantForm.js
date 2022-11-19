import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Submit from "./buttons/Submit";
import Return from "./buttons/Return";
import TextInput from "./fields/TextInputHook";

const ParticipantForm = (props) => {
  const initialValues = {
    firstName: props.user?.first_name,
    lastName: props.user?.last_name,
    email: props.user?.email,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "all",
    resolver: yupResolver(props.validationSchema),
    defaultValues: useMemo(() => initialValues, [props]),
  });

  useEffect(() => {
    reset(initialValues);
  }, [props.user]);

  return (
    <form className="error" onSubmit={handleSubmit(props.handleSubmit)}>
      <div className="row">
        <div className="col-md-6 mb-4">
          <TextInput
            name="firstName"
            type="text"
            label="Prénom"
            className="mb-4"
            id={`txtUser${props.action}FirstName`}
            register={register}
            errors={errors}
          />
        </div>

        <div className="col-md-6 mb-4">
          <TextInput
            name="lastName"
            type="text"
            label="Nom"
            className="mb-4"
            id={`txtUser${props.action}LastName`}
            register={register}
            errors={errors}
          />
        </div>
      </div>

      <TextInput
        name="email"
        type="email"
        label="Adresse courriel"
        className="mb-4"
        id={`txtUser${props.action}Email`}
        disabled={props.action === "Modifier"}
        register={register}
        errors={errors}
      />

      <TextInput
        name="password"
        type="password"
        label="Mot de passe"
        className="mb-4"
        id={`txtUser${props.action}Password`}
        register={register}
        errors={errors}
      />

      <TextInput
        name="confirmPassword"
        type="password"
        label="Confirmation du mot de passe"
        className="mb-4"
        id={`txtUser${props.action}ConfirmPassword`}
        register={register}
        errors={errors}
      />

      <Submit gradient="gradient-user" label={`${props.action} le compte`}>
        {props.children}
      </Submit>

      <Return
        message="Ce n'est pas ce que vous cherchez ?"
        color="danger"
        path="/"
        btnLabel="Retour à l'accueil"
      />
    </form>
  );
};

export default ParticipantForm;
