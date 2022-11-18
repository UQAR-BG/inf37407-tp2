import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminPage from "./AdminPage";
import ActionButton from "../../forms/buttons/ActionButton";
import {
  selectUsers,
  focusUserForUpdate,
  fetchUsers,
  deleteParticipant,
} from "../../../redux/userSlice";
import { confirmWrapper } from "../../modals/ConfirmDialog";

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const users = useSelector(selectUsers);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const focusUser = (user) => {
    dispatch(focusUserForUpdate(user));
    navigate("/page/user/edit");
  };

  const handleDeleteUser = async (user) => {
    if (
      await confirmWrapper("Souhaitez-vous vraiment supprimer ce participant ?")
    ) {
      dispatch(deleteParticipant(user));
    }
  };

  return (
    <AdminPage>
      <h3>Liste des participants</h3>

      {users ? (
        <div className="table-responsive">
          <table className="table my-4">
            <colgroup>
              <col className="col-md-1" />
              <col className="col-md-2" />
              <col className="col-md-2" />
              <col className="col-md-3" />
              <col className="col-md-2" />
              <col className="col-md-1" />
              <col className="col-md-1" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Prénom</th>
                <th scope="col">Nom</th>
                <th scope="col">Courriel</th>
                <th scope="col">Rôle</th>
                <th scope="col">Modifier</th>
                <th scope="col">Supprimer</th>
              </tr>
            </thead>
            <tbody>
              {users
                ? users.map((user, index) => {
                    return (
                      <tr key={++index}>
                        <th scope="row">{++index}</th>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <ActionButton
                            icon="plus"
                            color="success"
                            onClick={() => focusUser(user)}
                          />
                        </td>
                        <td>
                          {user && user.role === "participant" ? (
                            <ActionButton
                              icon="trash-can"
                              color="danger"
                              onClick={async () => await handleDeleteUser(user)}
                            />
                          ) : null}
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Chargement des données en cours...</p>
      )}
    </AdminPage>
  );
};

export default AdminUsersPage;
