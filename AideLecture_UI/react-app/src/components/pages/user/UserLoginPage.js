import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import PublicPage from "../PublicPage";
import LoginForm from "../../forms/LoginForm";
import Header from "../../forms/layouts/Header";
import SideBar from "../../forms/layouts/SideBar";
import { errorDialogWrapper } from "../../modals/Dialog";
import { formLogo } from "../../forms/defaults";
import { postLogin } from "../../../redux/userSlice";

/* Tout le crédit de la structure et des classes utilisées dans cette portion de code JSX 
   doit être porté au compte de l'équipe MDBootstrap, pour le template open-source Login Template.
   Repéré à https://mdbootstrap.com/docs/standard/extended/login/*/

const UserLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (formValues) => {
    const loginData = {
      username: formValues.email,
      password: formValues.password,
    };

    dispatch(postLogin(loginData))
      .unwrap()
      .then(() => {
        navigate("/page/user");
      })
      .catch(() => {
        errorDialogWrapper("Informations de connexion invalides.");
      });
  };

  return (
    <PublicPage>
      <div className="col-xl-10">
        <div className="card rounded-3 text-black">
          <div className="row g-0">
            <div className="col-lg-6">
              <div className="card-body p-md-5 mx-md-4">
                <Header
                  img={formLogo}
                  title="Se connecter en tant que participant"
                />

                <LoginForm
                  handleSubmit={onSubmit}
                  role="User"
                  submit={{
                    role: "user",
                    to: "/page/admin/login",
                    message: "Se connecter en tant qu'administrateur",
                  }}
                />
              </div>
            </div>

            <SideBar
              gradient="gradient-user"
              title="Application pour l'aide à l'apprentissage de la lecture"
              description="Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat."
            />
          </div>
        </div>
      </div>
    </PublicPage>
  );
};

export default UserLoginPage;
