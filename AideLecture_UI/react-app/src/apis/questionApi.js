import djangoApi, { authHeader } from "./djangoApi";

export const getQuestions = async () => {
  return await djangoApi.get("/api/question/questions", {
    headers: authHeader(),
  });
};

export const getQuestionsFromQuiz = async (quizId) => {
  return await djangoApi.get(`/api/question/from-quiz?quizId=${quizId}`, {
    headers: authHeader(),
  });
};

export const getQuestion = async (id) => {
  return await djangoApi.get(`/api/question/question/${id}`, {
    headers: authHeader(),
  });
};

export const postCreateQuestion = async (question) => {
  return await djangoApi.post("/api/question/create", question, {
    headers: authHeader(),
  });
};

export const patchQuestion = async (question) => {
  return await djangoApi.put(`/api/question/put/${question.id}`, question, {
    headers: authHeader(),
  });
};

export const deleteQuestion = async (id) => {
  await djangoApi.delete(`/api/question/delete/${id}`, {
    headers: authHeader(),
  });
  return { data: { deletedId: id } };
};
