import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminPage from "../admin/AdminPage";
import AddButton from "../../forms/buttons/AddButton";
import ActionButton from "../../forms/buttons/ActionButton";
import {
  focusQuiz,
  selectQuizzes,
  selectQuiz,
  fetchQuizzes,
} from "../../../redux/quizSlice";
import {
  focusQuestion,
  fetchQuestions,
  fetchQuestionsFromQuiz,
  selectQuestions,
  deleteQuestionThunk,
} from "../../../redux/questionSlice";
import {
  focusPhrase,
  fetchPhrasesFromQuiz,
  selectPhrases,
  deletePhraseThunk,
} from "../../../redux/phraseSlice";
import { confirmWrapper } from "../../modals/ConfirmDialog";

const QuizPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const quizzes = useSelector(selectQuizzes);
  const quiz = useSelector(selectQuiz);
  const questions = useSelector(selectQuestions);
  const phrases = useSelector(selectPhrases);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchQuizzes());

    if (params.quizId) {
      focusQuizOnLoad(params.quizId);
      dispatch(fetchQuestionsFromQuiz(params.quizId));
      dispatch(fetchPhrasesFromQuiz(params.quizId));
    } else {
      dispatch(fetchQuestions());
    }
  }, [dispatch, params.quizId]);

  const focusQuizOnLoad = (quizId) => {
    const quiz = quizzes.find((quiz) => quiz.id.toString() === quizId);
    if (quiz) {
      dispatch(focusQuiz(quiz));
    } else {
      navigate("/page/admin/quizzes");
    }
  };

  const focusPhraseForUpdate = (phrase) => {
    dispatch(focusPhrase(phrase));
    navigate(`/page/admin/phrase/edit/${phrase.id}`);
  };

  const handleDeletePhrase = async (phrase) => {
    if (await confirmWrapper("Souhaitez-vous vraiment supprimer ce texte ?")) {
      dispatch(deletePhraseThunk(phrase));
    }
  };

  const focusQuestionForUpdate = (question) => {
    dispatch(focusQuestion(question));
    navigate(`/page/admin/question/edit/${question.id}`);
  };

  const handleDeleteQuestion = async (question) => {
    if (
      await confirmWrapper("Souhaitez-vous vraiment supprimer cette question ?")
    ) {
      dispatch(deleteQuestionThunk(question));
    }
  };

  return (
    <AdminPage>
      <h3>
        {params.quizId && quiz ? `Quiz ${quiz.name}` : "Liste des questions"}
      </h3>

      {phrases && params.quizId ? (
        <>
          <h4 className="mt-4">Textes</h4>
          <div className="table-responsive mb-4">
            <table className="table my-4">
              <colgroup>
                <col className="col-md-1" />
                <col className="col-md-5" />
                <col className="col-md-4" />
                <col className="col-md-1" />
                <col className="col-md-1" />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Nom</th>
                  <th scope="col">Quiz associé</th>
                  <th scope="col">Modifier</th>
                  <th scope="col">Supprimer</th>
                </tr>
              </thead>
              <tbody>
                {phrases &&
                  phrases.map((phrase, index) => {
                    return (
                      <tr key={++index}>
                        <th scope="row">{++index}</th>
                        <td>
                          <Link
                            className="text-decoration-none"
                            to={`/page/admin/phrase/edit/${phrase.id}`}
                          >
                            {phrase.name}
                          </Link>
                        </td>
                        <td>
                          <Link
                            className="text-decoration-none"
                            to={`/page/admin/quiz/view/${phrase.quizId}`}
                          >
                            {
                              quizzes.find((quiz) => {
                                return quiz.id.toString() === phrase.quizId;
                              }).name
                            }
                          </Link>
                        </td>
                        <td>
                          <ActionButton
                            icon="plus"
                            color="success"
                            onClick={() => focusPhraseForUpdate(phrase)}
                          />
                        </td>
                        <td>
                          <ActionButton
                            icon="trash-can"
                            color="danger"
                            onClick={async () =>
                              await handleDeletePhrase(phrase)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <AddButton
              label="Ajouter un texte"
              to="/page/admin/phrase/create"
            />
          </div>
        </>
      ) : null}

      {questions ? (
        <>
          {params.quizId && <h4 className="mt-4">Questions</h4>}
          <div className="table-responsive">
            <table className="table my-4">
              <colgroup>
                <col className="col-md-1" />
                <col className="col-md-5" />
                <col className="col-md-4" />
                <col className="col-md-1" />
                <col className="col-md-1" />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Nom</th>
                  <th scope="col">Quiz associé</th>
                  <th scope="col">Modifier</th>
                  <th scope="col">Supprimer</th>
                </tr>
              </thead>
              <tbody>
                {questions &&
                  questions.map((question, index) => {
                    return (
                      <tr key={++index}>
                        <th scope="row">{++index}</th>
                        <td>
                          <Link
                            className="text-decoration-none"
                            to={`/page/admin/question/edit/${question.id}`}
                          >
                            {question.name}
                          </Link>
                        </td>
                        <td>
                          <Link
                            className="text-decoration-none"
                            to={`/page/admin/quiz/view/${question.quizId}`}
                          >
                            {
                              quizzes.find((quiz) => {
                                return quiz.id.toString() === question.quizId;
                              }).name
                            }
                          </Link>
                        </td>
                        <td>
                          <ActionButton
                            icon="plus"
                            color="success"
                            onClick={() => focusQuestionForUpdate(question)}
                          />
                        </td>
                        <td>
                          <ActionButton
                            icon="trash-can"
                            color="danger"
                            onClick={async () =>
                              await handleDeleteQuestion(question)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <AddButton
              label="Ajouter une question"
              to="/page/admin/question/create"
            />
          </div>
        </>
      ) : (
        <p>Chargement des données en cours...</p>
      )}
    </AdminPage>
  );
};

export default QuizPage;
