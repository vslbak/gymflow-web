import { MockGymFlowApi } from './mockData';
import { GymFlowApi } from './api';
import type { GymFlowApiContract } from './base';

const USE_MOCK_API = false;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const api: GymFlowApiContract = USE_MOCK_API
  ? new MockGymFlowApi()
  : new GymFlowApi(API_BASE_URL);

export * from './base';
export * from '../types';
