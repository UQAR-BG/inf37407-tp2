import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { quizValidationSchema } from "../../../validations/quiz";
import { errorDialogWrapper } from "../../modals/Dialog";
import AdminPage from "./AdminPage";
import QuizForm from "../../forms/QuizForm";
import { selectQuiz, editQuiz } from "../../../redux/quizSlice";

const AdminQuizEditPage = () => {
  const navigate = useNavigate();
  const selectedQuiz = useSelector(selectQuiz);
  const dispatch = useDispatch();

  const onSubmit = (formValues) => {
    dispatch(
      editQuiz({
        id: selectedQuiz.id,
        name: formValues.name,
        description: formValues.description,
      })
    )
      .unwrap()
      .then(() => {
        navigate("/page/admin/quizzes");
      })
      .catch((err) => {
        errorDialogWrapper(err);
      });
  };

  return (
    <AdminPage>
      <div className="col-xl-8">
        <div className="row g-0">
          <h3 className="mx-md-4">Modifier un quiz</h3>
          <div className="card-body mx-md-4">
            <QuizForm
              quiz={selectedQuiz}
              submitLabel="Modifier"
              submitColor="success"
              handleSubmit={onSubmit}
              validationSchema={quizValidationSchema}
            />
          </div>
        </div>
      </div>
    </AdminPage>
  );
};

export default AdminQuizEditPage;
