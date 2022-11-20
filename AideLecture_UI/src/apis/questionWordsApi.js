import djangoApi, {
  authHeader,
  jsonContentTypeHeader,
  combineHeaders,
} from "./djangoApi";

export const getQuestionWords = async (isActive = true) => {
  return await djangoApi.get(
    `/api/question-word/question_words?is_active=${isActive}`,
    {
      headers: authHeader(),
    }
  );
};

export const getQuestionWord = async (id) => {
  return await djangoApi.get(`/api/question-word/question_word/${id}`, {
    headers: authHeader(),
  });
};

export const postCreateQuestionWord = async (questionWord) => {
  return await djangoApi.post("/api/question-word/create", questionWord, {
    headers: combineHeaders([authHeader(), jsonContentTypeHeader()]),
  });
};

export const patchQuestionWord = async (questionWord) => {
  return await djangoApi.put(
    `/api/question-word/put/${questionWord.id}`,
    questionWord,
    {
      headers: combineHeaders([authHeader(), jsonContentTypeHeader()]),
    }
  );
};

export const deleteQuestionWord = async (id) => {
  await djangoApi.delete(`/api/question-word/delete/${id}`, {
    headers: authHeader(),
  });
  return { data: { deletedId: id } };
};
