import {AXIOS_INSTANCE} from "./apiconfig";

export async function createCategory(data) {
  return await AXIOS_INSTANCE.post(`/api/categories`, data);
}

export async function getAllCategories() {
  return await AXIOS_INSTANCE.get(`/api/categories`);
}

export async function getCategoryById(id) {
  return await AXIOS_INSTANCE.get(`/api/categories/${id}`);
}

export async function getCategoryByParentId(parentId) {
  return await AXIOS_INSTANCE.get(`/api/categories?parent=${parentId}`);
}

export async function updateCategory(id) {
  return await AXIOS_INSTANCE.get(`/api/categories/${id}`);
}

export async function deleteCategory(id) {
  return await AXIOS_INSTANCE.delete(`/api/categories/${id}`);
}