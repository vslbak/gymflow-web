import {useState, useEffect} from 'react';
import {useParams, Link, useNavigate, useLocation} from 'react-router-dom';
import {Clock, MapPin, CreditCard, CheckCircle, Calendar, Users, AlertCircle} from 'lucide-react';
import {api} from '../api/apiFactory';
import {useData} from '../contexts/DataContext';
import {useAuth} from '../contexts/AuthContext';
import type {ClassSession} from '../types';
import {formatDuration} from '../utils/formatDuration';
import CalendarComponent from '../components/common/Calendar';

export default function ClassPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const {isAuthenticated} = useAuth();
    const {getClassById, loading: classesLoading} = useData();
    const classItem = id ? getClassById(id) : undefined;

    const [selectedDate, setSelectedDate] = useState<string>('');
    const [session, setSession] = useState<ClassSession | null>(null);
    const [sessions, setSessions] = useState<ClassSession[]>([]);
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [sessionsLoading, setSessionsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
        const fetchSessions = async () => {
            if (!id) return;

            setSessionsLoading(true);
            try {
                const sessionsResponse = await api.getSessionsByClassId(id);

                if (sessionsResponse.success && sessionsResponse.data) {
                    setSessions(sessionsResponse.data);
                    const dates = [...new Set(sessionsResponse.data.map(s => s.date))].sort();
                    setAvailableDates(dates);
                    if (dates.length > 0) {
                        setSelectedDate(dates[0]);
                    }
                }
            } catch (err) {
                setError('Failed to load sessions');
                console.error('Failed to fetch sessions:', err);
            } finally {
                setSessionsLoading(false);
            }
        };

        fetchSessions();
    }, [id]);

    useEffect(() => {
        if (!selectedDate || sessions.length === 0) return;

        const foundSession = sessions.find(s => s.date === selectedDate);
        setSession(foundSession || null);
    }, [selectedDate, sessions]);

    if (classesLoading || sessionsLoading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white rounded-2xl h-96"></div>
                            <div className="bg-white rounded-2xl h-96"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !classItem) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Class Not Found</h1>
                    <Link to="/classes" className="text-orange-600 hover:text-orange-700 font-semibold">
                        Back to Classes
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-16 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    to="/classes"
                    className="inline-flex items-center text-gray-600 hover:text-orange-600 mb-6 font-medium"
                >
                    ← Back to Classes
                </Link>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="relative h-80">
                                <img
                                    src={classItem.imageUrl}
                                    alt={classItem.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="flex items-center space-x-3 mb-4">
                    <span className="bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      {classItem.category}
                    </span>
                                        <span
                                            className="bg-white/90 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
                      {classItem.level}
                    </span>
                                    </div>
                                    <h1 className="text-4xl font-bold text-white mb-2">{classItem.name}</h1>
                                    <p className="text-xl text-gray-200">with {classItem.instructor}</p>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="mb-8">
                                    <label className="block text-sm font-semibold text-gray-900 mb-4">
                                        Select Date
                                    </label>
                                    <CalendarComponent
                                        availableDates={availableDates}
                                        selectedDate={selectedDate}
                                        onDateSelect={setSelectedDate}
                                    />
                                    {selectedDate && (
                                        <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                                            <p className="text-sm font-semibold text-orange-900">
                                                Selected: {new Date(selectedDate).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    <div className="flex items-start space-x-3">
                                        <Clock className="h-6 w-6 text-orange-600 mt-1"/>
                                        <div>
                                            <p className="font-semibold text-gray-900">Duration</p>
                                            <p className="text-gray-600">{formatDuration(classItem.duration)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <MapPin className="h-6 w-6 text-orange-600 mt-1"/>
                                        <div>
                                            <p className="font-semibold text-gray-900">Location</p>
                                            <p className="text-gray-600">{classItem.location}</p>
                                        </div>
                                    </div>
                                    {session && (
                                        <>
                                            <div className="flex items-start space-x-3">
                                                <Calendar className="h-6 w-6 text-orange-600 mt-1"/>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Time</p>
                                                    <p className="text-gray-600">{session.gymflowClass.classTime}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <Users className="h-6 w-6 text-orange-600 mt-1"/>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Availability</p>
                                                    {session.spotsLeft === 0 ? (
                                                        <p className="text-red-600 font-bold">Fully Booked</p>
                                                    ) : (
                                                        <p className={session.spotsLeft <= 5 ? 'text-orange-600 font-semibold' : 'text-gray-600'}>
                                                            {session.spotsLeft} spots left of {classItem.totalSpots}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="border-t pt-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Class</h2>
                                    <p className="text-gray-700 leading-relaxed">{classItem.description}</p>
                                </div>

                                {classItem.whatToBring && classItem.whatToBring.length > 0 && (
                                    <div className="border-t pt-6 mt-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">What to Bring</h3>
                                        <ul className="space-y-2 text-gray-700">
                                            {classItem.whatToBring.map((item, index) => (
                                                <li key={index} className="flex items-center">
                                                    <CheckCircle className="h-5 w-5 text-green-500 mr-3"/>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Summary</h2>

                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 mb-6">
                                <p className="text-sm text-gray-600 mb-2">Class Price</p>
                                <div className="flex items-baseline space-x-2 mb-4">
                                    <span className="text-4xl font-bold text-orange-600">${classItem.price}</span>
                                    <span className="text-gray-600">per session</span>
                                </div>
                                <div className="bg-white rounded p-3 border border-orange-200">
                                    <p className="text-xs text-gray-600 font-medium">What's included</p>
                                    <ul className="mt-2 space-y-1">
                                        <li className="text-sm text-gray-700">✓ Class access</li>
                                        <li className="text-sm text-gray-700">✓ Expert instruction</li>
                                        <li className="text-sm text-gray-700">✓ Equipment (if needed)</li>
                                    </ul>
                                </div>
                            </div>

                            {bookingError && (
                                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                                    <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0"/>
                                    <p className="text-sm text-red-800">{bookingError}</p>
                                </div>
                            )}

                            {bookingSuccess && (
                                <div
                                    className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"/>
                                    <p className="text-sm text-green-800">Booking confirmed successfully!</p>
                                </div>
                            )}

                            <button
                                onClick={async () => {
                                    if (!isAuthenticated) {
                                        navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
                                        return;
                                    }

                                    if (!session || !classItem) return;

                                    setBookingLoading(true);
                                    setBookingError(null);
                                    setBookingSuccess(false);

                                    try {
                                        const response = await api.createBooking({
                                            classSession: session.id,
                                            className: classItem.name,
                                            amount: classItem.price,
                                        });

                                        if (response.success && response.data) {
                                            window.location.href = response.data.url;
                                        } else {
                                            setBookingError("Failed to create booking. Please contact support");
                                        }
                                    } catch (err) {
                                        setBookingError('An error occurred. Please try again.');
                                    } finally {
                                        setBookingLoading(false);
                                    }
                                }}
                                disabled={!session || session.spotsLeft === 0 || bookingLoading || bookingSuccess}
                                className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center space-x-2 mb-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                <CreditCard className="h-5 w-5"/>
                                <span>
                  {bookingLoading
                      ? 'Processing...'
                      : bookingSuccess
                          ? 'Booked!'
                          : !session
                              ? 'No Session Available'
                              : session.spotsLeft === 0
                                  ? 'Fully Booked'
                                  : 'Confirm Booking'}
                </span>
                            </button>

                            <p className="text-sm text-gray-500 text-center mb-4">
                                You won't be charged until the booking is confirmed
                            </p>

                            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                                <p className="text-sm text-orange-900 font-medium mb-2">
                                    Cancellation Policy
                                </p>
                                <p className="text-sm text-orange-800">
                                    Free cancellation up to 2 hours before class start time
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
