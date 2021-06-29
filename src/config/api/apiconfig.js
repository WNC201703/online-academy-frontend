import axios from "axios";
import {getAccessToken} from "../../utils/LocalStorageUtils";

const {CLIENT_ENV = "dev"} = process.env;

const envInfo = {
  dev: {
    BASE_URL: "http://localhost:3001",
  },
};

export const AXIOS_INSTANCE = axios.create({
  baseURL: envInfo[CLIENT_ENV].BASE_URL,
  mode: 'cors',
  cache: 'no-cache',
  credentials: 'same-origin',
  redirect: 'follow',
  referrer: 'no-referrer',
  headers: {
    'Content-Type': 'application/json'
  }
});

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const access_token = getAccessToken();
  config.headers.Authorization = `Bearer ${access_token}`;
  return config;
});

AXIOS_INSTANCE.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  return error.response.data;
});

export const FILEUPLOAD_AXIOS_INSTANCE = axios.create({
  baseURL: envInfo[CLIENT_ENV].BASE_URL,
  headers: {"Content-Type": "multipart/form-data"}
})

export const {BASE_URL} = envInfo[CLIENT_ENV];

export const BASE_URL_LOGIN = envInfo.login;
