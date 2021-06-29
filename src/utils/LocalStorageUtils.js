import {LocalKey} from "./constant";

export const getAccessToken = () => {
  const AuthToken = localStorage.getItem(LocalKey.AuthToken);
  if (AuthToken) {
    return JSON.parse(AuthToken).accessToken.value;
  }
  return null;
}

export const saveAccessToken = (authToken) => {
  localStorage.setItem(LocalKey.AuthToken, authToken);
}