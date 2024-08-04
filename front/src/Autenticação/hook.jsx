import {useContext} from "react";
import AuthContext from "./contexts";

export default function Contexts() {
  const context = useContext(AuthContext);
  return context;
}