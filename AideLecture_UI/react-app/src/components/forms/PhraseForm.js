import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Form from "react-bootstrap/Form";
import TextInput from "./fields/TextInputHook";
import WordsEdit from "./WordsEdit";
import { selectQuiz, selectQuizzes, fetchQuizzes } from "../../redux/quizSlice";
import { selectWords, setWords } from "../../redux/phraseSlice";

const PhraseForm = (props) => {
  const dispatch = useDispatch();
  const quizzes = useSelector(selectQuizzes);
  const selectedQuiz = useSelector(selectQuiz);
  const wordsOfPhrase = useSelector(selectWords);
  const [wordsDecomposed, setWordsDecomposed] = useState(false);

  const isInEditMode = () => {
    return props.phraseToEdit != null;
  };

  const getWordsInitialValues = () => {
    if (isInEditMode() && props.phraseToEdit.words) {
      if (!wordsDecomposed) {
        return props.phraseToEdit.words.map((word) => {
          return { statement: word.statement, image: word.image };
        });
      }

      return wordsOfPhrase.map((word, index) => {
        return {
          statement: word,
          image: props.phraseToEdit.words[index]
            ? props.phraseToEdit.words[index].image
            : "",
        };
      });
    } else {
      return wordsOfPhrase.map((word) => {
        return { statement: word, image: "" };
      });
    }
  };

  const initialValues = {
    name: props.phraseToEdit?.name,
    audio: props.phraseToEdit?.audio,
    statement:
      wordsDecomposed && isInEditMode() && props.phraseToEdit.statement
        ? wordsOfPhrase.join(" ")
        : props.phraseToEdit?.statement,
    words: getWordsInitialValues(),
    quiz: selectedQuiz?.id,
  };

  const methods = useForm({
    mode: "all",
    resolver: yupResolver(props.validationSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    methods.reset(initialValues);
  }, [props.phraseToEdit, wordsOfPhrase, selectedQuiz]);

  useEffect(() => {
    dispatch(fetchQuizzes());
    dispatch(setWords([]));
    if (props.decomposeOnLoad) {
      decomposePhrase();
    }
  }, [dispatch, fetchQuizzes, props.decomposeOnLoad, props.phraseToEdit]);

  const decomposePhrase = () => {
    let phrase;
    let statementValue = methods.getValues("statement") ?? "";
    if (statementValue) {
      phrase = statementValue;
    } else {
      phrase = isInEditMode() ? props.phraseToEdit.statement : statementValue;
    }

    if (phrase) {
      let decomposedPhrase = phrase.trim().split(" ");
      dispatch(setWords(decomposedPhrase));
      setWordsDecomposed(true);
    } else {
      dispatch(setWords([]));
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className="error"
        onSubmit={methods.handleSubmit(props.handleSubmit)}
      >
        <div className="row">
          <div className="col-md-6">
            <TextInput
              name="name"
              type="text"
              label="Nom"
              className="mb-4"
              id="txtPhraseName"
              register={methods.register}
              errors={methods.formState.errors}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="quiz">
              Quiz associé
            </label>
            <Form.Select
              name="quiz"
              {...methods.register("quiz")}
              className="form-control"
            >
              {quizzes.map((quiz, index) => {
                return (
                  <option key={index} value={quiz.id}>
                    {quiz.name}
                  </option>
                );
              })}
            </Form.Select>
          </div>
        </div>

        <TextInput
          name="audio"
          type="text"
          label="Fichier audio"
          className="mb-4"
          id="txtPhraseAudio"
          register={methods.register}
          errors={methods.formState.errors}
        />
        <TextInput
          name="statement"
          type="text"
          label="Texte"
          className="mb-4"
          id="txtPhraseStatement"
          register={methods.register}
          errors={methods.formState.errors}
        />

        <WordsEdit onHandleClick={decomposePhrase} />

        <button
          type="submit"
          className={`btn btn-outline-${props.submitColor}`}
        >
          {props.submitLabel}
        </button>
      </form>
    </FormProvider>
  );
};

export default PhraseForm;
