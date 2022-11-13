import djangoApi from "./djangoApi";

export const getQuestions = async () => {
  return await djangoApi.get("/api/question/question");
};

export const getQuestionsFromQuiz = async (quizId) => {
  return await djangoApi.get(`/api/question/from-quiz?quizId=${quizId}`);
};

export const getQuestion = async (id) => {
  return await djangoApi.get(`/api/question/question/${id}`);
};

export const postCreateQuestion = async (question) => {
  return await djangoApi.post("/api/question/question", question);
};

export const patchQuestion = async (question) => {
  return await djangoApi.patch(
    `/api/question/question/${question.id}`,
    question
  );
};

export const deleteQuestion = async (id) => {
  await djangoApi.delete(`/api/question/question/${id}`);
  return { data: { deletedId: id } };
};
