import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createPhraseValidationSchema } from "../../../validations/phrase";
import AdminPage from "../admin/AdminPage";
import { errorDialogWrapper } from "../../modals/Dialog";
import QuestionWordForm from "../../forms/QuestionWordForm";
import {
  clearQuestionWord,
  selectedQuestionWord,
  fetchQuestionWord,
  editQuestionWord,
} from "../../../redux/questionWordsSlice";

const QuestionWordEditPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  const questionWord = useSelector(selectedQuestionWord);

  useEffect(() => {
    dispatch(clearQuestionWord());
    dispatch(fetchQuestionWord(params.wordId));
  }, [dispatch, fetchQuestionWord, params]);

  const onSubmit = async (formValues, e) => {
    formValues.words.forEach((word, index) => {
      const fileInputName = `words[${index}].image`;
      if (e.target[fileInputName].value && e.target[fileInputName].files) {
        var imageFile = e.target[fileInputName].files[0];
        formValues.words[index].image = imageFile;
        formValues.words[index].filename = imageFile.name;
      }
    });

    const updatedQuestionWord = {
      ...questionWord,
      name: formValues.name,
      statement: formValues.statement,
      words: formValues.words,
    };

    dispatch(editQuestionWord(updatedQuestionWord))
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
          <h3 className="mx-md-4">Modifier un mot d'interrogation</h3>
          <div className="card-body mx-md-4">
            <QuestionWordForm
              decomposeOnLoad={true}
              wordToEdit={questionWord}
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

export default QuestionWordEditPage;
