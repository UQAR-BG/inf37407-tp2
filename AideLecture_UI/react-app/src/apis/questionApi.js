import jsonServerApi from "./jsonServerApi";

export const getQuestions = async () => {
  return await jsonServerApi.get("/questions");
};

export const getQuestionsFromQuiz = async (quizId) => {
  return await jsonServerApi.get(`/questions?quizId=${quizId}`);
};

export const getQuestion = async (id) => {
  return await jsonServerApi.get(`/questions/${id}`);
};

export const postCreateQuestion = async (question) => {
  return await jsonServerApi.post("/questions", question);
};

export const patchQuestion = async (question) => {
  return await jsonServerApi.patch(`/questions/${question.id}`, question);
};

export const deleteQuestion = async (id) => {
  await jsonServerApi.delete(`/questions/${id}`);
  return { data: { deletedId: id } };
};
