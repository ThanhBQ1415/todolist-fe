// The base domain for the API server.
// Change this to your production domain when deploying.
const API_DOMAIN = 'http://localhost:8000';

// --- User APIs ---
export const loginApi = () => `${API_DOMAIN}/api/users/login`;
export const registerApi = () => `${API_DOMAIN}/api/users/register`;
export const createUserApi = () => `${API_DOMAIN}/api/users`;
export const getAllUsersApi = () => `${API_DOMAIN}/api/users`;
export const getUserByIdApi = (id: string | number) => `${API_DOMAIN}/api/users/${id}`;
export const updateUserApi = (id: string | number) => `${API_DOMAIN}/api/users/${id}`;
export const deleteUserApi = (id: string | number) => `${API_DOMAIN}/api/users/${id}`;

// --- Project APIs ---
export const getAllProjectsApi = () => `${API_DOMAIN}/api/projects`;
export const getProjectByIdApi = (id: string | number) => `${API_DOMAIN}/api/projects/${id}`;
export const createProjectApi = () => `${API_DOMAIN}/api/projects`;
export const updateProjectApi = (id: string | number) => `${API_DOMAIN}/api/projects/${id}`;
export const deleteProjectApi = (id: string | number) => `${API_DOMAIN}/api/projects/${id}`;

// --- Task APIs ---
export const getAllTasksApi = () => `${API_DOMAIN}/api/tasks`;
export const getTaskByIdApi = (id: string | number) => `${API_DOMAIN}/api/tasks/${id}`;
export const createTaskApi = () => `${API_DOMAIN}/api/tasks`;
export const updateTaskApi = (id: string | number) => `${API_DOMAIN}/api/tasks/${id}`;
export const deleteTaskApi = (id: string | number) => `${API_DOMAIN}/api/tasks/${id}`;
export const getTasksByStatusApi = (statusId: string | number, projectId?: string | number) =>
  projectId
    ? `${API_DOMAIN}/api/tasks/by-status/${statusId}?projectId=${projectId}`
    : `${API_DOMAIN}/api/tasks/by-status/${statusId}`;
export const updateTaskStatusApi = (id: string | number) => `${API_DOMAIN}/api/tasks/${id}/status`;
export const searchTasksByTitleApi = (title: string, projectId?: string | number) => {
  let url = `${API_DOMAIN}/api/tasks?title=${encodeURIComponent(title)}`;
  if (projectId) url += `&projectId=${projectId}`;
  return url;
};

// --- Status APIs ---
export const getAllStatusesApi = () => `${API_DOMAIN}/api/statuses`;

// --- Label APIs ---
export const getAllLabelsApi = () => `${API_DOMAIN}/api/labels`;


// --- Comment APIs ---
export const getAllCommentsApi = () => `${API_DOMAIN}/api/comments`;
export const getCommentByIdApi = (id: string | number) => `${API_DOMAIN}/api/comments/${id}`;
export const createCommentApi = () => `${API_DOMAIN}/api/comments`;
export const updateCommentApi = (id: string | number) => `${API_DOMAIN}/api/comments/${id}`;
export const deleteCommentApi = (id: string | number) => `${API_DOMAIN}/api/comments/${id}`;

