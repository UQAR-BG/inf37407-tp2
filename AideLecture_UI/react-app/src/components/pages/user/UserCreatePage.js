import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createParticipantValidationSchema } from "../../../validations/user";
import { errorDialogWrapper } from "../../modals/Dialog";
import PublicPage from "../PublicPage";
import ParticipantForm from "../../forms/ParticipantForm";
import Header from "../../forms/layouts/Header";
import { formLogo } from "../../forms/defaults";
import {
  login,
  selectUsers,
  fetchUsers,
  addParticipant,
} from "../../../redux/userSlice";

/* 
  Tout le crédit de la structure et des classes utilisées dans cette portion de code JSX 
  doit être porté au compte de l'équipe MDBootstrap, pour le template open-source Sign up page.
  Repéré à https://mdbootstrap.com/docs/standard/extended/login/
*/

const UserCreatePage = () => {
  const navigate = useNavigate();
  const users = useSelector(selectUsers);
  const dispatch = useDispatch();

  /* Hook useEffect est exécuté lors du premier render du composant. */
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const onSubmit = async (formValues) => {
    if (users.some((user) => user.email === formValues.email)) {
      errorDialogWrapper("Cette adresse courriel est déjà en utilisation.");
    } else {
      dispatch(
        addParticipant({
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          password: formValues.password,
        })
      )
        .unwrap()
        .then((newParticipant) => {
          dispatch(login(newParticipant));
          navigate("/page/user");
        })
        .catch((err) => {
          errorDialogWrapper(err);
        });
    }
  };

  return (
    <PublicPage>
      <div className="col-xl-8">
        <div className="card rounded-3 text-black">
          <div className="row g-0">
            <div className="card-body p-md-5 mx-md-4">
              <Header img={formLogo} title="Créer un compte de participant" />

              <ParticipantForm
                handleSubmit={onSubmit}
                action="Créer"
                validationSchema={createParticipantValidationSchema}
              />
            </div>
          </div>
        </div>
      </div>
    </PublicPage>
  );
};

export default UserCreatePage;
