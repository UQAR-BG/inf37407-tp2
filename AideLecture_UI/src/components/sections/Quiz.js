import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuestionsFromQuiz,
  selectQuestions,
} from "../../redux/questionSlice";
import Question from "./Question";
import { shuffleArray } from "../../utils/randomUtils";
import {
  addResult,
  authenticatedUser,
  editParticipant,
} from "../../redux/userSlice";
import { errorDialogWrapper } from "../modals/Dialog";

const Quiz = ({ id }) => {
  const dispatch = useDispatch();
  const questions = useSelector(selectQuestions);
  const participant = useSelector(authenticatedUser);
  const [current, setCurrent] = useState(0);
  const [randomized, setRandomized] = useState(questions);
  let choices = useRef({});

  useEffect(() => {
    dispatch(fetchQuestionsFromQuiz(id));
  }, [dispatch, id]);
  useEffect(() => {
    setRandomized(shuffleArray(questions));
  }, [questions]);

  const calculateScore = () =>
    Object.keys(choices.current).reduce(
      (total, x) =>
        total +
        (randomized.find((q) => `${q.id}` === x).rightAnswerId ===
        parseInt(choices.current[x])
          ? 1
          : 0),
      0
    );

  function saveUserAnswers() {
    if (!participant) return;

    const attempt = {
      datetime: new Date(),
      choices: Object.keys(choices.current).map((questionId) => {
        return {
          questionId: parseInt(questionId),
          answerId: parseInt(choices.current[questionId]),
        };
      }),
      score: calculateScore(),
      userId: participant.id,
      quizId: parseInt(id),
    };

    dispatch(addResult(attempt))
      .unwrap()
      .catch((err) => {
        errorDialogWrapper(err);
      });
  }

  function next(questionId, answerId) {
    choices.current[questionId] = answerId;
    setCurrent(current + 1);
    if (current === randomized.length - 1) saveUserAnswers();
  }

  return randomized ? (
    randomized.length > 0 ? (
      current < randomized.length ? (
        <>
          <hr />
          <h3>Questionnaire:</h3>
          <Question
            question={randomized[current]}
            next={next}
            nextText={
              current === randomized.length - 1
                ? "Terminer le quiz"
                : "Question suivante"
            }
          />
        </>
      ) : (
        <h5 className="mt-4">
          Vous avez obtenu un score de {calculateScore()}/
          {Object.keys(choices.current).length} !
        </h5>
      )
    ) : (
      <p>Aucun quiz disponible</p>
    )
  ) : (
    <p>Chargement des données en cours...</p>
  );
};

export default Quiz;
