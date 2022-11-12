import djangoApi from "./djangoApi";

export const getPhrases = async () => {
  return await djangoApi.get("/api/phrase/phrase");
};

export const getPhrasesFromQuiz = async (quizId) => {
  return await djangoApi.get(`/api/phrase/from-quiz?quizId=${quizId}`);
};

export const getPhrase = async (id) => {
  return await djangoApi.get(`/api/phrase/phrase/${id}`);
};

export const postCreatePhrase = async (phrase) => {
  return await djangoApi.post("/api/phrase/phrase", phrase);
};

export const patchPhrase = async (phrase) => {
  return await djangoApi.patch(`/api/phrase/phrase/${phrase.id}`, phrase);
};

export const deletePhrase = async (id) => {
  await djangoApi.delete(`/api/phrase/phrase/${id}`);
  return { data: { deletedId: id } };
};
