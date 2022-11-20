import djangoApi, {
  authHeader,
  multipartFormDataContentTypeHeader,
  combineHeaders,
} from "./djangoApi";

export const getWords = async () => {
  return await djangoApi.get("/api/word/words", {
    headers: authHeader(),
  });
};

export const getWord = async (id) => {
  return await djangoApi.get(`/api/word/word/${id}`, {
    headers: authHeader(),
  });
};

export const postWord = async (word) => {
  const wordFormData = createWordFormData(word);
  return await djangoApi.post("/api/word/create", wordFormData, {
    headers: combineHeaders([
      authHeader(),
      multipartFormDataContentTypeHeader(),
    ]),
  });
};

export const putWord = async (word) => {
  const wordFormData = createWordFormData(word);
  return await djangoApi.put(`/api/word/put/${word.id}`, wordFormData, {
    headers: combineHeaders([
      authHeader(),
      multipartFormDataContentTypeHeader(),
    ]),
  });
};

export const deleteWord = async (id) => {
  await djangoApi.delete(`/api/word/delete/${id}`, {
    headers: authHeader(),
  });
  return { data: { deletedId: id } };
};

const createWordFormData = (wordModel) => {
  let formData = new FormData();
  if (wordModel.image && wordModel.filename) {
    formData.append("image", wordModel.image, wordModel.filename);
  }
  formData.append("statement", wordModel.statement);
  if (wordModel.isQuestionWord) {
    formData.append("isQuestionWord", wordModel.isQuestionWord);
  }
  if (wordModel.questionWordId) {
    formData.append("questionWordId", wordModel.questionWordId);
  }
  if (wordModel.phraseId) {
    formData.append("phraseId", wordModel.phraseId);
  }
  if (wordModel.questionId) {
    formData.append("questionId", wordModel.questionId);
  }
  return formData;
};
