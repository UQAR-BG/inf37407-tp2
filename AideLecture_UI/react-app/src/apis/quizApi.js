import djangoApi from "./djangoApi";

export const getQuizzes = async () => {
  return await djangoApi.get("/api/quiz/quiz");
};

export const getQuiz = async (id) => {
  return await djangoApi.get(`/api/quiz/quiz/${id}`);
};

export const postCreateQuiz = async (quiz) => {
  return await djangoApi.post("/api/quiz/quiz", quiz);
};

export const patchQuiz = async (quiz) => {
  return await djangoApi.patch(`/api/quiz/quiz/${quiz.id}`, quiz);
};

export const deleteQuiz = async (id) => {
  await djangoApi.delete(`/api/quiz/quiz/${id}`);
  return { data: { deletedId: id } };
};
