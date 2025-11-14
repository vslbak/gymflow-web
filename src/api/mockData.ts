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
import type { GymFlowApiContract, RefreshTokenRequest } from './base';

const mockGymFlowClasses: GymFlowClass[] = [
    {
        id: 'class-1',
        name: 'Power Yoga Flow',
        instructor: 'Sarah Mitchell',
        duration: '60 min',
        totalSpots: 20,
        imageUrl: 'https://images.pexels.com/photos/3822166/pexels-photo-3822166.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'Yoga',
        level: 'Intermediate',
        location: 'Studio A, 2nd Floor',
        description: 'An energizing yoga flow that builds strength, flexibility, and mindfulness. Perfect for intermediate practitioners looking to deepen their practice.',
        price: 25,
        whatToBring: ['Yoga mat', 'Water bottle', 'Comfortable athletic wear', 'Towel'],
    },
    {
        id: 'class-2',
        name: 'HIIT Cardio Blast',
        instructor: 'Mike Johnson',
        duration: '45 min',
        totalSpots: 25,
        imageUrl: 'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'Cardio',
        level: 'Advanced',
        location: 'Main Gym Floor',
        description: 'High-intensity interval training designed to maximize calorie burn and boost your metabolism. Get ready to sweat!',
        price: 30,
        whatToBring: ['Water bottle', 'Towel', 'Athletic shoes', 'Heart rate monitor (optional)'],
    },
    {
        id: 'class-3',
        name: 'Strength Training',
        instructor: 'Alex Chen',
        duration: '50 min',
        totalSpots: 15,
        imageUrl: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'Strength',
        level: 'All Levels',
        location: 'Weight Room',
        description: 'Build lean muscle and increase your overall strength with progressive resistance training. Suitable for all fitness levels.',
        price: 25,
        whatToBring: ['Water bottle', 'Towel', 'Weight lifting gloves (optional)', 'Athletic shoes'],
    },
    {
        id: 'class-4',
        name: 'Spin Class',
        instructor: 'Emma Davis',
        duration: '45 min',
        totalSpots: 30,
        imageUrl: 'https://images.pexels.com/photos/3764011/pexels-photo-3764011.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'Cardio',
        level: 'Intermediate',
        location: 'Spin Studio',
        description: 'An intense cycling workout set to energizing music. Push your limits and burn calories in this high-energy class.',
        price: 28,
        whatToBring: ['Water bottle', 'Towel', 'Cycling shoes or sneakers', 'Padded shorts (optional)'],
    },
    {
        id: 'class-5',
        name: 'Pilates Core',
        instructor: 'Lisa Anderson',
        duration: '55 min',
        totalSpots: 18,
        imageUrl: 'https://images.pexels.com/photos/3984340/pexels-photo-3984340.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'Pilates',
        level: 'Beginner',
        location: 'Studio B, 2nd Floor',
        description: 'Focus on core strength, flexibility, and balance through controlled movements. Perfect for beginners and those recovering from injuries.',
        price: 22,
        whatToBring: ['Mat', 'Water bottle', 'Comfortable clothing', 'Small towel'],
    },
    {
        id: 'class-6',
        name: 'Boxing Fundamentals',
        instructor: 'James Wilson',
        duration: '60 min',
        totalSpots: 20,
        imageUrl: 'https://images.pexels.com/photos/4753928/pexels-photo-4753928.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'Boxing',
        level: 'All Levels',
        location: 'Boxing Ring',
        description: 'Learn proper boxing techniques while getting an incredible full-body workout. Improve your coordination, speed, and power.',
        price: 32,
        whatToBring: ['Boxing gloves', 'Hand wraps', 'Water bottle', 'Athletic shoes', 'Mouthguard (optional)'],
    },
    {
        id: 'class-7',
        name: 'Morning Vinyasa',
        instructor: 'Sarah Mitchell',
        duration: '60 min',
        totalSpots: 20,
        imageUrl: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'Yoga',
        level: 'Beginner',
        location: 'Studio A, 2nd Floor',
        description: 'Start your day with gentle flowing movements and mindful breathing. Perfect for all levels.',
        price: 20,
        whatToBring: ['Yoga mat', 'Water bottle', 'Comfortable clothing', 'Yoga blocks (optional)'],
    },
    {
        id: 'class-8',
        name: 'Kettlebell Power',
        instructor: 'Alex Chen',
        duration: '45 min',
        totalSpots: 12,
        imageUrl: 'https://images.pexels.com/photos/2261482/pexels-photo-2261482.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'Strength',
        level: 'Intermediate',
        location: 'Weight Room',
        description: 'Dynamic kettlebell training to build explosive strength and power. Great for functional fitness.',
        price: 28,
        whatToBring: ['Water bottle', 'Towel', 'Athletic shoes', 'Workout gloves (optional)'],
    },
    {
        id: 'class-9',
        name: 'Restorative Yoga',
        instructor: 'Sarah Mitchell',
        duration: '75 min',
        totalSpots: 15,
        imageUrl: 'https://images.pexels.com/photos/3822220/pexels-photo-3822220.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'Yoga',
        level: 'Beginner',
        location: 'Studio A, 2nd Floor',
        description: 'Relax and restore with gentle poses held for longer periods. Perfect for stress relief and recovery.',
        price: 24,
        whatToBring: ['Yoga mat', 'Blanket', 'Eye pillow (optional)', 'Comfortable loose clothing'],
    },
    {
        id: 'class-10',
        name: 'Boot Camp Challenge',
        instructor: 'Mike Johnson',
        duration: '60 min',
        totalSpots: 20,
        imageUrl: 'https://images.pexels.com/photos/4164853/pexels-photo-4164853.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'Cardio',
        level: 'Advanced',
        location: 'Main Gym Floor',
        description: 'Military-inspired workout combining cardio, strength, and agility drills. Prepare to be challenged!',
        price: 35,
        whatToBring: ['Water bottle', 'Towel', 'Athletic shoes', 'Energy snack', 'Heart rate monitor (optional)'],
    },
    {
        id: 'class-11',
        name: 'Pilates Reformer',
        instructor: 'Lisa Anderson',
        duration: '50 min',
        totalSpots: 10,
        imageUrl: 'https://images.pexels.com/photos/3775566/pexels-photo-3775566.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'Pilates',
        level: 'Intermediate',
        location: 'Studio B, 2nd Floor',
        description: 'Advanced Pilates using the reformer machine for a challenging full-body workout.',
        price: 30,
        whatToBring: ['Water bottle', 'Grip socks', 'Comfortable fitted clothing', 'Small towel'],
    },
    {
        id: 'class-12',
        name: 'Kickboxing Cardio',
        instructor: 'James Wilson',
        duration: '55 min',
        totalSpots: 25,
        imageUrl: 'https://images.pexels.com/photos/4753994/pexels-photo-4753994.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'Boxing',
        level: 'Intermediate',
        location: 'Boxing Ring',
        description: 'High-energy kickboxing workout combining martial arts techniques with cardio conditioning.',
        price: 30,
        whatToBring: ['Boxing gloves', 'Hand wraps', 'Water bottle', 'Athletic shoes', 'Towel'],
    },
    {
        id: 'class-13',
        name: 'CrossFit WOD',
        instructor: 'Alex Chen',
        duration: '60 min',
        totalSpots: 15,
        imageUrl: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'Strength',
        level: 'Advanced',
        location: 'Main Gym Floor',
        description: 'Workout of the Day featuring Olympic lifts, gymnastics, and metabolic conditioning.',
        price: 32,
        whatToBring: ['Water bottle', 'Towel', 'Wrist wraps', 'Athletic shoes', 'Jump rope (optional)'],
    },
    {
        id: 'class-14',
        name: 'Zumba Dance Party',
        instructor: 'Emma Davis',
        duration: '50 min',
        totalSpots: 30,
        imageUrl: 'https://images.pexels.com/photos/3775540/pexels-photo-3775540.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'Cardio',
        level: 'Beginner',
        location: 'Studio A, 2nd Floor',
        description: 'Fun Latin-inspired dance fitness class that feels more like a party than a workout!',
        price: 22,
        whatToBring: ['Water bottle', 'Dance shoes or sneakers', 'Comfortable clothing', 'Positive energy'],
    },
    {
        id: 'class-15',
        name: 'Core & Abs Blast',
        instructor: 'Lisa Anderson',
        duration: '30 min',
        totalSpots: 20,
        imageUrl: 'https://images.pexels.com/photos/3775164/pexels-photo-3775164.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'Pilates',
        level: 'All Levels',
        location: 'Studio B, 2nd Floor',
        description: 'Intense 30-minute core workout targeting all abdominal muscles. Short but effective!',
        price: 18,
        whatToBring: ['Mat', 'Water bottle', 'Towel', 'Comfortable athletic wear'],
    },
];

const getDateString = (daysFromNow: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
};

const mockClassSessions: ClassSession[] = [
    { id: 'session-1', classId: 'class-1', date: getDateString(2), time: '18:00', spotsLeft: 5 },
    { id: 'session-2', classId: 'class-1', date: getDateString(5), time: '18:00', spotsLeft: 8 },
    { id: 'session-3', classId: 'class-1', date: getDateString(9), time: '18:00', spotsLeft: 12 },
    { id: 'session-4', classId: 'class-1', date: getDateString(16), time: '18:00', spotsLeft: 15 },

    { id: 'session-5', classId: 'class-2', date: getDateString(1), time: '07:30', spotsLeft: 12 },
    { id: 'session-6', classId: 'class-2', date: getDateString(3), time: '07:30', spotsLeft: 15 },
    { id: 'session-7', classId: 'class-2', date: getDateString(8), time: '07:30', spotsLeft: 18 },

    { id: 'session-8', classId: 'class-3', date: getDateString(1), time: '17:00', spotsLeft: 3 },
    { id: 'session-9', classId: 'class-3', date: getDateString(4), time: '17:00', spotsLeft: 7 },
    { id: 'session-10', classId: 'class-3', date: getDateString(7), time: '17:00', spotsLeft: 10 },
    { id: 'session-11', classId: 'class-3', date: getDateString(14), time: '17:00', spotsLeft: 12 },

    { id: 'session-12', classId: 'class-4', date: getDateString(2), time: '08:00', spotsLeft: 8 },
    { id: 'session-13', classId: 'class-4', date: getDateString(4), time: '19:00', spotsLeft: 15 },
    { id: 'session-14', classId: 'class-4', date: getDateString(6), time: '08:00', spotsLeft: 20 },
    { id: 'session-15', classId: 'class-4', date: getDateString(11), time: '19:00', spotsLeft: 22 },

    { id: 'session-16', classId: 'class-5', date: getDateString(1), time: '09:00', spotsLeft: 10 },
    { id: 'session-17', classId: 'class-5', date: getDateString(3), time: '15:00', spotsLeft: 12 },
    { id: 'session-18', classId: 'class-5', date: getDateString(10), time: '09:00', spotsLeft: 14 },

    { id: 'session-19', classId: 'class-6', date: getDateString(2), time: '19:00', spotsLeft: 6 },
    { id: 'session-20', classId: 'class-6', date: getDateString(5), time: '18:00', spotsLeft: 10 },
    { id: 'session-21', classId: 'class-6', date: getDateString(9), time: '19:00', spotsLeft: 14 },
    { id: 'session-22', classId: 'class-6', date: getDateString(12), time: '18:00', spotsLeft: 16 },

    { id: 'session-23', classId: 'class-7', date: getDateString(1), time: '07:00', spotsLeft: 15 },
    { id: 'session-24', classId: 'class-7', date: getDateString(2), time: '07:00', spotsLeft: 16 },
    { id: 'session-25', classId: 'class-7', date: getDateString(3), time: '07:00', spotsLeft: 17 },
    { id: 'session-26', classId: 'class-7', date: getDateString(4), time: '07:00', spotsLeft: 18 },
    { id: 'session-27', classId: 'class-7', date: getDateString(8), time: '07:00', spotsLeft: 18 },

    { id: 'session-28', classId: 'class-8', date: getDateString(2), time: '12:00', spotsLeft: 7 },
    { id: 'session-29', classId: 'class-8', date: getDateString(6), time: '17:00', spotsLeft: 9 },
    { id: 'session-30', classId: 'class-8', date: getDateString(13), time: '12:00', spotsLeft: 11 },

    { id: 'session-31', classId: 'class-9', date: getDateString(3), time: '20:00', spotsLeft: 12 },
    { id: 'session-32', classId: 'class-9', date: getDateString(10), time: '20:00', spotsLeft: 13 },

    { id: 'session-33', classId: 'class-10', date: getDateString(1), time: '06:00', spotsLeft: 4 },
    { id: 'session-34', classId: 'class-10', date: getDateString(3), time: '06:00', spotsLeft: 8 },
    { id: 'session-35', classId: 'class-10', date: getDateString(5), time: '06:00', spotsLeft: 12 },
    { id: 'session-36', classId: 'class-10', date: getDateString(8), time: '06:00', spotsLeft: 15 },

    { id: 'session-37', classId: 'class-11', date: getDateString(2), time: '10:00', spotsLeft: 2 },
    { id: 'session-38', classId: 'class-11', date: getDateString(7), time: '14:00', spotsLeft: 5 },
    { id: 'session-39', classId: 'class-11', date: getDateString(14), time: '10:00', spotsLeft: 8 },

    { id: 'session-40', classId: 'class-12', date: getDateString(1), time: '19:00', spotsLeft: 9 },
    { id: 'session-41', classId: 'class-12', date: getDateString(4), time: '18:00', spotsLeft: 14 },
    { id: 'session-42', classId: 'class-12', date: getDateString(8), time: '19:00', spotsLeft: 18 },
    { id: 'session-43', classId: 'class-12', date: getDateString(11), time: '18:00', spotsLeft: 20 },

    { id: 'session-44', classId: 'class-13', date: getDateString(2), time: '17:00', spotsLeft: 6 },
    { id: 'session-45', classId: 'class-13', date: getDateString(5), time: '18:00', spotsLeft: 9 },
    { id: 'session-46', classId: 'class-13', date: getDateString(9), time: '17:00', spotsLeft: 12 },

    { id: 'session-47', classId: 'class-14', date: getDateString(1), time: '18:30', spotsLeft: 14 },
    { id: 'session-48', classId: 'class-14', date: getDateString(3), time: '18:30', spotsLeft: 20 },
    { id: 'session-49', classId: 'class-14', date: getDateString(6), time: '18:30', spotsLeft: 25 },
    { id: 'session-50', classId: 'class-14', date: getDateString(10), time: '18:30', spotsLeft: 28 },

    { id: 'session-51', classId: 'class-15', date: getDateString(1), time: '13:00', spotsLeft: 11 },
    { id: 'session-52', classId: 'class-15', date: getDateString(2), time: '13:00', spotsLeft: 14 },
    { id: 'session-53', classId: 'class-15', date: getDateString(4), time: '13:00', spotsLeft: 16 },
    { id: 'session-54', classId: 'class-15', date: getDateString(7), time: '13:00', spotsLeft: 18 },
];


const mockUsers: User[] = [
    {
        id: '1',
        email: 'test@gymflow.com',
        username: 'John Doe',
        phone: '+1 (555) 123-4567',
        role: 'USER',
    },
];

const enrichSessionForBooking = (sessionId: string): ClassSession | null => {
    const session = mockClassSessions.find(s => s.id === sessionId);
    if (!session) return null;

    const gymflowClass = mockGymFlowClasses.find(c => c.id === session.classId);
    if (!gymflowClass) return null;

    return {
        id: session.id,
        gymflowClass: { ...gymflowClass, time: session.time },
        date: session.date,
        spotsLeft: session.spotsLeft,
    };
};

const mockBookings: Booking[] = [
    {
        id: 'booking-001',
        userId: '1',
        sessionId: 'session-1',
        classSession: enrichSessionForBooking('session-1')!,
        status: 'CONFIRMED',
        bookingDate: getDateString(2),
        totalPrice: 25,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        confirmedAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
        id: 'booking-002',
        userId: '1',
        sessionId: 'session-12',
        classSession: enrichSessionForBooking('session-12')!,
        status: 'CONFIRMED',
        bookingDate: getDateString(2),
        totalPrice: 28,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        confirmedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: 'booking-003',
        userId: '1',
        sessionId: 'session-23',
        classSession: enrichSessionForBooking('session-23')!,
        status: 'CONFIRMED',
        bookingDate: getDateString(1),
        totalPrice: 20,
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        confirmedAt: new Date(Date.now() - 259200000).toISOString(),
    },
    {
        id: 'booking-004',
        userId: '1',
        sessionId: 'session-33',
        classSession: enrichSessionForBooking('session-33')!,
        status: 'CONFIRMED',
        bookingDate: getDateString(-3),
        totalPrice: 35,
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        confirmedAt: new Date(Date.now() - 345600000).toISOString(),
    },
    {
        id: 'booking-005',
        userId: '1',
        sessionId: 'session-5',
        classSession: enrichSessionForBooking('session-5')!,
        status: 'CANCELLED',
        bookingDate: getDateString(-7),
        totalPrice: 30,
        createdAt: new Date(Date.now() - 604800000).toISOString(),
        cancelledAt: new Date(Date.now() - 518400000).toISOString(),
    },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockGymFlowApi implements GymFlowApiContract {
    async getClasses(): Promise<ApiResponse<GymFlowClass[]>> {
        await delay(500);
        return {
            success: true,
            data: mockGymFlowClasses,
        };
    }

    async getClassSessions(): Promise<ApiResponse<ClassSession[]>> {
        await delay(400);
        return {
            success: true,
            data: mockClassSessions,
        };
    }

    async getClassSessionById(id: string): Promise<ApiResponse<ClassSession>> {
        await delay(300);
        const session = mockClassSessions.find((s) => s.id === id);

        if (!session) {
            return {
                success: false,
                error: 'Class session not found',
            };
        }

        return {
            success: true,
            data: session,
        };
    }

    async getSessionsByClassId(classId: string): Promise<ApiResponse<ClassSession[]>> {
        await delay(300);
        const sessions = mockClassSessions
            .filter((s) => s.classId === classId)
            .map((s) => {
                const gymflowClass = mockGymFlowClasses.find((c) => c.id === s.classId);
                if (!gymflowClass) return null;
                return {
                    id: s.id,
                    gymflowClass: { ...gymflowClass, time: s.time },
                    date: s.date,
                    spotsLeft: s.spotsLeft,
                };
            })
            .filter((s): s is ClassSession => s !== null);

        return {
            success: true,
            data: sessions,
        };
    }

    async login(request: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        await delay(800);

        const user = mockUsers.find((u) => u.email === request.email);

        if (!user || request.password !== 'password123') {
            return {
                success: false,
                error: 'Invalid email or password',
            };
        }

        return {
            success: true,
            data: {
                accessToken: 'mock-jwt-token-' + Date.now(),
                expiresIn: 3600,
                refreshToken: 'mock-refresh-token-' + Date.now(),
            },
        };
    }

    async getCurrentUser(token: string): Promise<ApiResponse<User>> {
        await delay(300);

        if (!token || !token.startsWith('mock-jwt-token')) {
            return {
                success: false,
                error: 'Invalid token',
            };
        }

        return {
            success: true,
            data: mockUsers[0],
        };
    }

    async signup(request: SignupRequest): Promise<ApiResponse<LoginResponse>> {
        await delay(1000);

        const existingUser = mockUsers.find((u) => u.email === request.email);

        if (existingUser) {
            return {
                success: false,
                error: 'Email already exists',
            };
        }

        const newUser: User = {
            id: String(mockUsers.length + 1),
            email: request.email,
            username: request.username,
            phone: request.phone,
            role: 'USER',
        };

        mockUsers.push(newUser);

        return {
            success: true,
            data: {
                accessToken: 'mock-jwt-token-' + Date.now(),
                expiresIn: 3600,
                refreshToken: 'mock-refresh-token-' + Date.now(),
            },
        };
    }

    async refreshToken(request: RefreshTokenRequest): Promise<ApiResponse<LoginResponse>> {
        await delay(300);

        if (!request.refreshToken || !request.refreshToken.startsWith('mock-refresh-token')) {
            return {
                success: false,
                error: 'Invalid refresh token',
            };
        }

        return {
            success: true,
            data: {
                accessToken: 'mock-jwt-token-' + Date.now(),
                expiresIn: 3600,
                refreshToken: 'mock-refresh-token-' + Date.now(),
            },
        };
    }

    async createBooking(request: BookingRequest): Promise<ApiResponse<BookingResponse>> {
        await delay(800);

        const session = mockClassSessions.find((s) => s.id === request.classSession);

        if (!session) {
            return {
                success: false,
                error: 'Session not found',
            };
        }

        const classItem = mockGymFlowClasses.find((c) => c.id === session.classId);

        if (!classItem) {
            return {
                success: false,
                error: 'Class not found',
            };
        }

        if (session.spotsLeft <= 0) {
            return {
                success: false,
                error: 'No spots available',
            };
        }

        const token = localStorage.getItem('token');
        if (!token) {
            return {
                success: false,
                error: 'Not authenticated',
            };
        }

        const enrichedSession = enrichSessionForBooking(request.classSession);
        if (!enrichedSession) {
            return {
                success: false,
                error: 'Failed to create booking',
            };
        }

        const booking: Booking = {
            id: 'booking-' + Date.now(),
            userId: mockUsers[0].id,
            sessionId: request.classSession,
            classSession: enrichedSession,
            status: 'CONFIRMED',
            bookingDate: session.date,
            totalPrice: request.amount,
            createdAt: new Date().toISOString(),
            confirmedAt: new Date().toISOString(),
        };

        mockBookings.push(booking);
        session.spotsLeft -= 1;

        return {
            success: true,
            data: {
                url: `/booking-success?bookingId=${booking.id}`,
            },
        };
    }

    async getUserBookings(): Promise<ApiResponse<Booking[]>> {
        await delay(500);
        const token = localStorage.getItem('token');
        if (!token) {
            return {
                success: false,
                error: 'Not authenticated',
            };
        }

        const userBookings = mockBookings
            .filter((b) => b.userId === mockUsers[0].id)
            .map(booking => ({
                ...booking,
                classSession: enrichSessionForBooking(booking.sessionId) || booking.classSession,
            }));

        return {
            success: true,
            data: userBookings,
        };
    }

    async cancelBooking(bookingId: string): Promise<ApiResponse<void>> {
        await delay(500);

        const bookingIndex = mockBookings.findIndex((b) => b.id === bookingId);

        if (bookingIndex === -1) {
            return {
                success: false,
                error: 'Booking not found',
            };
        }

        const booking = mockBookings[bookingIndex];
        booking.status = 'CANCELLED';

        const session = mockClassSessions.find((s) => s.id === booking.sessionId);
        if (session) {
            session.spotsLeft += 1;
        }

        return {
            success: true,
        };
    }
}
