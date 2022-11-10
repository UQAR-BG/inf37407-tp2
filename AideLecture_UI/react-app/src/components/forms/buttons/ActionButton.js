import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ActionButton = ({ icon, color, onClick }) => {
  return (
    <button className={`btn btn-outline-${color}`} onClick={onClick}>
      <FontAwesomeIcon icon={icon} />
    </button>
  );
};

export default ActionButton;
