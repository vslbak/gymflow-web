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

export interface GymFlowApiContract {
  getClasses(): Promise<ApiResponse<GymFlowClass[]>>;

  getClassSessions(): Promise<ApiResponse<ClassSession[]>>;

  getClassSessionById(id: string): Promise<ApiResponse<ClassSession>>;

  getSessionsByClassId(classId: string): Promise<ApiResponse<ClassSession[]>>;

  login(request: LoginRequest): Promise<ApiResponse<LoginResponse>>;

  signup(request: SignupRequest): Promise<ApiResponse<LoginResponse>>;

  getCurrentUser(token: string): Promise<ApiResponse<User>>;

  createBooking(request: BookingRequest): Promise<ApiResponse<BookingResponse>>;

  getUserBookings(): Promise<ApiResponse<Booking[]>>;

  cancelBooking(bookingId: string): Promise<ApiResponse<void>>;
}
