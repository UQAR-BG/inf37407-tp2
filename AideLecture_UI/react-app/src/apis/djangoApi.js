import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8000",
});

/*
 * Tout le crédit de cette fonction doit être porté au compte de bezkoder.
 * Source: https://www.bezkoder.com/react-redux-jwt-auth/
 * Date: 03/12/2021
 */

export const authHeader = () => {
  const user = JSON.parse(localStorage.getItem("authenticatedUser"));

  if (user && user.token) {
    return { Authorization: user.token };
  } else {
    return {};
  }
};
