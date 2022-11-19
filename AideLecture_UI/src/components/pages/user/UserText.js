import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Text from "../../sections/Text";
import TextsList from "../../sections/TextsList";
import UserPage from "./UserPage";
import Button from "react-bootstrap/Button";

import "../../../styles/components/quiz.css";

const UserPhrase = () => {
  const params = useParams();
  const navigate = useNavigate();

  return (
    <UserPage>
      {params.textId ? (
        <>
          <Text id={params.textId} />
          <div className="d-flex flex-row-reverse mt-2">
            <Button
              variant="outline-primary"
              className="w-25"
              onClick={() => navigate(`/page/user/quiz/${params.textId}`)}
            >
              Aller au quiz
            </Button>
          </div>
        </>
      ) : (
        <TextsList />
      )}
    </UserPage>
  );
};

export default UserPhrase;
