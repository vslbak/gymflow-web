import type { GymFlowApiContract, RefreshTokenRequest, CreateClassRequest, UpdateClassRequest } from './base';
import type {
  GymFlowClass,
  ClassSession,
  User,
  Booking,
  LoginRequest,
  SignupRequest,
  LoginResponse,
  BookingRequest,
  BookingResponse,
  ApiResponse,
} from '../types';

export class GymFlowApi implements GymFlowApiContract {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const token = this.getAuthToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options?.headers,
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP error: ${response.status} ${response.statusText}`,
        };
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : undefined;
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getClasses(): Promise<ApiResponse<GymFlowClass[]>> {
    const result = await this.request<any[]>('/classes');
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.map(cls => ({
          ...cls,
          daysOfWeek: cls.days || [],
          whatToBring: cls.what_to_bring || cls.whatToBring || [],
        })),
      };
    }
    return result as ApiResponse<GymFlowClass[]>;
  }

  async getClassSessions(): Promise<ApiResponse<ClassSession[]>> {
    return this.request<ClassSession[]>('/sessions');
  }

  async getClassSessionById(id: string): Promise<ApiResponse<ClassSession>> {
    return this.request<ClassSession>(`/sessions/${id}`);
  }

  async getSessionsByClassId(classId: string): Promise<ApiResponse<ClassSession[]>> {
    return this.request<ClassSession[]>(`/classes/${classId}/sessions`);
  }

  async login(request: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async signup(request: SignupRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async refreshToken(request: RefreshTokenRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getCurrentUser(token: string): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async createBooking(request: BookingRequest): Promise<ApiResponse<BookingResponse>> {
    return this.request<BookingResponse>('/booking/create-session', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getUserBookings(): Promise<ApiResponse<Booking[]>> {
    return this.request<Booking[]>('/booking/user/bookings');
  }

  async cancelBooking(bookingId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/booking/${bookingId}`, {
      method: 'DELETE',
    });
  }

  async createClass(request: CreateClassRequest): Promise<ApiResponse<GymFlowClass>> {
    const backendRequest = {
      ...request,
      days: request.daysOfWeek,
    };
    delete (backendRequest as any).daysOfWeek;

    const result = await this.request<any>('/classes', {
      method: 'POST',
      body: JSON.stringify(backendRequest),
    });

    if (result.success && result.data) {
      return {
        success: true,
        data: {
          ...result.data,
          daysOfWeek: result.data.days || [],
          whatToBring: result.data.what_to_bring || result.data.whatToBring || [],
        },
      };
    }
    return result as ApiResponse<GymFlowClass>;
  }

  async updateClass(request: UpdateClassRequest): Promise<ApiResponse<GymFlowClass>> {
    const backendRequest = {
      ...request,
      days: request.daysOfWeek,
    };
    delete (backendRequest as any).daysOfWeek;

    const result = await this.request<any>(`/classes/${request.id}`, {
      method: 'PUT',
      body: JSON.stringify(backendRequest),
    });

    if (result.success && result.data) {
      return {
        success: true,
        data: {
          ...result.data,
          daysOfWeek: result.data.days || [],
          whatToBring: result.data.what_to_bring || result.data.whatToBring || [],
        },
      };
    }
    return result as ApiResponse<GymFlowClass>;
  }

  async deleteClass(classId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/classes/${classId}`, {
      method: 'DELETE',
    });
  }
}
