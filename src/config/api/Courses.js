import {AXIOS_INSTANCE} from "./apiconfig";

export async function createCourse(data) {
  return await AXIOS_INSTANCE.post(`/api/courses`, data);
}

export async function getAllCourses(pageNumber = 1, pageSize = 10, sortBy = null,
                                    keyword = null, categoryId = null) {
  return await AXIOS_INSTANCE.get(`/api/courses/?page_number=${pageNumber}&page_size=${pageSize}&keyword=${keyword}&category=${categoryId}`);
}

export async function getNewestCourses() {
  return await AXIOS_INSTANCE.get(`/api/courses/newest`);
}

export async function getTopViewedCourses() {
  return await AXIOS_INSTANCE.get(`/api/courses/top_viewed`);
}

export async function getCourseById(id) {
  return await AXIOS_INSTANCE.get(`/api/courses/${id}`);
}

export async function updateCourse(id) {
  return await AXIOS_INSTANCE.put(`/api/courses/${id}`);
}

export async function deleteCourse(id) {
  return await AXIOS_INSTANCE.delete(`/api/courses/${id}`);
}

export async function updateCourseImage(id) {
  return await AXIOS_INSTANCE.post(`/api/courses/${id}/image`);
}