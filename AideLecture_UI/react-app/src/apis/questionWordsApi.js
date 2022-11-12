import djangoApi from "./djangoApi";

export const getQuestionWords = async () => {
  return await djangoApi.get("/api/question-word/word");
};

export const getQuestionWord = async (id) => {
  return await djangoApi.get(`/api/question-word/word/${id}`);
};

export const postCreateQuestionWord = async (questionWord) => {
  return await djangoApi.post("/api/question-word/word", questionWord);
};

export const patchQuestionWord = async (questionWord) => {
  return await djangoApi.patch(
    `/api/question-word/word/${questionWord.id}`,
    questionWord
  );
};

export const deleteQuestionWord = async (id) => {
  await djangoApi.delete(`/api/question-word/word/${id}`);
  return { data: { deletedId: id } };
};
