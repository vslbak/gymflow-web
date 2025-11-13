import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, User } from 'lucide-react';

export default function BookingSuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const sessionId = searchParams.get('session_id');
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        if (!sessionId) {
            navigate('/classes');
            return;
        }

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/dashboard');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [sessionId, navigate]);

    if (!sessionId) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Booking Confirmed!
                        </h1>

                        <p className="text-lg text-gray-600 mb-8">
                            Your class has been successfully booked. Get ready for an amazing experience!
                        </p>

                        <div className="w-full bg-gray-50 rounded-xl p-6 mb-8">
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                                Booking Details
                            </h2>

                            <div className="space-y-3 text-left">
                                <div className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Payment Confirmed</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Session ID: {sessionId}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Calendar className="w-5 h-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Confirmation Email Sent</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Check your inbox for class details</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Clock className="w-5 h-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Arrive 10 Minutes Early</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Give yourself time to check in and prepare</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <MapPin className="w-5 h-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Location Details</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Full address included in confirmation email</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <User className="w-5 h-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">What to Bring</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Check your email for the complete list</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-md hover:shadow-lg"
                            >
                                View My Bookings
                            </button>

                            <button
                                onClick={() => navigate('/classes')}
                                className="flex-1 bg-white text-orange-600 py-3 px-6 rounded-lg font-semibold border-2 border-orange-600 hover:bg-orange-50 transition-colors"
                            >
                                Browse More Classes
                            </button>
                        </div>

                        <p className="text-sm text-gray-500 mt-6">
                            Redirecting to dashboard in <span className="font-semibold text-orange-600">{countdown}</span> seconds...
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Need help? Contact us at{' '}
                        <a href="mailto:support@gymflow.com" className="text-orange-600 hover:text-orange-700 font-medium">
                            support@gymflow.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
