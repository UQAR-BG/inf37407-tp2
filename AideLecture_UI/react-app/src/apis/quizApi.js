import djangoApi, { authHeader } from "./djangoApi";

export const getQuizzes = async () => {
  return await djangoApi.get("/api/quiz/quiz", {
    headers: authHeader(),
  });
};

export const getQuiz = async (id) => {
  return await djangoApi.get(`/api/quiz/quiz/${id}`, {
    headers: authHeader(),
  });
};

export const postCreateQuiz = async (quiz) => {
  return await djangoApi.post("/api/quiz/quiz", quiz, {
    headers: authHeader(),
  });
};

export const patchQuiz = async (quiz) => {
  return await djangoApi.patch(`/api/quiz/quiz/${quiz.id}`, quiz, {
    headers: authHeader(),
  });
};

export const deleteQuiz = async (id) => {
  await djangoApi.delete(`/api/quiz/quiz/${id}`, {
    headers: authHeader(),
  });
  return { data: { deletedId: id } };
};
