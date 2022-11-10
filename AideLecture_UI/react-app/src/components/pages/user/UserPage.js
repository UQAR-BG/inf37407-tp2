import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authenticatedUser } from "../../../redux/userSlice";

const UserPage = ({ children }) => {
  const navigate = useNavigate();
  const user = useSelector(authenticatedUser);

  if (!user || user.role !== "participant") {
    navigate("/");
  }

  return (
    <>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100 admin-section">
          {children}
        </div>
      </div>
    </>
  );
};

export default UserPage;
