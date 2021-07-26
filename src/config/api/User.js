import {AXIOS_INSTANCE} from "./apiconfig";

export async function signUp(data) {
  return await AXIOS_INSTANCE.post(`/api/users`, data);
}

export async function signIn(data) {
  return await AXIOS_INSTANCE.post(`/api/users/login`, data);
}

export async function createTeacher(data) {
  return await AXIOS_INSTANCE.post(`/api/users/teacher`, data);
}

export async function sendVerificationEmail(data) {
  return await AXIOS_INSTANCE.post(`/api/users/email/verify/send`, data);
}

export async function verifyEmail(token) {
  return await AXIOS_INSTANCE.get(`/api/users/email/verify/${token}`);
}


export async function updateUser(id, data) {
  return await AXIOS_INSTANCE.put(`/api/users/${id}`, data);
}

export async function updateMyProfile( data) {
  return await AXIOS_INSTANCE.put(`/api/users/me`, data);
}

export async function getAllUser(role) {
  return await AXIOS_INSTANCE.get(`/api/users?role=${role}`);
}

export async function getUserById(id) {
  return await AXIOS_INSTANCE.get(`/api/users/${id}`);
}

export async function getInfo() {
  return await AXIOS_INSTANCE.get(`/api/users/me`);
}

export async function resetPassword() {
  return await AXIOS_INSTANCE.get(`/api/users/password/reset`);
}

export async function deleteUser(id){
  return await AXIOS_INSTANCE.delete(`/api/users/${id}`);
}

export async function getFavouriteCourse(id) {
  return await AXIOS_INSTANCE.get(`/api/users/${id}/favorites`);
}

export async function addFavouriteCourse(courseId) {
  return await AXIOS_INSTANCE.put(`/api/users/me/favorites/${courseId}`);
}

export async function removeFavouriteCourse(courseId) {
  return await AXIOS_INSTANCE.delete(`/api/users/me/favorites/${courseId}`);

}

export async function getMyCourses() {
  return await AXIOS_INSTANCE.get(`/api/users/me/courses`);
}