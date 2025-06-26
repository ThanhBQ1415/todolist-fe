import * as api from './apiSummoner';

// Headers
export function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

//  Headers no Token 
export function getNoAuthHeaders() {
  return {
    'Content-Type': 'application/json'
  };
}

// Helper
async function handleResponse(res: Response) {
  try {
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || res.statusText };
    }
    return { success: true, ...data };
  } catch (err) {
    return { success: false, error: 'Invalid JSON response' };
  }
}

// --- USER ---
export async function loginUser(data: { email: string; password: string }) {
  try {
    const res = await fetch(api.loginApi(), {
      method: 'POST',
      headers: getNoAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await handleResponse(res);
    
    if (result.success && result.data && result.data.token) {
      // Lưu token và thông tin user vào localStorage
      localStorage.setItem('token', result.data.token);
      if (result.data.user) {
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }
      return {
        success: true,
        message: 'Đăng nhập thành công!',
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.error || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.',
        error: result.error
      };
    }
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      success: false,
      message: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.',
      error: error.message || 'Network error'
    };
  }
}

export async function registerUser(data: { email: string; password: string; name: string }) {
  try {
    const res = await fetch(api.registerApi(), {
      method: 'POST',
      headers: getNoAuthHeaders(),
      body: JSON.stringify(data)
    });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}

export async function getAllUsers() {
  try {
    const res = await fetch(api.getAllUsersApi(), { headers: getHeaders() });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}

export async function getUserById(id: string | number) {
  try {
    const res = await fetch(api.getUserByIdApi(id), { headers: getHeaders() });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}

export async function createUser(data: any) {
  try {
    const res = await fetch(api.createUserApi(), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}

export async function updateUser(id: string | number, data: any) {
  try {
    const res = await fetch(api.updateUserApi(id), {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}

export async function deleteUser(id: string | number) {
  try {
    const res = await fetch(api.deleteUserApi(id), {
      method: 'DELETE',
      headers: getHeaders()
    });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}

// --- PROJECT ---
export async function getAllProjects() {
  try {
    const res = await fetch(api.getAllProjectsApi(), { headers: getHeaders() });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}
export async function getProjectById(id: string | number) {
  try {
    const res = await fetch(api.getProjectByIdApi(id), { headers: getHeaders() });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}
export async function createProject(data: any) {
  try {
    const res = await fetch(api.createProjectApi(), {
      method: 'POST', headers: getHeaders(), body: JSON.stringify(data)
    });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}
export async function updateProject(id: string | number, data: any) {
  try {
    const res = await fetch(api.updateProjectApi(id), {
      method: 'PUT', headers: getHeaders(), body: JSON.stringify(data)
    });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}
export async function deleteProject(id: string | number) {
  try {
    const res = await fetch(api.deleteProjectApi(id), {
      method: 'DELETE', headers: getHeaders()
    });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}

// --- TASK ---
export async function getAllTasks() {
  try {
    const res = await fetch(api.getAllTasksApi(), { headers: getHeaders() });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}
export async function getTasksByStatus(statusId: string | number, projectId?: string | number) {
  try {
    const res = await fetch(api.getTasksByStatusApi(statusId, projectId), { headers: getHeaders() });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}
export async function getTaskById(id: string | number) {
  try {
    const res = await fetch(api.getTaskByIdApi(id), { headers: getHeaders() });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}
export async function createTask(data: any) {
  try {
    const res = await fetch(api.createTaskApi(), {
      method: 'POST', headers: getHeaders(), body: JSON.stringify(data)
    });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}
export async function updateTask(id: string | number, data: any) {
  try {
    const res = await fetch(api.updateTaskApi(id), {
      method: 'PUT', headers: getHeaders(), body: JSON.stringify(data)
    });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}
export async function deleteTask(id: string | number) {
  try {
    const res = await fetch(api.deleteTaskApi(id), {
      method: 'DELETE', headers: getHeaders()
    });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}

// Cập nhật statusId của task
export async function updateTaskStatusPatch(taskId: string | number, statusId: string | number) {
  try {
    const res = await fetch(api.updateTaskStatusApi(taskId), {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ statusId })
    });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}

// --- STATUS ---
export async function getAllStatuses() {
  try {
    const res = await fetch(api.getAllStatusesApi(), { headers: getHeaders() });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}


// --- LABEL ---
export async function getAllLabels() {
  try {
    const res = await fetch(api.getAllLabelsApi(), { headers: getHeaders() });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}

// --- COMMENT ---
export async function getAllComments() {
  try {
    const res = await fetch(api.getAllCommentsApi(), { headers: getHeaders() });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}
export async function getCommentById(id: string | number) {
  try {
    const res = await fetch(api.getCommentByIdApi(id), { headers: getHeaders() });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}
export async function createComment(data: any) {
  try {
    const res = await fetch(api.createCommentApi(), {
      method: 'POST', headers: getHeaders(), body: JSON.stringify(data)
    });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}
export async function updateComment(id: string | number, data: any) {
  try {
    const res = await fetch(api.updateCommentApi(id), {
      method: 'PUT', headers: getHeaders(), body: JSON.stringify(data)
    });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}
export async function deleteComment(id: string | number) {
  try {
    const res = await fetch(api.deleteCommentApi(id), {
      method: 'DELETE', headers: getHeaders()
    });
    return await handleResponse(res);
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}

export async function searchTasksByTitle(title, projectId) {
  let url = api.getAllTasksApi() + `?title=${encodeURIComponent(title)}`;
  if (projectId) url += `&projectId=${projectId}`;
  const res = await fetch(url, { headers: getHeaders() });
  return await handleResponse(res);
}

