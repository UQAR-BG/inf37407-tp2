import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* Tout le crédit de la structure et des classes utilisées dans cette portion de code JSX 
   doit être porté au compte de l'équipe MDBootstrap, pour le template open-source Side Navbar, Basic Example
   Repéré à https://mdbootstrap.com/docs/standard/extended/side-navbar/ */

const AdminSideBar = () => {
  return (
    <nav
      id="sidebarMenu"
      className="collapse d-lg-block sidebar collapse bg-white"
    >
      <div className="position-sticky">
        <div className="list-group list-group-flush mt-4">
          <Link
            to="/page/admin"
            className="list-group-item list-group-item-action py-3 ripple"
            aria-current="true"
          >
            <FontAwesomeIcon icon="users" className="fa-fw me-3" />
            <span>Participants</span>
          </Link>
          <Link
            to="/page/admin/quizzes"
            className="list-group-item list-group-item-action py-3 ripple"
          >
            <FontAwesomeIcon
              icon="file-circle-question"
              className="fa-fw me-3"
            />
            <span>Quiz</span>
          </Link>
          <Link
            to="/page/admin/phrases"
            className="list-group-item list-group-item-action py-3 ripple"
          >
            <FontAwesomeIcon icon="file-lines" className="fa-fw me-3" />
            <span>Textes</span>
          </Link>
          <Link
            to="/page/admin/quiz/view"
            className="list-group-item list-group-item-action py-3 ripple"
          >
            <FontAwesomeIcon icon="question" className="fa-fw me-3" />
            <span>Questions</span>
          </Link>
          <Link
            to="/page/admin/question-words"
            className="list-group-item list-group-item-action py-3 ripple"
          >
            <FontAwesomeIcon
              icon="person-circle-question"
              className="fa-fw me-3"
            />
            <span>Mots de question</span>
          </Link>
          <Link
            to="/page/admin/quiz/result"
            className="list-group-item list-group-item-action py-3 ripple"
          >
            <FontAwesomeIcon icon="chart-pie" className="fa-fw me-3" />
            <span>Résultats de quiz</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AdminSideBar;
