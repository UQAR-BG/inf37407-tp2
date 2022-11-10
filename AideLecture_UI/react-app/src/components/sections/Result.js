import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, selectUsers } from "../../redux/userSlice";
import {
  fetchQuestionsFromQuiz,
  selectQuestions,
} from "../../redux/questionSlice";
import { useEffect, useRef } from "react";
import { fetchQuiz, selectQuiz } from "../../redux/quizSlice";
import PieChart from "./PieChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Accordion from "react-bootstrap/Accordion";

const Result = ({ quizId }) => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const quiz = useSelector(selectQuiz);
  const questions = useSelector(selectQuestions);
  let filteredUsers = useRef(null);

  useEffect(() => {
    dispatch(fetchQuiz(quizId));
    dispatch(fetchQuestionsFromQuiz(quizId));
  }, [dispatch, quizId]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    filteredUsers.current = users.filter(
      (x) =>
        Object.keys(x).includes("quizzesAnswers") &&
        Object.keys(x.quizzesAnswers).includes(quizId)
    );
  }, [users, quizId]);

  if (quiz && questions && filteredUsers.current) {
    const percent = filteredUsers.current.reduce(
      (total, user) =>
        total +
        user.quizzesAnswers[quizId].reduce(
          (score, answer) => score + answer.score / questions.length,
          0
        ) /
          user.quizzesAnswers[quizId].length,
      0
    );

    return (
      <>
        <h2>{quiz.name}</h2>
        <div className="d-flex align-items-center mb-4">
          <p className="me-4">
            Ce quiz a obtenu <b>{+(percent * 100).toFixed(2)}%</b> de réussite.
          </p>
          <PieChart total={1} value={percent} />
        </div>
        <Accordion flush defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Résultats par question:</Accordion.Header>
            <Accordion.Body>
              {questions.map((question, index) => {
                const percent = filteredUsers.current.reduce(
                  (total, user) =>
                    total +
                    user.quizzesAnswers[quizId].reduce(
                      (scores, aptempt) =>
                        scores +
                        (aptempt.choices[question.id] === question.rightAnswerId
                          ? 1
                          : 0),
                      0
                    ),
                  0
                );
                const total = filteredUsers.current.reduce(
                  (total, user) => total + user.quizzesAnswers[quizId].length,
                  0
                );
                return (
                  <div key={index}>
                    <div className="d-flex align-items-center">
                      <p className="me-4">
                        <b>Question #{index + 1}:</b> {question.statement}
                      </p>
                      <PieChart value={percent} total={total} />
                    </div>
                    <div className="table-responsive">
                      <table className="table my-4">
                        <colgroup>
                          <col className="col-md-3" />
                          <col className="col-md-6" />
                          <col className="col-md-2" />
                        </colgroup>
                        <thead>
                          <tr>
                            <th scope="col">Participant</th>
                            <th scope="col">Réponse</th>
                            <th scope="col">Date et heure de l'essai</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.current.map((user) => {
                            return user.quizzesAnswers[quizId].map(
                              (aptempt, index) => {
                                return (
                                  <tr key={index}>
                                    <th>
                                      {user.firstName} {user.lastName}
                                    </th>
                                    <td>
                                      {
                                        question.answers.find(
                                          (x) =>
                                            x.id ===
                                            parseInt(
                                              aptempt.choices[question.id]
                                            )
                                        )?.statement
                                      }
                                      {aptempt.choices[question.id] ===
                                      question.rightAnswerId ? (
                                        <FontAwesomeIcon
                                          icon="check"
                                          className="ms-2 text-success"
                                        />
                                      ) : (
                                        <FontAwesomeIcon
                                          icon="x"
                                          className="ms-2 text-danger"
                                        />
                                      )}
                                    </td>
                                    <td>
                                      {new Date(
                                        aptempt.datetime
                                      ).toLocaleString("fr")}
                                    </td>
                                  </tr>
                                );
                              }
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              Résultats par éssai de participant:
            </Accordion.Header>
            <Accordion.Body>
              {filteredUsers.current.map((user) =>
                user.quizzesAnswers[quizId].map((aptempt, index) => {
                  const datetime = new Date(aptempt.datetime);
                  return (
                    <div key={index}>
                      <div className="d-flex align-items-center">
                        <p className="me-4">
                          Essai #{index + 1} de{" "}
                          <b>
                            {user.firstName} {user.lastName}
                          </b>{" "}
                          <i>
                            le {datetime.toLocaleDateString("fr")} à{" "}
                            {datetime.toLocaleTimeString("fr")}
                          </i>
                        </p>
                        <PieChart
                          value={aptempt.score}
                          total={questions.length}
                        />
                      </div>
                      <div className="table-responsive">
                        <table className="table my-4">
                          <colgroup>
                            <col className="col-md-1" />
                            <col className="col-md-5" />
                            <col className="col-md-6" />
                            <col className="col-md-1" />
                          </colgroup>
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Question</th>
                              <th scope="col">Réponse</th>
                              <th scope="col">Résultat</th>
                            </tr>
                          </thead>
                          <tbody>
                            {questions.map((question, index) => (
                              <tr key={index}>
                                <th>{index + 1}</th>
                                <th>{question.statement}</th>
                                <td>
                                  {
                                    question.answers.find(
                                      (x) =>
                                        x.id ===
                                        parseInt(aptempt.choices[question.id])
                                    )?.statement
                                  }
                                </td>
                                <td>
                                  {aptempt.choices[question.id] ===
                                  question.rightAnswerId ? (
                                    <FontAwesomeIcon
                                      icon="check"
                                      className="ms-2 text-success"
                                    />
                                  ) : (
                                    <FontAwesomeIcon
                                      icon="x"
                                      className="ms-2 text-danger"
                                    />
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </>
    );
  }

  return <p>Chargement des données en cours...</p>;
};

export default Result;
