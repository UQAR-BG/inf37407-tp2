import jsonServerApi from "./jsonServerApi";

export const getPhrases = async () => {
  return await jsonServerApi.get("/phrases");
};

export const getPhrasesFromQuiz = async (quizId) => {
  return await jsonServerApi.get(`/phrases?quizId=${quizId}`);
};

export const getPhrase = async (id) => {
  return await jsonServerApi.get(`/phrases/${id}`);
};

export const postCreatePhrase = async (phrase) => {
  return await jsonServerApi.post("/phrases", phrase);
};

export const patchPhrase = async (phrase) => {
  return await jsonServerApi.patch(`/phrases/${phrase.id}`, phrase);
};

export const deletePhrase = async (id) => {
  await jsonServerApi.delete(`/phrases/${id}`);
  return { data: { deletedId: id } };
};
