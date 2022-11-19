import * as Yup from "yup";

export const quizValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Ce champs est requis!")
    .max(100, "Le nom du quiz ne peut pas dépasser 100 caractères."),
  description: Yup.string()
    .required("Ce champs est requis!")
    .max(1000, "La description du quiz ne peut pas dépasser 1000 caractères."),
});
