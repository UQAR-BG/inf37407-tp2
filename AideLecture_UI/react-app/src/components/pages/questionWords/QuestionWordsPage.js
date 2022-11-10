import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AdminPage from "../admin/AdminPage";
import AddButton from "../../forms/buttons/AddButton";
import ActionButton from "../../forms/buttons/ActionButton";
import {
  focusQuestionWord,
  fetchQuestionWords,
  selectQuestionWords,
  deleteQuestionWordThunk,
} from "../../../redux/questionWordsSlice";
import { confirmWrapper } from "../../modals/ConfirmDialog";

const QuestionWordsPage = () => {
  const navigate = useNavigate();
  const questionWords = useSelector(selectQuestionWords);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchQuestionWords());
  }, [dispatch]);

  const focusWordForUpdate = (word) => {
    dispatch(focusQuestionWord(word));
    navigate(`/page/admin/question-word/edit/${word.id}`);
  };

  const handleDeleteWord = async (word) => {
    if (
      await confirmWrapper(
        "Souhaitez-vous vraiment supprimer ce mot d'interrogation ?"
      )
    ) {
      dispatch(deleteQuestionWordThunk(word));
    }
  };

  return (
    <AdminPage>
      <h3>Liste des mots d'interrogation</h3>

      {questionWords ? (
        <div className="table-responsive">
          <table className="table my-4">
            <colgroup>
              <col className="col-md-1" />
              <col className="col-md-4" />
              <col className="col-md-5" />
              <col className="col-md-1" />
              <col className="col-md-1" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nom</th>
                <th scope="col">Explication</th>
                <th scope="col">Modifier</th>
                <th scope="col">Supprimer</th>
              </tr>
            </thead>
            <tbody>
              {questionWords &&
                questionWords.map((word, index) => {
                  return (
                    <tr key={++index}>
                      <th scope="row">{++index}</th>
                      <td>
                        <Link
                          className="text-decoration-none"
                          to={`/page/admin/question-word/edit/${word.id}`}
                        >
                          {word.name}
                        </Link>
                      </td>
                      <td>{word.statement}</td>
                      <td>
                        <ActionButton
                          icon="plus"
                          color="success"
                          onClick={() => focusWordForUpdate(word)}
                        />
                      </td>
                      <td>
                        <ActionButton
                          icon="trash-can"
                          color="danger"
                          onClick={async () => await handleDeleteWord(word)}
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

      <AddButton
        label="Ajouter un mot d'interrogation"
        to="/page/admin/question-word/create"
      />
    </AdminPage>
  );
};

export default QuestionWordsPage;
