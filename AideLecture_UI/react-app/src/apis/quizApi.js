import jsonServerApi from "./jsonServerApi";

export const getQuizzes = async () => {
  return await jsonServerApi.get("/quiz");
};

export const getQuiz = async (id) => {
  return await jsonServerApi.get(`/quiz/${id}`);
};

export const postCreateQuiz = async (quiz) => {
  return await jsonServerApi.post("/quiz", quiz);
};

export const patchQuiz = async (quiz) => {
  return await jsonServerApi.patch(`/quiz/${quiz.id}`, quiz);
};

export const deleteQuiz = async (id) => {
  await jsonServerApi.delete(`/quiz/${id}`);
  return { data: { deletedId: id } };
};
