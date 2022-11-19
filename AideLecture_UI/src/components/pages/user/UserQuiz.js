import UserPage from "./UserPage";
import QuizzesList from "../../sections/QuizzesList";
import { useParams } from "react-router-dom";
import Text from "../../sections/Text";
import Quiz from "../../sections/Quiz";

import "../../../styles/components/quiz.css";

const UserQuiz = () => {
  const params = useParams();

  return (
    <UserPage>
      {params.quizId ? (
        <>
          <Text id={params.quizId} />
          <Quiz id={params.quizId} />
        </>
      ) : (
        <QuizzesList />
      )}
    </UserPage>
  );
};

export default UserQuiz;
