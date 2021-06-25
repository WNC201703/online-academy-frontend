import React, {useState} from "react";
import AuthUserContext from "./AuthUserContext";

const UserContext = (props) => {
  let localUser = JSON.parse(localStorage.getItem("user"));
  if (localUser === null) localUser = {};
  const [user, setUser] = useState(localUser);
  const saveUser = (user) => setUser(user);

  return (
    <AuthUserContext.Provider
      value={{
        user,
        saveUser,
      }}>
      {props.children}
    </AuthUserContext.Provider>
  );
};

export default UserContext;