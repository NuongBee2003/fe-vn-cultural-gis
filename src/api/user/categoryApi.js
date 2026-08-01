import { useCallback, useState } from "react";

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

function useAsyncMutation(action) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(
    async (variables, options = {}) => {
      setIsPending(true);
      setError(null);
      try {
        const result = await action(variables);
        options.onSuccess?.(result, variables);
        return result;
      } catch (err) {
        setError(err);
        options.onError?.(err);
        throw err;
      } finally {
        setIsPending(false);
      }
    },
    [action]
  );

  return { mutate, mutateAsync: mutate, isPending, error };
}

export function useCreateCategory() {
  return useAsyncMutation(createCategory);
}

export function useUpdateCategory() {
  return useAsyncMutation(({ id, data }) => updateCategory(id, data));
}

export function useDeleteCategory() {
  return useAsyncMutation(deleteCategory);
}
