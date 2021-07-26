import {AXIOS_INSTANCE, FILEUPLOAD_AXIOS_INSTANCE} from "./apiconfig";
import axios from "axios";
import {getAccessToken} from "../../utils/LocalStorageUtils";

export async function createCourse(data) {
  const imageInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    data: data,
    headers: {"Content-Type": "multipart/form-data"},
  });

  imageInstance.interceptors.request.use((config) => {
    const access_token = getAccessToken();
    config.headers.Authorization = `Bearer ${access_token}`;
    return config;
  });

  return await imageInstance.post(`/api/courses`, data);
}

export async function updateCourseImage(id, data) {
  const imageInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    data: data,
    headers: {"Content-Type": "multipart/form-data"},
  });
  imageInstance.interceptors.request.use((config) => {
    const access_token = getAccessToken();
    config.headers.Authorization = `Bearer ${access_token}`;
    return config;
  });

  return await imageInstance.put(`/api/courses/${id}/image`, data);
}

export async function getAllCourses(pageNumber = 1, pageSize = 10, sortBy = null,
                                    key_word = null, categoryId = null) {
  return await AXIOS_INSTANCE.get(`/api/courses/?page_number=${pageNumber}&page_size=${pageSize}&key_word=${key_word ? key_word : ''}&category=${categoryId ? categoryId : ''}`);
}

export async function getNewestCourses() {
  return await AXIOS_INSTANCE.get(`/api/courses/newest`);
}


export async function getPostedCourse() {
  return await AXIOS_INSTANCE.get(`/api/users/me/posted-courses`);
}

export async function getTopViewedCourses() {
  return await AXIOS_INSTANCE.get(`/api/courses/top_viewed`);
}

export async function getCourseById(id) {
  return await AXIOS_INSTANCE.get(`/api/courses/${id}`);
}

export async function updateCourse(id, data) {
  return await AXIOS_INSTANCE.put(`/api/courses/${id}`, data);
}

export async function deleteCourse(id) {
  return await AXIOS_INSTANCE.delete(`/api/courses/${id}`);
}

export async function reviewCourse(id, data) {
  return await AXIOS_INSTANCE.post(`/api/courses/${id}/reviews`, data);
}

export async function getFavoriteCourses() {
  return await AXIOS_INSTANCE.get(`/api/users/me/favorites`);
}

export async function getEnrollmentsCourse() {
  return await AXIOS_INSTANCE.get(`/api/users/me/enrollments`);
}