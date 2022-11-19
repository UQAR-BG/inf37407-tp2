import React from "react";

import "../../styles/components/pages/pages.css";

const PublicPage = ({ children }) => {
  return (
    <section className="h-100 gradient-form">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          {children}
        </div>
      </div>
    </section>
  );
};

export default PublicPage;
