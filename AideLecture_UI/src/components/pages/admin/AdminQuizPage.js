import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AdminPage from "./AdminPage";
import AddButton from "../../forms/buttons/AddButton";
import ActionButton from "../../forms/buttons/ActionButton";
import {
  focusQuiz,
  selectQuizzes,
  fetchQuizzes,
  deleteQuizThunk,
} from "../../../redux/quizSlice";
import { confirmWrapper } from "../../modals/ConfirmDialog";

const AdminQuizPage = () => {
  const navigate = useNavigate();
  const quizzes = useSelector(selectQuizzes);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  const focusQuizForUpdate = (quiz) => {
    dispatch(focusQuiz(quiz));
    navigate("/page/admin/quiz/edit");
  };

  const handleDeleteQuiz = async (quiz) => {
    if (await confirmWrapper("Souhaitez-vous vraiment supprimer ce quiz ?")) {
      dispatch(deleteQuizThunk(quiz));
    }
  };

  return (
    <AdminPage>
      <h3>Liste des quiz</h3>

      {quizzes ? (
        <div className="table-responsive">
          <table className="table my-4">
            <colgroup>
              <col className="col-md-1" />
              <col className="col-md-9" />
              <col className="col-md-1" />
              <col className="col-md-1" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nom</th>
                <th scope="col">Modifier</th>
                <th scope="col">Supprimer</th>
              </tr>
            </thead>
            <tbody>
              {quizzes
                ? quizzes.map((quiz, index) => {
                    return (
                      <tr key={++index}>
                        <th scope="row">{++index}</th>
                        <td>
                          <Link
                            className="text-decoration-none"
                            to={`/page/admin/quiz/view/${quiz.id}`}
                          >
                            {quiz.name}
                          </Link>
                        </td>
                        <td>
                          <ActionButton
                            icon="plus"
                            color="success"
                            onClick={() => focusQuizForUpdate(quiz)}
                          />
                        </td>
                        <td>
                          <ActionButton
                            icon="trash-can"
                            color="danger"
                            onClick={async () => await handleDeleteQuiz(quiz)}
                          />
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Chargement des données en cours...</p>
      )}

      <AddButton label="Ajouter un quiz" to="/page/admin/quiz/create" />
    </AdminPage>
  );
};

export default AdminQuizPage;
