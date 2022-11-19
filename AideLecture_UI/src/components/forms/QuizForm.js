import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextInput from "./fields/TextInputHook";

const QuizForm = (props) => {
  const initialValues = {
    name: props.quiz?.name,
    description: props.quiz?.description,
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
  }, [props.quiz]);

  return (
    <form className="error" onSubmit={handleSubmit(props.handleSubmit)}>
      <TextInput
        name="name"
        type="text"
        label="Nom"
        className="mb-4"
        id="txtQuizName"
        register={register}
        errors={errors}
      />

      <TextInput
        name="description"
        type="text"
        label="Description"
        className="mb-4"
        id="txtQuizDescription"
        register={register}
        errors={errors}
      />

      <button type="submit" className={`btn btn-outline-${props.submitColor}`}>
        {props.submitLabel}
      </button>
    </form>
  );
};

export default QuizForm;
