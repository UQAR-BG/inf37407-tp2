import djangoApi, { authHeader } from "./djangoApi";

export const getPhrases = async () => {
  return await djangoApi.get("/api/phrase/phrases", {
    headers: authHeader(),
  });
};

export const getPhrasesFromQuiz = async (quizId) => {
  return await djangoApi.get(`/api/phrase/from-quiz?quizId=${quizId}`, {
    headers: authHeader(),
  });
};

export const getPhrase = async (id) => {
  return await djangoApi.get(`/api/phrase/phrase/${id}`, {
    headers: authHeader(),
  });
};

export const postCreatePhrase = async (phrase) => {
  return await djangoApi.post("/api/phrase/create", phrase, {
    headers: authHeader(),
  });
};

export const patchPhrase = async (phrase) => {
  return await djangoApi.put(`/api/phrase/put/${phrase.id}`, phrase, {
    headers: authHeader(),
  });
};

export const deletePhrase = async (id) => {
  await djangoApi.delete(`/api/phrase/delete/${id}`, {
    headers: authHeader(),
  });
  return { data: { deletedId: id } };
};
