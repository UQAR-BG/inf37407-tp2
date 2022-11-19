import * as Yup from "yup";

const word = Yup.object({
  statement: Yup.string().required("Ce champs est requis!"),
});

export const createPhraseValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Ce champs est requis!")
    .max(50, "Le nom du texte ne peut pas dépasser 50 caractères."),
  statement: Yup.string()
    .required("Ce champs est requis!")
    .max(300, "L'explication du texte ne peut pas dépasser 300 caractères."),
  words: Yup.array().of(word),
});
