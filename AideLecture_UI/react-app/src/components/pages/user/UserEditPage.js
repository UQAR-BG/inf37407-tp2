import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { editParticipantValidationSchema } from "../../../validations/user";
import { errorDialogWrapper } from "../../modals/Dialog";
import PublicPage from "../PublicPage";
import AdminPage from "../admin/AdminPage";
import ParticipantForm from "../../forms/ParticipantForm";
import Header from "../../forms/layouts/Header";
import { formLogo } from "../../forms/defaults";
import {
  logoutAction,
  focusUserForUpdate,
  authenticatedUser,
  selectedUser,
  editParticipant,
  deleteParticipant,
} from "../../../redux/userSlice";
import { confirmWrapper } from "../../modals/ConfirmDialog";

/* Tout le crédit de la structure et des classes utilisées dans cette portion de code JSX 
   doit être porté au compte de l'équipe MDBootstrap, pour le template open-source Sign up page.
   Repéré à https://mdbootstrap.com/docs/standard/extended/login/*/

const UserEditPage = () => {
  const navigate = useNavigate();
  const authUser = useSelector(authenticatedUser);
  var focusedUser = useSelector(selectedUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!focusedUser || authUser.id === focusedUser.id) {
      dispatch(focusUserForUpdate(authUser));
    }
  }, [dispatch]);

  const renderContent = () => (
    <div className="col-xl-8">
      <div className="card rounded-3 text-black">
        <div className="row g-0">
          <div className="card-body p-md-5 mx-md-4">
            <Header img={formLogo} title="Modifier un compte de participant" />

            <ParticipantForm
              handleSubmit={onSubmit}
              action="Modifier"
              user={focusedUser}
              validationSchema={editParticipantValidationSchema}
            >
              {focusedUser?.role === "participant" ? (
                <a
                  href="/"
                  className="link-danger"
                  onClick={async (e) => await onDeleteClick(e)}
                >
                  Supprimer le compte
                  <FontAwesomeIcon icon="trash-can" />
                </a>
              ) : null}
            </ParticipantForm>
          </div>
        </div>
      </div>
    </div>
  );

  const onSubmit = (formValues) => {
    let nbOfModifiedFields = 0;
    const modifiedFields = {
      first_name: "",
      last_name: "",
      updated_password: "",
    };

    if (focusedUser.firstName !== formValues.firstName) {
      modifiedFields["first_name"] = formValues.firstName;
      nbOfModifiedFields++;
    }

    if (focusedUser.lastName !== formValues.lastName) {
      modifiedFields["last_name"] = formValues.lastName;
      nbOfModifiedFields++;
    }

    if (formValues.password) {
      modifiedFields["updated_password"] = formValues.password;
      nbOfModifiedFields++;
    }

    if (nbOfModifiedFields > 0) {
      dispatch(editParticipant({ id: focusedUser.id, data: modifiedFields }))
        .unwrap()
        .then(() => {
          if (authUser.id === focusedUser.id) {
            dispatch(logoutAction());
            navigate("/page/user");
          } else {
            navigate("/page/admin");
          }
        })
        .catch((err) => {
          errorDialogWrapper(err.message);
        });
    }
  };

  const onDeleteClick = async (e) => {
    e.preventDefault();
    if (
      focusedUser.role === "participant" &&
      (await confirmWrapper(
        "Souhaitez-vous vraiment supprimer ce participant ?"
      ))
    ) {
      dispatch(deleteParticipant(focusedUser));
      if (authUser.id === focusedUser.id) {
        dispatch(logoutAction());
        navigate("/");
      } else {
        navigate("/page/admin");
      }
    }
  };

  return (
    <React.Fragment>
      {authUser.role === "admin" ? (
        <AdminPage>{renderContent()}</AdminPage>
      ) : (
        <PublicPage>{renderContent()}</PublicPage>
      )}
    </React.Fragment>
  );
};

export default UserEditPage;
