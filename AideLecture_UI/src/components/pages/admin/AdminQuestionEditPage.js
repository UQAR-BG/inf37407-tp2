import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createQuestionValidationSchema } from "../../../validations/question";
import AdminPage from "./AdminPage";
import { errorDialogWrapper } from "../../modals/Dialog";
import QuestionForm from "../../forms/QuestionForm";
import {
  clearQuestion,
  selectedQuestion,
  fetchQuestion,
  editQuestion,
} from "../../../redux/questionSlice";
import {
  selectQuestionWords,
  fetchQuestionWords,
} from "../../../redux/questionWordsSlice";

const AdminQuestionEditPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  const question = useSelector(selectedQuestion);
  const questionWords = useSelector(selectQuestionWords);

  useEffect(() => {
    dispatch(clearQuestion());
    dispatch(fetchQuestion(params.questionId));
    dispatch(fetchQuestionWords());
  }, [dispatch, fetchQuestion, params]);

  const onSubmit = async (formValues) => {
    let answerId = formValues["rightAnswer"] ?? question.rightAnswerId;

    let quizId = formValues.quiz ?? question.quizId;
    let answers = [];
    for (let i = 0; i < 4; i++) {
      answers.push({
        id: i,
        statement: formValues.answers[i].statement,
        image: formValues.answers[i].image,
        audio: formValues.answers[i].audio,
        isRightAnswer: answerId === i.toString(),
      });
    }
    const updatedQuestion = {
      ...question,
      quizId: quizId.toString(),
      questionAudio: formValues.questionAudio,
      name: formValues.name,
      statement: formValues.statement,
      words: formValues.words,
      answers: answers,
      rightAnswerId: answerId,
    };
    const questionWord = questionWords.find(
      ({ name }) =>
        question.words[0].statement.toLowerCase() === name.toLowerCase()
    );
    console.log(questionWord);
    if (questionWord) updatedQuestion.words[0].questionWordId = questionWord.id;

    dispatch(editQuestion(updatedQuestion))
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
          <h3 className="mx-md-4">Modifier une question</h3>
          <div className="card-body mx-md-4">
            <QuestionForm
              decomposeOnLoad={true}
              questionToEdit={question}
              submitLabel="Mettre à jour"
              submitColor="success"
              handleSubmit={onSubmit}
              validationSchema={createQuestionValidationSchema}
            />
          </div>
        </div>
      </div>
    </AdminPage>
  );
};

export default AdminQuestionEditPage;
