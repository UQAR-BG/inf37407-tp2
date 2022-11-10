import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AdminPage from "../admin/AdminPage";
import AddButton from "../../forms/buttons/AddButton";
import ActionButton from "../../forms/buttons/ActionButton";
import { selectQuizzes, fetchQuizzes } from "../../../redux/quizSlice";
import {
  focusPhrase,
  fetchPhrases,
  selectPhrases,
  deletePhraseThunk,
} from "../../../redux/phraseSlice";
import { confirmWrapper } from "../../modals/ConfirmDialog";

const PhrasesPage = () => {
  const navigate = useNavigate();
  const quizzes = useSelector(selectQuizzes);
  const phrases = useSelector(selectPhrases);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchQuizzes());
    dispatch(fetchPhrases());
  }, [dispatch]);

  const focusPhraseForUpdate = (phrase) => {
    dispatch(focusPhrase(phrase));
    navigate(`/page/admin/phrase/edit/${phrase.id}`);
  };

  const handleDeletePhrase = async (phrase) => {
    if (await confirmWrapper("Souhaitez-vous vraiment supprimer ce texte ?")) {
      dispatch(deletePhraseThunk(phrase));
    }
  };

  return (
    <AdminPage>
      <h3>Liste des textes</h3>

      {phrases ? (
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
                          onClick={async () => await handleDeletePhrase(phrase)}
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Chargement des données en cours...</p>
      )}

      <AddButton label="Ajouter une phrase" to="/page/admin/phrase/create" />
    </AdminPage>
  );
};

export default PhrasesPage;
