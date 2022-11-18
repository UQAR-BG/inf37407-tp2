import djangoApi, { authHeader } from "./djangoApi";

export const getQuizzes = async () => {
  return await djangoApi.get("/api/quiz/quizzes", {
    headers: authHeader(),
  });
};

export const getQuiz = async (id) => {
  return await djangoApi.get(`/api/quiz/quiz/${id}`, {
    headers: authHeader(),
  });
};

export const postCreateQuiz = async (quiz) => {
  return await djangoApi.post("/api/quiz/create", quiz, {
    headers: authHeader(),
  });
};

export const patchQuiz = async (quiz) => {
  return await djangoApi.patch(`/api/quiz/patch/${quiz.id}`, quiz, {
    headers: authHeader(),
  });
};

export const deleteQuiz = async (id) => {
  await djangoApi.delete(`/api/quiz/delete/${id}`, {
    headers: authHeader(),
  });
  return { data: { deletedId: id } };
};
