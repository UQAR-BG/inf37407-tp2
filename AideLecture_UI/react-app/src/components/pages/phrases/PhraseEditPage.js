import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createPhraseValidationSchema } from "../../../validations/phrase";
import AdminPage from "../admin/AdminPage";
import { errorDialogWrapper } from "../../modals/Dialog";
import PhraseForm from "../../forms/PhraseForm";
import {
  clearPhrase,
  selectedPhrase,
  fetchPhrase,
  editPhrase,
} from "../../../redux/phraseSlice";

const PhraseEditPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  const phrase = useSelector(selectedPhrase);

  useEffect(() => {
    dispatch(clearPhrase());
    dispatch(fetchPhrase(params.phraseId));
  }, [dispatch, fetchPhrase, params]);

  const onSubmit = async (formValues) => {
    let quizId = formValues.quiz ?? phrase.quizId;
    const updatedPhrase = {
      ...phrase,
      quizId: quizId.toString(),
      audio: formValues.audio,
      name: formValues.name,
      statement: formValues.statement,
      words: formValues.words,
    };

    dispatch(editPhrase(updatedPhrase))
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
          <h3 className="mx-md-4">Modifier un texte</h3>
          <div className="card-body mx-md-4">
            <PhraseForm
              decomposeOnLoad={true}
              phraseToEdit={phrase}
              submitLabel="Mettre à jour"
              submitColor="success"
              handleSubmit={onSubmit}
              validationSchema={createPhraseValidationSchema}
            />
          </div>
        </div>
      </div>
    </AdminPage>
  );
};

export default PhraseEditPage;
