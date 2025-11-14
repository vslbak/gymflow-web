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

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface CreateClassRequest {
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
  whatToBring: string[];
}

export interface UpdateClassRequest extends Partial<CreateClassRequest> {
  id: string;
}

export interface CreateSessionRequest {
  classId: string;
  date: string;
  time: string;
  spotsLeft: number;
}

export interface UpdateSessionRequest {
  id: string;
  date?: string;
  time?: string;
  spotsLeft?: number;
}

export interface GymFlowApiContract {
  getClasses(): Promise<ApiResponse<GymFlowClass[]>>;

  getClassSessions(): Promise<ApiResponse<ClassSession[]>>;

  getClassSessionById(id: string): Promise<ApiResponse<ClassSession>>;

  getSessionsByClassId(classId: string): Promise<ApiResponse<ClassSession[]>>;

  login(request: LoginRequest): Promise<ApiResponse<LoginResponse>>;

  signup(request: SignupRequest): Promise<ApiResponse<LoginResponse>>;

  refreshToken(request: RefreshTokenRequest): Promise<ApiResponse<LoginResponse>>;

  getCurrentUser(token: string): Promise<ApiResponse<User>>;

  createBooking(request: BookingRequest): Promise<ApiResponse<BookingResponse>>;

  getUserBookings(): Promise<ApiResponse<Booking[]>>;

  cancelBooking(bookingId: string): Promise<ApiResponse<void>>;

  createClass(request: CreateClassRequest): Promise<ApiResponse<GymFlowClass>>;

  updateClass(request: UpdateClassRequest): Promise<ApiResponse<GymFlowClass>>;

  deleteClass(classId: string): Promise<ApiResponse<void>>;

  createSession(request: CreateSessionRequest): Promise<ApiResponse<ClassSession>>;

  updateSession(request: UpdateSessionRequest): Promise<ApiResponse<ClassSession>>;

  deleteSession(sessionId: string): Promise<ApiResponse<void>>;
}
