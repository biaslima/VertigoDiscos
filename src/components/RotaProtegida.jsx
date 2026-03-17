import { auth } from "../firebase";
import { Navigate } from "react-router-dom";

export default function RotaProtegida({ children }) {
  if (auth.currentUser == null) {
    return <Navigate to="/login" />;
  } else return children;
}
