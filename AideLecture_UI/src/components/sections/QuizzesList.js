import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchQuizzes, selectQuizzes } from "../../redux/quizSlice";
import ActionButton from "../forms/buttons/ActionButton";

const QuizzesList = (params) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const quizzes = useSelector(selectQuizzes);

  const linkCreator = params.link ?? ((quiz) => `/page/user/quiz/${quiz.id}`);
  const actionsCreator =
    params.actions ??
    ((quiz) => (
      <ActionButton
        icon="pencil"
        color="primary"
        onClick={() => navigate(linkCreator(quiz))}
      />
    ));

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  return (
    <>
      <h3>Liste des quiz</h3>
      {quizzes ? (
        <div className="table-responsive">
          <table className="table my-4">
            <thead>
              <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>
                    <Link
                      className="text-decoration-none"
                      to={linkCreator(quiz)}
                    >
                      {quiz.name}
                    </Link>
                  </td>
                  <td>{actionsCreator(quiz)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Chargement des données en cours...</p>
      )}
    </>
  );
};

export default QuizzesList;
