import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AddButton = ({ label, to }) => {
  return (
    <div className="row">
      <div className="col-xl-3">
        <Link className="btn btn-outline-primary" to={to}>
          {label}
          <FontAwesomeIcon icon="plus-circle" style={{ marginLeft: "5px" }} />
        </Link>
      </div>
    </div>
  );
};

export default AddButton;
