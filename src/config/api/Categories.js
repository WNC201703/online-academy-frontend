import {AXIOS_INSTANCE} from "./apiconfig";

export async function createCategory(data) {
  return await AXIOS_INSTANCE.post(`/api/categories`, data);
}

export async function getAllCategories(level) {
  return await AXIOS_INSTANCE.get(`/api/categories?${level}`);
}

export async function getCategoryById(id) {
  return await AXIOS_INSTANCE.get(`/api/categories/${id}`);
}

export async function getCategoryByParentId(parentId) {
  return await AXIOS_INSTANCE.get(`/api/categories?parent=${parentId}`);
}

export async function updateCategory(id,data) {
  console.log(`/api/categories/${id}`,data)
  return await AXIOS_INSTANCE.put(`/api/categories/${id}`,data);
}

export async function deleteCategory(id) {
  return await AXIOS_INSTANCE.delete(`/api/categories/${id}`);
}