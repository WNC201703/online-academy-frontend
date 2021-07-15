import React, {useState} from "react";
import AuthUserContext from "./AuthUserContext";
import {LocalKey} from "../../utils/constant";

const UserContext = (props) => {
  let localUser = JSON.parse(localStorage.getItem(LocalKey.UserInfo));
  if (localUser === null) localUser = {};
  const [user, setUser] = useState(localUser);
  const saveUser = (user) => setUser(user);
  const removeUser = () => {
    setUser(null);
    localStorage.setItem(LocalKey.UserInfo, null);
  }

  return (
    <AuthUserContext.Provider
      value={{
        user,
        saveUser,
        removeUser
      }}>
      {props.children}
    </AuthUserContext.Provider>
  );
};

export default UserContext;