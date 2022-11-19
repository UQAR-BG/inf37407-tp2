import React, { useEffect, useState } from "react";
import { DJANGO_API_URL } from "../../apis/djangoApi";
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Form from "react-bootstrap/Form";
import TextInput from "./fields/TextInputHook";
import Answers from "./Answers";
import WordsEdit from "./WordsEdit";
import ActionButton from "../forms/buttons/ActionButton";
import { selectQuiz, selectQuizzes, fetchQuizzes } from "../../redux/quizSlice";
import {
  selectWords,
  setWords,
  selectAnswers,
  setAnswers,
} from "../../redux/questionSlice";

const QuestionForm = (props) => {
  const audio = new Audio(
    `${DJANGO_API_URL}${props.questionToEdit?.questionAudio}`
  );
  const dispatch = useDispatch();
  const quizzes = useSelector(selectQuizzes);
  const selectedQuiz = useSelector(selectQuiz);
  const wordsOfQuestion = useSelector(selectWords);
  const answersOfQuestion = useSelector(selectAnswers);
  const [wordsDecomposed, setWordsDecomposed] = useState(false);

  const isInEditMode = () => {
    return props.questionToEdit;
  };

  const getWordsInitialValues = () => {
    if (isInEditMode() && props.questionToEdit.words) {
      if (!wordsDecomposed) {
        return props.questionToEdit.words.map((word) => {
          return {
            statement: word.statement,
            image: word.image,
            isQuestionWord: word.isQuestionWord,
          };
        });
      }

      return wordsOfQuestion.map((word, index) => {
        return {
          statement: word,
          image: props.questionToEdit.words[index]
            ? props.questionToEdit.words[index].image
            : "",
        };
      });
    } else {
      return wordsOfQuestion.map((word) => {
        return { statement: word, image: "", isQuestionWord: false };
      });
    }
  };

  const getAnswersInitialValues = () => {
    if (isInEditMode()) {
      return !wordsDecomposed
        ? props.questionToEdit.answers
        : answersOfQuestion;
    } else {
      if (!wordsDecomposed) {
        return [1, 2, 3, 4].map((index) => {
          return {
            id: index,
            isRightAnswer: index === 1,
            statement: "",
            image: "",
            //audio: "",
          };
        });
      }

      return answersOfQuestion;
    }
  };

  const getRightAnswerInitialValue = () => {
    if (isInEditMode()) {
      return props.questionToEdit.answers.findIndex(
        (answer) => answer.isRightAnswer
      );
    } else {
      if (!wordsDecomposed) return 0;
      return answersOfQuestion.findIndex((answer) => answer.isRightAnswer);
    }
  };

  const initialValues = {
    name: props.questionToEdit?.name,
    //questionAudio: props.questionToEdit?.questionAudio,
    statement:
      wordsDecomposed && isInEditMode() && props.questionToEdit.statement
        ? wordsOfQuestion.join(" ")
        : props.questionToEdit?.statement,
    words: getWordsInitialValues(),
    answers: getAnswersInitialValues(),
    rightAnswer: getRightAnswerInitialValue().toString(),
    quiz: isInEditMode()
      ? props.questionToEdit.quizId.toString()
      : selectedQuiz?.id.toString(),
  };

  const methods = useForm({
    mode: "all",
    resolver: yupResolver(props.validationSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    methods.reset(initialValues);
  }, [props.questionToEdit, wordsOfQuestion, answersOfQuestion, selectedQuiz]);

  useEffect(() => {
    dispatch(fetchQuizzes());
    dispatch(setWords([]));
    if (props.decomposeOnLoad) {
      decomposeQuestion();

      const answers = isInEditMode() ? props.questionToEdit.answers : [];
      dispatch(setAnswers(answers));
    }
  }, [dispatch, fetchQuizzes, props.decomposeOnLoad, props.questionToEdit]);

  const handleDecomposeQuestionOnClick = (answers) => {
    dispatch(setAnswers(answers));
    decomposeQuestion();
  };

  const decomposeQuestion = () => {
    let question;
    let statementValue = methods.getValues("statement");
    if (statementValue) {
      question = statementValue;
    } else {
      question = isInEditMode()
        ? props.questionToEdit.statement
        : statementValue;
    }

    if (question) {
      let decomposedQuestion = question.trim().split(" ");
      dispatch(setWords(decomposedQuestion));
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
              id="txtQuestionName"
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

        {isInEditMode() && props.questionToEdit.questionAudio ? (
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
                label="Question"
                className="mb-4"
                id="txtQuestionStatement"
                register={methods.register}
                errors={methods.formState.errors}
              />
            </div>
          </div>
        ) : (
          <TextInput
            name="statement"
            type="text"
            label="Question"
            className="mb-4"
            id="txtQuestionStatement"
            register={methods.register}
            errors={methods.formState.errors}
          />
        )}

        <WordsEdit onHandleClick={handleDecomposeQuestionOnClick} />

        <Answers />

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

export default QuestionForm;
