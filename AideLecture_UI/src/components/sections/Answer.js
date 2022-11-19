import React from "react";
import { DJANGO_API_URL } from "../../apis/djangoApi";
import Form from "react-bootstrap/Form";
import ActionButton from "../forms/buttons/ActionButton";

const Answer = ({ answer, attributes, className }) => {
  let audio = new Audio(`${DJANGO_API_URL}${answer.audio}`);

  return (
    <div className="d-flex align-items-center">
      <ActionButton
        icon="volume-high"
        color="primary"
        onClick={() => audio.play()}
      />
      <Form.Check id={`quiz-radio-${answer.id}`}>
        <Form.Check.Input
          {...attributes}
          type="radio"
          value={answer.id}
          className="m-2"
        ></Form.Check.Input>
        <Form.Check.Label className={className}>
          <span>{answer.statement}</span>
        </Form.Check.Label>
      </Form.Check>
      <img
        width="80px"
        height="80px"
        src={`/ressources/img/${answer.image}`}
        alt={answer.statement}
      />
    </div>
  );
};

export default Answer;
