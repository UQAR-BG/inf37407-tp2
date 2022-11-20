import React from "react";
import { DJANGO_API_URL } from "../../apis/djangoApi";
import { shuffleArray } from "../../utils/randomUtils";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import ActionButton from "../forms/buttons/ActionButton";
import Word from "./Word";
import Answer from "./Answer";
import { useEffect, useState } from "react";

const Question = ({ question, next, nextText }) => {
  let audio = new Audio(`${DJANGO_API_URL}${question.questionAudio}`);
  const [answers, setAnswers] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setAnswers(shuffleArray(question.answers));
  }, [question.answers]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "all",
  });

  function onSubmit(data) {
    if (selected !== null) {
      reset();
      next(question.id, selected);
      setSelected(null);
    } else {
      setSelected(data.answer);
    }
  }

  return (
    <>
      <div className="m-0">
        <table className="table table-borderless table-fit my-4 text-center">
          <tbody>
            <tr>
              <td></td>
              {question.words.map((word, index) => (
                <td key={`td-img-${index}`}>
                  {word.image && (
                    <img
                      key={index}
                      width="80px"
                      height="80px"
                      src={`${DJANGO_API_URL}${word.image}`}
                      alt={word.statement}
                    />
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td>
                <ActionButton
                  icon="volume-high"
                  color="primary"
                  onClick={() => audio.play()}
                />
              </td>
              {question.words.map((word, index) => (
                <td key={`td-word-${index}`}>
                  <Word word={word} key={index} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="row">
        <div className="col-1"></div>
        <div className="col-11">
          <Form onSubmit={handleSubmit(onSubmit)}>
            {errors && errors["answer"] && (
              <div className="invalid-feedback">{errors["answer"].message}</div>
            )}
            {answers &&
              answers.map((answer, index) => (
                <Answer
                  key={index}
                  attributes={register("answer", {
                    required: true,
                    disabled: selected !== null,
                  })}
                  answer={answer}
                  className={
                    selected !== null && answer.isRightAnswer
                      ? "text-success opacity-100"
                      : selected === `${answer.id}`
                      ? "text-danger opacity-100"
                      : "opacity-100"
                  }
                />
              ))}
            <Button className="mt-2" type="submit">
              {selected !== null ? nextText : "Envoyer la réponse"}
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Question;
