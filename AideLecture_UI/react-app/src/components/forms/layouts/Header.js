import React from "react";

/*
  Exemple de déstructuration de l'objet (tableau associatif) props reçu en paramètre.
  Il est possible d'extraire les attributs (les clés) qui nous intéressent.
*/
const Header = ({ img, title }) => {
  return (
    <div className="text-center">
      <img src={img.src} width={img.width} alt={img.alt} />
      <h4 className="mt-1 mb-5 pb-1">{title}</h4>
    </div>
  );
};

export default Header;
