import React from "react";

/* Tout le crédit de la structure et des classes utilisées dans cette portion de code JSX 
   doit être porté au compte de l'équipe MDBootstrap, pour le template open-source Login Template.
   Repéré à https://mdbootstrap.com/docs/standard/extended/login/*/

const SideBar = ({ gradient, title, description }) => {
  return (
    <div className={`col-lg-6 d-flex align-items-center ${gradient}`}>
      <div className="text-white px-3 py-4 p-md-5 mx-md-4">
        <h4 className="mb-4">{title}</h4>
        <p className="small mb-0">{description}</p>
      </div>
    </div>
  );
};

export default SideBar;
