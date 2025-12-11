import axios from 'axios';
import {
  Activity,
  Category,
  Tag,
  CreateActivityDto,
  UpdateActivityDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateTagDto,
  UpdateTagDto,
  EMPTY_ARR
} from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Activity API
export const activityApi = {
  getAll: async (from?: string, to?: string): Promise<Activity[]> => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    const response = await api.get(`/activities?${params.toString()}`);
    return response.data || EMPTY_ARR;
  },
  getById: async (id: number): Promise<Activity> => {
    const response = await api.get(`/activities/${id}`);
    return response.data;
  },
  create: async (activity: CreateActivityDto): Promise<Activity> => {
    const response = await api.post('/activities', activity);
    return response.data;
  },
  update: async (id: number, activity: UpdateActivityDto): Promise<Activity> => {
    const response = await api.put(`/activities/${id}`, activity);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/activities/${id}`);
  },
};

// Category API
export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data || EMPTY_ARR;
  },
  getById: async (id: number): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
  create: async (category: CreateCategoryDto): Promise<Category> => {
    const response = await api.post('/categories', category);
    return response.data;
  },
  update: async (id: number, category: UpdateCategoryDto): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, category);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

// Tag API
export const tagApi = {
  getAll: async (): Promise<Tag[]> => {
    const response = await api.get('/tags');
    return response.data || EMPTY_ARR;
  },
  getById: async (id: number): Promise<Tag> => {
    const response = await api.get(`/tags/${id}`);
    return response.data;
  },
  create: async (tag: CreateTagDto): Promise<Tag> => {
    const response = await api.post('/tags', tag);
    return response.data;
  },
  update: async (id: number, tag: UpdateTagDto): Promise<Tag> => {
    const response = await api.put(`/tags/${id}`, tag);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/tags/${id}`);
  },
};
