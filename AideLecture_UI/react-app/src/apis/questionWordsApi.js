import djangoApi, { authHeader } from "./djangoApi";

export const getQuestionWords = async () => {
  return await djangoApi.get("/api/question-word/question_words", {
    headers: authHeader(),
  });
};

export const getQuestionWord = async (id) => {
  return await djangoApi.get(`/api/question-word/question_word/${id}`, {
    headers: authHeader(),
  });
};

export const postCreateQuestionWord = async (questionWord) => {
  return await djangoApi.post("/api/question-word/create", questionWord, {
    headers: authHeader(),
  });
};

export const patchQuestionWord = async (questionWord) => {
  return await djangoApi.put(
    `/api/question-word/put/${questionWord.id}`,
    questionWord,
    {
      headers: authHeader(),
    }
  );
};

export const deleteQuestionWord = async (id) => {
  await djangoApi.delete(`/api/question-word/delete/${id}`, {
    headers: authHeader(),
  });
  return { data: { deletedId: id } };
};
