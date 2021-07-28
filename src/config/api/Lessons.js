import {AXIOS_INSTANCE} from "./apiconfig";
import axios from "axios";
import {getAccessToken} from "../../utils/LocalStorageUtils";

export async function getAllLessons(courseId) {
  return await AXIOS_INSTANCE.get(`/api/courses/${courseId}/lessons`);
}

export async function getPreviewLessons(courseId) {
  return await AXIOS_INSTANCE.get(`/api/courses/${courseId}/preview`);
}

export async function addLesson(courseId, data) {
  return await AXIOS_INSTANCE.post(`/api/courses/${courseId}/lessons`, data);
}

export async function updateLesson(courseId, data, lessonId) {

  return await AXIOS_INSTANCE.post(`/api/courses/${courseId}/lessons/${lessonId}`, data);
}

export async function updateLessonVideo(courseId, data, lessonId) {
  const videoInstance = axios.create({
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    baseURL: process.env.REACT_APP_API_URL,
    data: data,
    headers: {"Content-Type": "multipart/form-data"},
  });

  videoInstance.interceptors.request.use((config) => {
    const access_token = getAccessToken();
    config.headers.Authorization = `Bearer ${access_token}`;
    return config;
  });
  return await videoInstance.put(`/api/courses/${courseId}/lessons/${lessonId}/video`, data);
}

export async function getLessonByNumber(courseId, data, lessonNumber) {
  return await AXIOS_INSTANCE.get(`/api/courses/${courseId}/lessons/${lessonNumber}`);
}

export async function getRelatedCourse(courseId) {
  return await AXIOS_INSTANCE.get(`/api/courses/${courseId}/related`);
}

export async function enrollCourse(courseId) {
  return await AXIOS_INSTANCE.post(`/api/courses/${courseId}/enrollments`);
}

export async function getCourseReviews(courseId, pageSize, pageNumber) {
  return await AXIOS_INSTANCE.get(`/api/courses/${courseId}/reviews?page_size=${pageSize}&page_number=${pageNumber}`);
}

export async function completedLesson(courseId, lessonId) {
  return await AXIOS_INSTANCE.post(`/api/users/me/courses/${courseId}/completed-lesson`, {lessonId: lessonId});
}

export async function deleteCompletedLesson(courseId, lessonId) {
  return await AXIOS_INSTANCE.delete(`/api/users/me/courses/${courseId}/completed-lesson`, {data: {lessonId: lessonId}});
}
