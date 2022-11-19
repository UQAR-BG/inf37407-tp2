import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLoginPage from "./pages/user/UserLoginPage";
import UserCreatePage from "./pages/user/UserCreatePage";
import UserEditPage from "./pages/user/UserEditPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminQuizPage from "./pages/admin/AdminQuizPage";
import AdminQuizCreatePage from "./pages/admin/AdminQuizCreatePage";
import AdminQuizEditPage from "./pages/admin/AdminQuizEditPage";
import AdminQuestionCreatePage from "./pages/admin/AdminQuestionCreatePage";
import AdminQuestionEditPage from "./pages/admin/AdminQuestionEditPage";
import QuizPage from "./pages/quiz/QuizPage";
import PhrasesPage from "./pages/phrases/PhrasesPage";
import PhraseCreatePage from "./pages/phrases/PhraseCreatePage";
import PhraseEditPage from "./pages/phrases/PhraseEditPage";
import QuestionWordsPage from "./pages/questionWords/QuestionWordsPage";
import QuestionWordCreatePage from "./pages/questionWords/QuestionWordCreate";
import QuestionWordEditPage from "./pages/questionWords/QuestionWordEdit";
import NavBar from "./sections/NavBar";
import { useSelector } from "react-redux";
import { authenticatedUser } from "../redux/userSlice";

import "../styles/components/App.css";
import UserText from "./pages/user/UserText";
import UserQuiz from "./pages/user/UserQuiz";
import QuizResultPage from "./pages/quiz/QuizResultPage";

const App = () => {
  const user = useSelector(authenticatedUser);

  return (
    <BrowserRouter>
      <NavBar />
      <div className="container">
        <Routes>
          <Route
            path="/"
            exact
            element={
              user ? (
                user.role === "admin" ? (
                  <AdminUsersPage />
                ) : (
                  <UserQuiz />
                )
              ) : (
                <UserLoginPage />
              )
            }
          />

          <Route path="/page/user/login" exact element={<UserLoginPage />} />
          <Route path="/page/user/create" exact element={<UserCreatePage />} />
          <Route path="/page/user/edit" exact element={<UserEditPage />} />
          <Route path="/page/user" exact element={<UserQuiz />} />

          <Route path="/page/user/text" exact element={<UserText />} />
          <Route path="/page/user/text/:textId" exact element={<UserText />} />

          <Route path="/page/user/quiz" exact element={<UserQuiz />} />
          <Route path="/page/user/quiz/:quizId" exact element={<UserQuiz />} />

          <Route path="/page/admin/login" exact element={<AdminLoginPage />} />
          <Route
            path="/page/admin/quiz/create"
            exact
            element={<AdminQuizCreatePage />}
          />
          <Route
            path="/page/admin/quiz/edit"
            exact
            element={<AdminQuizEditPage />}
          />
          <Route
            path="/page/admin/quiz/view/:quizId"
            exact
            element={<QuizPage />}
          />
          <Route path="/page/admin/quiz/view" exact element={<QuizPage />} />

          <Route
            path="/page/admin/quiz/result/:quizId"
            exact
            element={<QuizResultPage />}
          />
          <Route
            path="/page/admin/quiz/result"
            exact
            element={<QuizResultPage />}
          />

          <Route
            path="/page/admin/question/create"
            exact
            element={<AdminQuestionCreatePage />}
          />
          <Route
            path="/page/admin/question/edit/:questionId"
            exact
            element={<AdminQuestionEditPage />}
          />
          <Route path="/page/admin/quizzes" exact element={<AdminQuizPage />} />
          <Route path="/page/admin/phrases" exact element={<PhrasesPage />} />
          <Route
            path="/page/admin/phrase/create"
            exact
            element={<PhraseCreatePage />}
          />
          <Route
            path="/page/admin/phrase/edit/:phraseId"
            exact
            element={<PhraseEditPage />}
          />
          <Route
            path="/page/admin/question-words"
            exact
            element={<QuestionWordsPage />}
          />
          <Route
            path="/page/admin/question-word/create"
            exact
            element={<QuestionWordCreatePage />}
          />
          <Route
            path="/page/admin/question-word/edit/:wordId"
            exact
            element={<QuestionWordEditPage />}
          />
          <Route path="/page/admin/quizzes" exact element={<AdminQuizPage />} />
          <Route path="/page/admin" exact element={<AdminUsersPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
