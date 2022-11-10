import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authenticatedUser } from "../../../redux/userSlice";
import AdminSideBar from "../../sections/AdminSideBar";

import "../../../styles/components/pages/pages.css";

const AdminPage = ({ children }) => {
  const navigate = useNavigate();
  const user = useSelector(authenticatedUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [dispatch, user, navigate]);

  return (
    <React.Fragment>
      <AdminSideBar />
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100 admin-section">
          {children}
        </div>
      </div>
    </React.Fragment>
  );
};

export default AdminPage;
