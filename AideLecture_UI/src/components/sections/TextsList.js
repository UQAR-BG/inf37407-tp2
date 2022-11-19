import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchQuizzes, selectQuizzes } from "../../redux/quizSlice";
import ActionButton from "../forms/buttons/ActionButton";

const TextsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const texts = useSelector(selectQuizzes);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  return (
    <>
      <h3>Liste des textes</h3>
      {texts ? (
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
              {texts.map((text, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>
                    <Link
                      className="text-decoration-none"
                      to={`/page/user/text/${text.id}`}
                    >
                      {text.name}
                    </Link>
                  </td>
                  <td>
                    <ActionButton
                      icon="eye"
                      color="primary"
                      onClick={() => navigate(`/page/user/text/${text.id}`)}
                    />
                  </td>
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

export default TextsList;
