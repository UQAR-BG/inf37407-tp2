import djangoApi, {
  authHeader,
  jsonContentTypeHeader,
  multipartFormDataContentTypeHeader,
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

export const postAnswer = async (answer) => {
  const answerFormData = createAnswerFormData(answer);
  return await djangoApi.post("/api/question/add_answer", answerFormData, {
    headers: combineHeaders([
      authHeader(),
      multipartFormDataContentTypeHeader(),
    ]),
  });
};

const createAnswerFormData = (answerModel) => {
  let formData = new FormData();
  if (answerModel.image && answerModel.filename) {
    formData.append("image", answerModel.image, answerModel.filename);
  }
  formData.append("statement", answerModel.statement);
  if (answerModel.isRightAnswer) {
    formData.append("isRightAnswer", answerModel.isRightAnswer);
  } else {
    formData.append("isRightAnswer", false);
  }
  if (answerModel.questionId) {
    formData.append("questionId", answerModel.questionId);
  }
  return formData;
};
