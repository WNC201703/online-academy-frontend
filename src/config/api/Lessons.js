import { AXIOS_INSTANCE } from "./apiconfig";

export async function getAllLessons(courseId) {
  return await AXIOS_INSTANCE.get(`/api/courses/${courseId}/lessons`);
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

export async function completedLesson(courseId, lessonId) {
  return await AXIOS_INSTANCE.post(`/api/users/me/courses/${courseId}/completed-lesson`, { lessonId: lessonId });
}

export async function deleteCompletedLesson(courseId, lessonId) {
  return await AXIOS_INSTANCE.delete(`/api/users/me/courses/${courseId}/completed-lesson`, {data:{ lessonId: lessonId }});
}