import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createPhraseValidationSchema } from "../../../validations/phrase";
import AdminPage from "../admin/AdminPage";
import { errorDialogWrapper } from "../../modals/Dialog";
import QuestionWordForm from "../../forms/QuestionWordForm";
import { addQuestionWord } from "../../../redux/questionWordsSlice";

const QuestionWordCreatePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (formValues) => {
    if (!formValues.words) {
      errorDialogWrapper("Vous devez décomposer l'explication en mots.");
      return;
    }

    const word = {
      audio: formValues.audio,
      name: formValues.name,
      statement: formValues.statement,
      words: formValues.words,
    };

    dispatch(addQuestionWord(word))
      .unwrap()
      .then(() => {
        navigate("/page/admin/question-words");
      })
      .catch((err) => {
        errorDialogWrapper(err);
      });
  };

  return (
    <AdminPage>
      <div className="col-xl-8">
        <div className="row g-0">
          <h3 className="mx-md-4">Ajouter un mot d'interrogation</h3>
          <div className="card-body mx-md-4">
            <QuestionWordForm
              submitLabel="Créer"
              submitColor="primary"
              handleSubmit={onSubmit}
              validationSchema={createPhraseValidationSchema}
            />
          </div>
        </div>
      </div>
    </AdminPage>
  );
};

export default QuestionWordCreatePage;
