import jsonServerApi from "./jsonServerApi";

export const getUsers = async () => {
  return await jsonServerApi.get("/users");
};

export const postCreateParticipant = async (participant) => {
  return await jsonServerApi.post("/users", {
    ...participant,
    role: "participant",
  });
};

export const patchParticipant = async (participant) => {
  return await jsonServerApi.patch(`/users/${participant.id}`, participant);
};

export const deleteUser = async (id) => {
  await jsonServerApi.delete(`/users/${id}`);
  return { data: { deletedId: id } };
};
