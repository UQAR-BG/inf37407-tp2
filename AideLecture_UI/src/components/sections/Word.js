import React, { useEffect } from "react";
import { DJANGO_API_URL } from "../../apis/djangoApi";
import { useDispatch, useSelector } from "react-redux";
import { confirmWrapper } from "../modals/ConfirmDialog";
import {
  selectedQuestionWord,
  fetchQuestionWord,
} from "../../redux/questionWordsSlice";

const Word = ({ word }) => {
  const dispatch = useDispatch();
  const questionWord = useSelector(selectedQuestionWord);

  useEffect(() => {
    if (word.questionWordId) {
      dispatch(fetchQuestionWord(word.questionWordId));
    }
  }, []);

  const renderExplanation = () => {
    return questionWord ? (
      <table className="table table-borderless table-fit my-4 text-center">
        <tbody>
          <tr>
            {questionWord.words.map((w, index) => (
              <td key={`td-img-${index}`}>
                {w.image && (
                  <img
                    key={index}
                    width="80px"
                    height="80px"
                    src={`${DJANGO_API_URL}${w.image}`}
                    alt={w.statement}
                  />
                )}
              </td>
            ))}
          </tr>
          <tr>
            {questionWord.words.map((w, index) => (
              <td key={`td-word-${index}`}>
                <span key={`word-${index}`} className="align-middle">
                  {w.statement}
                </span>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    ) : (
      /*<Sentence sentence={questionWord} />*/
      <span>Chargement des données en cours...</span>
    );
  };

  const showExplanation = () => {
    console.log("hello");
    const options = {
      title: `Quand tu entends ${word.statement}`,
    };

    if (questionWord) confirmWrapper(renderExplanation(), options);
  };

  const renderQuestionWord = () => {
    return (
      <span
        onMouseOver={showExplanation}
        className="question-word align-middle"
      >
        {word.statement}
      </span>
    );
  };

  return word.questionWordId ? (
    renderQuestionWord()
  ) : (
    <span className="align-middle">{word.statement}</span>
  );
};

export default Word;
