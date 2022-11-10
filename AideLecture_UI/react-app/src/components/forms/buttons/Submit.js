import React from "react";

/* Tout le crédit de la structure et des classes utilisées dans cette portion de code JSX 
   doit être porté au compte de l'équipe MDBootstrap, pour le template open-source Login Template.
   Repéré à https://mdbootstrap.com/docs/standard/extended/login/*/

const Submit = (props) => {
  return (
    <div className="text-center pt-1 mb-5 pb-1">
      <button
        className={`btn btn-primary btn-block fa-lg ${props.gradient} mb-3 w-100`}
        type="submit"
      >
        {props.label}
      </button>
      {props.children}
    </div>
  );
};

export default Submit;
