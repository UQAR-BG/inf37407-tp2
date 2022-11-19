import * as Yup from "yup";

export const createParticipantValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("Ce champs est requis!"),
  lastName: Yup.string().required("Ce champs est requis!"),
  email: Yup.string()
    .email("Le format de l'adresse courriel n'est pas valide.")
    .required("Ce champs est requis!"),
  password: Yup.string().required("Ce champs est requis!"),
  confirmPassword: Yup.string()
    .required("Ce champs est requis!")
    .oneOf([Yup.ref("password")], "Les mots de passe doivent être égaux."),
});

export const editParticipantValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("Ce champs est requis!"),
  lastName: Yup.string().required("Ce champs est requis!"),
  email: Yup.string()
    .email("Le format de l'adresse courriel n'est pas valide.")
    .required("Ce champs est requis!"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password")],
    "Les mots de passe doivent être égaux."
  ),
});
