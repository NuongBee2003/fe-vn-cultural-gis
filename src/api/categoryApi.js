import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

// ===== API Calls =====
export const getCategories = async () => {
  const response = await fetch(`${API_URL}/category`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
};

export const createCategory = async (data) => {
  const token = localStorage.getItem("adminToken");
  const response = await fetch(`${API_URL}/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create category");
  }
  return response.json();
};

export const updateCategory = async (id, data) => {
  const token = localStorage.getItem("adminToken");
  const response = await fetch(`${API_URL}/category/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update category");
  }
  return response.json();
};

export const deleteCategory = async (id) => {
  const token = localStorage.getItem("adminToken");
  const response = await fetch(`${API_URL}/category/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete category");
  }
  return response.json();
};

// ===== React Query Hooks =====

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
