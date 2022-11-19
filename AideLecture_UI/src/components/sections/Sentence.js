import React from "react";
import { DJANGO_API_URL } from "../../apis/djangoApi";
import ActionButton from "../forms/buttons/ActionButton";
import Word from "./Word";

const Sentence = ({ sentence }) => {
  let audio = new Audio(`${DJANGO_API_URL}${sentence.audio}`);

  return (
    <div className="m-0 pl-5">
      <table className="table table-borderless table-fit my-4 text-center">
        <tbody>
          <tr>
            <td></td>
            {sentence.words.map((word, index) => (
              <td key={`td-img-${index}`}>
                {word.image && (
                  <img
                    key={index}
                    width="80px"
                    height="80px"
                    src={`/ressources/img/${word.image}`}
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
            {sentence.words.map((word, index) => (
              <td key={`td-word-${index}`}>
                <Word word={word} key={index} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Sentence;
