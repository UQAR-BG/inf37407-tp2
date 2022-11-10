import { useNavigate, useParams } from "react-router-dom";
import AdminPage from "../admin/AdminPage";
import QuizzesList from "../../sections/QuizzesList";
import ActionButton from "../../forms/buttons/ActionButton";
import Result from "../../sections/Result";

const QuizResultPage = () => {
  const params = useParams();
  const navigate = useNavigate();

  const linkCreator = (quiz) => `/page/admin/quiz/result/${quiz.id}`;
  const actionsCreator = (quiz) => (
    <ActionButton
      icon="chart-pie"
      color="primary"
      onClick={() => navigate(linkCreator(quiz))}
    />
  );

  return (
    <AdminPage>
      {params.quizId ? (
        <Result quizId={params.quizId} />
      ) : (
        <QuizzesList link={linkCreator} actions={actionsCreator} />
      )}
    </AdminPage>
  );
};

export default QuizResultPage;
