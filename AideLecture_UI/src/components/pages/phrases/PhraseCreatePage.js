import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createPhraseValidationSchema } from "../../../validations/phrase";
import AdminPage from "../admin/AdminPage";
import { errorDialogWrapper } from "../../modals/Dialog";
import PhraseForm from "../../forms/PhraseForm";
import { selectQuiz } from "../../../redux/quizSlice";
import { addPhrase } from "../../../redux/phraseSlice";

const PhraseCreatePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedQuiz = useSelector(selectQuiz);

  const onSubmit = async (formValues, e) => {
    if (!formValues.words) {
      errorDialogWrapper("Vous devez décomposer le texte en mots.");
      return;
    }

    formValues.words.forEach((word, index) => {
      const fileInputName = `words[${index}].image`;
      if (e.target[fileInputName].value && e.target[fileInputName].files) {
        var imageFile = e.target[fileInputName].files[0];
        formValues.words[index].image = imageFile;
        formValues.words[index].filename = imageFile.name;
      }
    });

    let quizId = formValues.quiz ?? selectedQuiz.id;
    const phrase = {
      quizId: quizId.toString(),
      name: formValues.name,
      statement: formValues.statement,
      words: formValues.words,
    };

    dispatch(addPhrase(phrase))
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
          <h3 className="mx-md-4">Ajouter un nouveau texte</h3>
          <div className="card-body mx-md-4">
            <PhraseForm
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

export default PhraseCreatePage;
