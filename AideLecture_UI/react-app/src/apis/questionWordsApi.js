import jsonServerApi from "./jsonServerApi";

export const getQuestionWords = async () => {
  return await jsonServerApi.get("/question-words");
};

export const getQuestionWord = async (id) => {
  return await jsonServerApi.get(`/question-words/${id}`);
};

export const postCreateQuestionWord = async (questionWord) => {
  return await jsonServerApi.post("/question-words", questionWord);
};

export const patchQuestionWord = async (questionWord) => {
  return await jsonServerApi.patch(
    `/question-words/${questionWord.id}`,
    questionWord
  );
};

export const deleteQuestionWord = async (id) => {
  await jsonServerApi.delete(`/question-words/${id}`);
  return { data: { deletedId: id } };
};
