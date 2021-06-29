import {AXIOS_INSTANCE} from "./apiconfig";

export async function signUp(data) {
  return await AXIOS_INSTANCE.post(`/api/users`, data);
}

export async function signIn(data) {
  return await AXIOS_INSTANCE.post(`/api/users/login`, data);
}

export async function sendVerificationEmail(data) {
  return await AXIOS_INSTANCE.post(`/api/users/email/verify/send`, data);
}

export async function updateUser(id, data) {
  return await AXIOS_INSTANCE.put(`/api/users/${id}`, data);
}

export async function getAllUser(id) {
  return await AXIOS_INSTANCE.get(`/api/users`);
}

export async function getUserById(id) {
  return await AXIOS_INSTANCE.get(`/api/users/id`);
}

export async function getInfo() {
  return await AXIOS_INSTANCE.get(`/api/users/me`);
}

export async function resetPassword() {
  return await AXIOS_INSTANCE.get(`/api/users/password/reset`);
}