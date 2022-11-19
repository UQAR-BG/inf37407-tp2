import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPhrasesFromQuiz, selectPhrases } from "../../redux/phraseSlice";
import { fetchQuiz, selectQuiz } from "../../redux/quizSlice";
import Sentence from "./Sentence";

const Text = ({ id }) => {
  const dispatch = useDispatch();

  const quiz = useSelector(selectQuiz);
  const phrases = useSelector(selectPhrases);

  useEffect(() => {
    dispatch(fetchQuiz(id));
    dispatch(fetchPhrasesFromQuiz(id));
  }, [dispatch, id]);

  return (
    <>
      {quiz && <h3>{quiz.name}</h3>}
      {quiz &&
        phrases &&
        phrases.map((phrase, index) => (
          <Sentence key={index} sentence={phrase} />
        ))}
      {(!quiz || !phrases) && <p>Chargement des données en cours...</p>}
    </>
  );
};

export default Text;
