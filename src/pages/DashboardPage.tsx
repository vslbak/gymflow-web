import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, XCircle, CheckCircle, Award, TrendingUp } from 'lucide-react';
import { api } from '../api/apiFactory';
import { useAuth } from '../contexts/AuthContext';
import type { Booking, GymFlowClass } from '../types';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { formatDuration } from '../utils/formatDuration';

interface BookingWithClass extends Booking {
    class?: GymFlowClass;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<BookingWithClass[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) return;

            try {
                const response = await api.getUserBookings();
                if (response.success && response.data) {
                    const classesResponse = await api.getClasses();
                    const allClasses = classesResponse.success ? classesResponse.data || [] : [];

                    const bookingsWithClasses = response.data.map((booking) => {
                        const classId = booking.classSession?.classId;
                        const foundClass = classId ? allClasses.find(c => c.id === classId) : undefined;

                        return {
                            ...booking,
                            class: foundClass,
                        };
                    });

                    setBookings(bookingsWithClasses);
                }
            } catch (error) {
                console.error('Failed to fetch bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    const handleCancelBooking = async (bookingId: string) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;

        try {
            const response = await api.cancelBooking(bookingId);
            if (response.success) {
                setBookings((prev) =>
                    prev.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' as const } : b))
                );
            }
        } catch (error) {
            console.error('Failed to cancel booking:', error);
        }
    };

    const normalizeStatus = (status: Booking['status']): string => {
        return status.toLowerCase();
    };

    const getBookingDate = (booking: Booking): Date => {
        const dateStr = booking.bookingDate || booking.classSession?.date || booking.createdAt;
        return new Date(dateStr);
    };

    const upcomingBookings = bookings.filter((b) => {
        const status = normalizeStatus(b.status);
        const bookingDate = getBookingDate(b);
        return (status === 'confirmed' || status === 'pending') && bookingDate > new Date();
    });

    const pastBookings = bookings.filter((b) => {
        const status = normalizeStatus(b.status);
        const bookingDate = getBookingDate(b);
        return status === 'confirmed' && bookingDate <= new Date();
    });

    const cancelledBookings = bookings.filter((b) => normalizeStatus(b.status) === 'cancelled');

    const pendingBookings = bookings.filter((b) => normalizeStatus(b.status) === 'pending');
    const confirmedBookings = bookings.filter((b) => normalizeStatus(b.status) === 'confirmed');

    const totalSpent = bookings
        .filter((b) => normalizeStatus(b.status) !== 'cancelled')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const thisMonthBookings = bookings.filter((b) => {
        const bookingDate = getBookingDate(b);
        const now = new Date();
        return (
            bookingDate.getMonth() === now.getMonth() &&
            bookingDate.getFullYear() === now.getFullYear() &&
            normalizeStatus(b.status) !== 'cancelled'
        );
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <LoadingSkeleton type="details" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-16 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Dashboard</h1>
                    <p className="text-xl text-gray-600">Welcome back, {user?.username || user?.email}!</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-600">
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Bookings</p>
                        <p className="text-3xl font-bold text-gray-900 mb-2">{bookings.length}</p>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="text-green-600 font-medium">{confirmedBookings.length} confirmed</span>
                            <span className="text-yellow-600 font-medium">{pendingBookings.length} pending</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-600">
                        <p className="text-sm font-medium text-gray-500 mb-1">Upcoming</p>
                        <p className="text-3xl font-bold text-gray-900 mb-2">{upcomingBookings.length}</p>
                        <p className="text-xs text-gray-600">Next classes scheduled</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-600">
                        <p className="text-sm font-medium text-gray-500 mb-1">This Month</p>
                        <p className="text-3xl font-bold text-gray-900 mb-2">{thisMonthBookings.length}</p>
                        <p className="text-xs text-gray-600">Classes booked in {new Date().toLocaleDateString('en-US', { month: 'long' })}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-gray-600">
                        <p className="text-sm font-medium text-gray-500 mb-1">Completed</p>
                        <p className="text-3xl font-bold text-gray-900 mb-2">{pastBookings.length}</p>
                        <div className="text-xs text-gray-600">
                            {cancelledBookings.length > 0 && (
                                <span className="text-red-600">{cancelledBookings.length} cancelled</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Classes</h2>
                        {upcomingBookings.length === 0 ? (
                            <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
                                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 mb-4">No upcoming classes booked</p>
                                <Link
                                    to="/classes"
                                    className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                                >
                                    Browse Classes
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {upcomingBookings.map((booking) => {
                                    const status = normalizeStatus(booking.status);
                                    const statusConfig = {
                                        confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed' },
                                        pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
                                    };
                                    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

                                    return (
                                        <div
                                            key={booking.id}
                                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                                        >
                                            <div className="md:flex">
                                                {booking.class && (
                                                    <div className="md:w-64 h-48 md:h-auto">
                                                        <img
                                                            src={booking.class.imageUrl}
                                                            alt={booking.class.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-1 p-6">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div>
                                                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                                                {booking.class?.name || 'Class Details Loading...'}
                                                            </h3>
                                                            {booking.class?.instructor && (
                                                                <p className="text-gray-600">with {booking.class.instructor}</p>
                                                            )}
                                                        </div>
                                                        <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-sm font-semibold`}>
                              {config.label}
                            </span>
                                                    </div>

                                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                        <div className="flex items-center text-gray-600">
                                                            <Calendar className="h-5 w-5 text-orange-600 mr-2" />
                                                            {booking.classSession?.date || booking.bookingDate || 'Date TBD'}
                                                        </div>
                                                        {booking.class?.duration && (
                                                            <div className="flex items-center text-gray-600">
                                                                <Clock className="h-5 w-5 text-orange-600 mr-2" />
                                                                {formatDuration(booking.class.duration)}
                                                            </div>
                                                        )}
                                                        {booking.class?.location && (
                                                            <div className="flex items-center text-gray-600">
                                                                <MapPin className="h-5 w-5 text-orange-600 mr-2" />
                                                                {booking.class.location}
                                                            </div>
                                                        )}
                                                        {booking.totalPrice !== undefined && (
                                                            <div className="flex items-center text-gray-900 font-semibold">
                                                                Total: ${booking.totalPrice}
                                                            </div>
                                                        )}
                                                        {booking.classSession && (
                                                            <div className="flex items-center text-gray-600">
                                                                Spots Left: {booking.classSession.spotsLeft}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex space-x-4">
                                                        {booking.class?.id && (
                                                            <Link
                                                                to={`/class/${booking.class.id}`}
                                                                className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                                                            >
                                                                View Details
                                                            </Link>
                                                        )}
                                                        <button
                                                            onClick={() => handleCancelBooking(booking.id)}
                                                            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition-colors flex items-center"
                                                        >
                                                            <XCircle className="h-4 w-4 mr-2" />
                                                            Cancel Booking
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    {pastBookings.length > 0 && (
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <Award className="h-8 w-8 text-orange-600" />
                                    <h2 className="text-2xl font-bold text-gray-900">Class History</h2>
                                </div>
                                <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-orange-50 px-4 py-2 rounded-lg">
                                    <TrendingUp className="h-5 w-5 text-orange-600" />
                                    <span className="text-sm font-semibold text-orange-900">
                                        {pastBookings.length} Classes Completed
                                    </span>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pastBookings.map((booking, index) => (
                                    <div
                                        key={booking.id}
                                        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
                                    >
                                        {booking.class && (
                                            <div className="relative h-40 overflow-hidden">
                                                <img
                                                    src={booking.class.imageUrl}
                                                    alt={booking.class.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                                <div className="absolute top-3 right-3">
                                                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                                                        <CheckCircle className="h-3 w-3" />
                                                        <span>Completed</span>
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-3 left-3 right-3">
                                                    <h3 className="text-white font-bold text-lg leading-tight">
                                                        {booking.class.name}
                                                    </h3>
                                                </div>
                                            </div>
                                        )}
                                        <div className="p-5">
                                            <div className="space-y-2 mb-4">
                                                {booking.class?.instructor && (
                                                    <div className="flex items-center text-gray-600 text-sm">
                                                        <div className="w-2 h-2 bg-orange-600 rounded-full mr-2"></div>
                                                        <span className="font-medium">{booking.class.instructor}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center text-gray-600 text-sm">
                                                    <Calendar className="h-4 w-4 text-orange-600 mr-2" />
                                                    <span>
                                                        {new Date(booking.classSession?.date || booking.bookingDate).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                {booking.class?.duration && (
                                                    <div className="flex items-center text-gray-600 text-sm">
                                                        <Clock className="h-4 w-4 text-orange-600 mr-2" />
                                                        <span>{formatDuration(booking.class.duration)}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {booking.class?.category && (
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                        {booking.class.category}
                                                    </span>
                                                    {booking.class?.id && (
                                                        <Link
                                                            to={`/class/${booking.class.id}`}
                                                            className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                                                        >
                                                            Book Again →
                                                        </Link>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {cancelledBookings.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancelled Bookings</h2>
                            <div className="space-y-4">
                                {cancelledBookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200 flex items-center justify-between opacity-60"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <XCircle className="h-8 w-8 text-gray-400" />
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-700">
                                                    {booking.class?.name}
                                                </h3>
                                                <p className="text-gray-500">
                                                    {booking.class?.time} • {booking.class?.instructor}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-gray-500 font-semibold">Cancelled</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
