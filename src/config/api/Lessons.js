import {AXIOS_INSTANCE} from "./apiconfig";

export async function getAllLessons(courseId) {
  return await AXIOS_INSTANCE.get(`/api/courses/${courseId}/lessons`);
}

export async function getPreviewLessons(courseId) {
  return await AXIOS_INSTANCE.get(`/api/courses/${courseId}/preview`);
}

export async function addLesson(courseId, data) {
  return await AXIOS_INSTANCE.post(`/api/courses/${courseId}/lessons`, data);
}

export async function updateLesson(courseId, data, lessonNumber) {
  return await AXIOS_INSTANCE.post(`/api/courses/${courseId}/lessons/${lessonNumber}`, data);
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
