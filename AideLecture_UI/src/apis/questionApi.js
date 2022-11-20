import djangoApi, {
  authHeader,
  jsonContentTypeHeader,
  combineHeaders,
} from "./djangoApi";

export const getQuestions = async (isActive = true) => {
  return await djangoApi.get(`/api/question/questions?is_active=${isActive}`, {
    headers: authHeader(),
  });
};

export const getQuestionsFromQuiz = async (quizId, isActive = true) => {
  return await djangoApi.get(
    `/api/question/from-quiz?quizId=${quizId}&is_active=${isActive}`,
    {
      headers: authHeader(),
    }
  );
};

export const getQuestion = async (id) => {
  return await djangoApi.get(`/api/question/question/${id}`, {
    headers: authHeader(),
  });
};

export const postCreateQuestion = async (question) => {
  return await djangoApi.post("/api/question/create", question, {
    headers: combineHeaders([authHeader(), jsonContentTypeHeader()]),
  });
};

export const patchQuestion = async (question) => {
  return await djangoApi.put(`/api/question/put/${question.id}`, question, {
    headers: combineHeaders([authHeader(), jsonContentTypeHeader()]),
  });
};

export const deleteQuestion = async (id) => {
  await djangoApi.delete(`/api/question/delete/${id}`, {
    headers: authHeader(),
  });
  return { data: { deletedId: id } };
};
