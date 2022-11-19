import axios from "axios";

/*
  Serveur temporaire de type JSON-Server qui doit être lancé
  avec la commande npm start dans le projet api de la solution.
*/
export default axios.create({
  baseURL: "http://localhost:3001",
});
