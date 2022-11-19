import djangoApi, { authHeader } from "./djangoApi";

export const login = async (loginData) => {
  return await djangoApi.post("/api/user/login", loginData);
};

export const logout = async () => {
  return await djangoApi.get("/api/user/logout", {
    headers: authHeader(),
  });
};

export const getUsers = async (isActive = true) => {
  return await djangoApi.get(`/api/user/users?is_active=${isActive}`, {
    headers: authHeader(),
  });
};

export const getResults = async () => {
  return await djangoApi.get("/api/result/results", {
    headers: authHeader(),
  });
};

export const postCreateParticipant = async (participant) => {
  return await djangoApi.post("/api/user/register", participant);
};

export const postAddResult = async (result) => {
  return await djangoApi.post("/api/result/post", result, {
    headers: authHeader(),
  });
};

export const patchParticipant = async (id, data) => {
  return await djangoApi.patch(`/api/user/update/${id}`, data, {
    headers: authHeader(),
  });
};

export const deleteUser = async (id) => {
  await djangoApi.delete(`/api/user/delete/${id}`, {
    headers: authHeader(),
  });
  return { data: { deletedId: id } };
};
