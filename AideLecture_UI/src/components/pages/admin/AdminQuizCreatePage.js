import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { quizValidationSchema } from "../../../validations/quiz";
import AdminPage from "./AdminPage";
import { errorDialogWrapper } from "../../modals/Dialog";
import QuizForm from "../../forms/QuizForm";
import { addQuiz } from "../../../redux/quizSlice";

const AdminQuizCreatePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (formValues) => {
    dispatch(
      addQuiz({
        name: formValues.name,
        description: formValues.description,
      })
    )
      .unwrap()
      .then((newQuiz) => {
        navigate(`/page/admin/quiz/view/${newQuiz.id}`);
      })
      .catch((err) => {
        errorDialogWrapper(err);
      });
  };

  return (
    <AdminPage>
      <div className="col-xl-8">
        <div className="row g-0">
          <h3 className="mx-md-4">Ajouter un nouveau quiz</h3>
          <div className="card-body mx-md-4">
            <QuizForm
              submitLabel="Créer"
              submitColor="primary"
              handleSubmit={onSubmit}
              validationSchema={quizValidationSchema}
            />
          </div>
        </div>
      </div>
    </AdminPage>
  );
};

export default AdminQuizCreatePage;
