import * as Yup from "yup";

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Le format de l'adresse courriel n'est pas valide.")
    .required("Ce champs est requis!"),
  password: Yup.string().required("Ce champs est requis!"),
});
