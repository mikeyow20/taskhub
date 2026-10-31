export const BASE_URL = "http://localhost:8000";

//utils/apiPaths.js
export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register", // Register User (Admin or User)
        LOGIN: "/api/auth/login", // Authenticate user & return JWT token
        GET_PROFILE: "/api/auth/profile", // Get User details
    },

    USERS: {
        GET_ALL_USERS: "/api/users", // Get All Users (Admin Only)
        GET_USER_BY_ID: (userId) => `/api/users/${userId}`, // Get User by ID
        CREATE_USER: "/api/users", // Create User (Admin Only)
        UPDATE_USER: (userId) => `/api/users/${userId}`, // Update User (Admin Only)
        DELETE_USER: (userId) => `/api/users/${userId}`, // Delete User (Admin Only)
    },

    TASKS: {
        GET_DASHBOARD_DATA: "/api/tasks/dashboard-data", // Get Dashboard Data (Admin Only)
        GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data", // Get User Dashboard Data (User Only)
        GET_ALL_TASKS: "/api/tasks", // Get All Tasks (Admin: all, User: assigned)
        GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`, // Get Task by ID
        CREATE_TASK: "/api/tasks", // Create a new task (Admin Only)
        UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`, // Update a task by ID
        DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, // Delete a task (Admin Only)

        UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`, // Update task status
        UPDATE_TASK_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`, // Update task checklist
    },

    REPORTS: {
        EXPORT_TASKS: "/api/reports/export/tasks", // Download all tasks as an Excel file (Admin Only)
        EXPORT_USERS: "/api/reports/export/users", // Download all users tasks as an Excel file (Admin Only)
    },

    IMAGE: {
        UPLOAD_IMAGE: "/api/auth/upload-image", // Upload image
    },
};