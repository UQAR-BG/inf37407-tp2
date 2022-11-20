import djangoApi, {
  authHeader,
  jsonContentTypeHeader,
  combineHeaders,
} from "./djangoApi";

export const getQuizzes = async (isActive = true) => {
  return await djangoApi.get(`/api/quiz/quizzes?is_active=${isActive}`, {
    headers: authHeader(),
  });
};

export const getQuiz = async (id) => {
  return await djangoApi.get(`/api/quiz/quiz/${id}`, {
    headers: authHeader(),
  });
};

export const postCreateQuiz = async (quiz) => {
  return await djangoApi.post("/api/quiz/create", quiz, {
    headers: combineHeaders([authHeader(), jsonContentTypeHeader()]),
  });
};

export const patchQuiz = async (quiz) => {
  return await djangoApi.patch(`/api/quiz/patch/${quiz.id}`, quiz, {
    headers: combineHeaders([authHeader(), jsonContentTypeHeader()]),
  });
};

export const deleteQuiz = async (id) => {
  await djangoApi.delete(`/api/quiz/delete/${id}`, {
    headers: authHeader(),
  });
  return { data: { deletedId: id } };
};
