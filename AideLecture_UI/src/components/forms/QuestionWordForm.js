import React, { useEffect, useState } from "react";
import { DJANGO_API_URL } from "../../apis/djangoApi";
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextInput from "./fields/TextInputHook";
import WordsEdit from "./WordsEdit";
import ActionButton from "../forms/buttons/ActionButton";
import { selectWords, setWords } from "../../redux/questionWordsSlice";

const QuestionWordForm = (props) => {
  const audio = new Audio(`${DJANGO_API_URL}${props.phraseToEdit?.audio}`);
  const dispatch = useDispatch();
  const wordsOfQuestionWord = useSelector(selectWords);
  const [wordsDecomposed, setWordsDecomposed] = useState(false);

  const isInEditMode = () => {
    return props.wordToEdit != null;
  };

  const getWordsInitialValues = () => {
    if (isInEditMode() && props.wordToEdit.words) {
      if (!wordsDecomposed) {
        return props.wordToEdit.words.map((word) => {
          return { statement: word.statement, image: word.image };
        });
      }

      return wordsOfQuestionWord.map((word, index) => {
        return {
          statement: word,
          image: props.wordToEdit.words[index]
            ? props.wordToEdit.words[index].image
            : "",
        };
      });
    } else {
      return wordsOfQuestionWord.map((word) => {
        return { statement: word, image: "" };
      });
    }
  };

  const initialValues = {
    name: props.wordToEdit?.name,
    //audio: props.wordToEdit?.audio,
    statement:
      wordsDecomposed && isInEditMode() && props.wordToEdit.statement
        ? wordsOfQuestionWord.join(" ")
        : props.wordToEdit?.statement,
    words: getWordsInitialValues(),
  };

  const methods = useForm({
    mode: "all",
    resolver: yupResolver(props.validationSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    methods.reset(initialValues);
  }, [props.wordToEdit, wordsOfQuestionWord]);

  useEffect(() => {
    dispatch(setWords([]));
    if (props.decomposeOnLoad) {
      decomposeExplanation();
    }
  }, [dispatch, props.decomposeOnLoad, props.wordToEdit]);

  const decomposeExplanation = () => {
    let questionWord;
    let statementValue = methods.getValues("statement") ?? "";
    if (statementValue) {
      questionWord = statementValue;
    } else {
      questionWord = isInEditMode()
        ? props.wordToEdit.statement
        : statementValue;
    }

    if (questionWord) {
      let decomposedQuestionWord = questionWord.trim().split(" ");
      dispatch(setWords(decomposedQuestionWord));
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
        </div>

        {isInEditMode() && props.wordToEdit.audio ? (
          <div className="row">
            <div className="col-md-2">
              <ActionButton
                icon="volume-high"
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  audio.play();
                }}
              />
            </div>
            <div className="col-md-10">
              <TextInput
                name="statement"
                type="text"
                label="Texte"
                className="mb-4"
                id="txtQuestionWordExplanation"
                register={methods.register}
                errors={methods.formState.errors}
              />
            </div>
          </div>
        ) : (
          <TextInput
            name="statement"
            type="text"
            label="Texte"
            className="mb-4"
            id="txtQuestionWordExplanation"
            register={methods.register}
            errors={methods.formState.errors}
          />
        )}

        <WordsEdit onHandleClick={decomposeExplanation} />

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

export default QuestionWordForm;
