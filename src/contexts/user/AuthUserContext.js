import { createContext } from "react";

const authUserContext = createContext({
  user: null,
  saveUser: () => {},
});

export default authUserContext;