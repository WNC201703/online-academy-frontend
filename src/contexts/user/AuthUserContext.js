import { createContext } from "react";

const authUserContext = createContext({
  user: null,
  saveUser: () => {},
  removeUser: () => {}
});

export default authUserContext;