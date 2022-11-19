import React from "react";
import { Link } from "react-router-dom";

/* Tout le crédit de la structure et des classes utilisées dans cette portion de code JSX 
   doit être porté au compte de l'équipe MDBootstrap, pour le template open-source Login Template.
   Repéré à https://mdbootstrap.com/docs/standard/extended/login/*/

const Return = ({ message, color, path, btnLabel }) => {
  return (
    <div className="d-flex align-items-center justify-content-center pb-4">
      <p className="mb-0 me-2">{message}</p>
      <Link className={`btn btn-outline-${color}`} to={path}>
        {btnLabel}
      </Link>
    </div>
  );
};

export default Return;
