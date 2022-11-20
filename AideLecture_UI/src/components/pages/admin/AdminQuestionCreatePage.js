import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createQuestionValidationSchema } from "../../../validations/question";
import AdminPage from "./AdminPage";
import { errorDialogWrapper } from "../../modals/Dialog";
import QuestionForm from "../../forms/QuestionForm";
import { selectQuiz } from "../../../redux/quizSlice";
import { addQuestion } from "../../../redux/questionSlice";
import {
  selectQuestionWords,
  fetchQuestionWords,
} from "../../../redux/questionWordsSlice";

const AdminQuestionCreatePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedQuiz = useSelector(selectQuiz);
  const questionWords = useSelector(selectQuestionWords);

  useEffect(() => {
    dispatch(fetchQuestionWords());
  }, [dispatch, fetchQuestionWords]);

  const onSubmit = async (formValues, e) => {
    if (!formValues.words) {
      errorDialogWrapper("Vous devez décomposer la question en mots.");
      return;
    }

    if (!formValues.rightAnswer) {
      errorDialogWrapper("Vous devez sélectionner la bonne réponse");
      return;
    }

    formValues.words.forEach((word, index) => {
      const fileInputName = `words[${index}].image`;
      if (e.target[fileInputName].value && e.target[fileInputName].files) {
        var imageFile = e.target[fileInputName].files[0];
        formValues.words[index].image = imageFile;
        formValues.words[index].filename = imageFile.name;
      }
    });

    let quizId = formValues.quiz ?? selectedQuiz.id;
    let answers = [];
    for (let i = 0; i < 4; i++) {
      answers.push({
        id: i,
        statement: formValues.answers[i].statement,
        isRightAnswer: formValues["rightAnswer"] === i.toString(),
      });

      const fileInputName = `answers[${i}].image`;
      if (e.target[fileInputName].value && e.target[fileInputName].files) {
        var imageFile = e.target[fileInputName].files[0];
        answers[i].image = imageFile;
        answers[i].filename = imageFile.name;
      }
    }

    const question = {
      quizId: parseInt(quizId),
      name: formValues.name,
      statement: formValues.statement,
      words: formValues.words,
      answers: answers,
      rightAnswerId: parseInt(formValues["rightAnswer"]),
    };
    const questionWord = questionWords.find(
      ({ name }) =>
        question.words[0].statement.toLowerCase() === name.toLowerCase()
    );
    if (questionWord) question.words[0].questionWordId = questionWord.id;

    dispatch(addQuestion(question))
      .unwrap()
      .then(() => {
        navigate(`/page/admin/quiz/view/${quizId}`);
      })
      .catch((err) => {
        errorDialogWrapper(err);
      });
  };

  return (
    <AdminPage>
      <div className="col-xl-8">
        <div className="row g-0">
          <h3 className="mx-md-4">Ajouter une nouvelle question</h3>
          <div className="card-body mx-md-4">
            <QuestionForm
              submitLabel="Créer"
              submitColor="primary"
              handleSubmit={onSubmit}
              validationSchema={createQuestionValidationSchema}
            />
          </div>
        </div>
      </div>
    </AdminPage>
  );
};

export default AdminQuestionCreatePage;
