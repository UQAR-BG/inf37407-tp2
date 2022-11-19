import * as Yup from "yup";

export const quizValidationSchema = Yup.object().shape({
  name: Yup.string().required("Ce champs est requis!"),
  description: Yup.string().required("Ce champs est requis!"),
});
