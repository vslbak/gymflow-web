export interface User {
  id: string;
  email: string;
  username: string;
  phone: string;
  role: string;
}

export interface GymFlowClass {
  id: string;
  name: string;
  instructor: string;
  duration: string;
  totalSpots: number;
  imageUrl: string;
  category: string;
  level: string;
  location: string;
  description: string;
  price: number;
  time: string;
  whatToBring?: string[];
}

export interface ClassSession {
  id: string;
  gymflowClass: GymFlowClass;
  date: string;
  spotsLeft: number;
}

export interface Booking {
  id: string;
  userId: string;
  classSession: ClassSession;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  bookingDate: string;
  totalPrice: number;
  createdAt: string;
  confirmedAt: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

export interface BookingRequest {
  classSession: string;
  className: string;
  amount: number;
}

export interface BookingResponse {
  url: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
