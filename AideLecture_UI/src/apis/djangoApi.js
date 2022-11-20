import axios from "axios";

export const DJANGO_API_URL = "http://localhost:8000";

export default axios.create({
  baseURL: DJANGO_API_URL,
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

export const jsonContentTypeHeader = () => {
  return { "Content-Type": "application/json" };
};

export const combineHeaders = (headers = []) => {
  let combinedHeaders = {};
  headers.forEach((header) => {
    var headerKey = Object.keys(header);
    combinedHeaders[headerKey] = header[headerKey];
  });

  return combinedHeaders;
};
