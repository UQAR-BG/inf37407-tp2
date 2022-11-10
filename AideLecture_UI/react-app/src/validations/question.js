import * as Yup from "yup";

const word = Yup.object({
  statement: Yup.string().required("Ce champs est requis!"),
});

const answer = Yup.object({
  statement: Yup.string().required("Ce champs est requis!"),
});

export const createQuestionValidationSchema = Yup.object().shape({
  name: Yup.string().required("Ce champs est requis!"),
  statement: Yup.string().required("Ce champs est requis!"),
  words: Yup.array().of(word),
  answers: Yup.array().of(answer),
});
