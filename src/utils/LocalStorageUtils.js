import {LocalKey} from "./constant";

export const getAccessToken = () => {
  const AuthToken = localStorage.getItem(LocalKey.AuthToken);
  console.log(AuthToken);
  if (AuthToken) {
    return AuthToken;
    // return JSON.parse(AuthToken).accessToken.value;
  }
  return null;
}

export const saveAccessToken = (authToken) => {
  localStorage.setItem(LocalKey.AuthToken, authToken);
}