import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, TrendingUp, DollarSign, Activity, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api/apiFactory';
import type { Booking, GymFlowClass } from '../types';
import PageHeader from '../components/common/PageHeader';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [classes, setClasses] = useState<GymFlowClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [bookingsRes, classesRes] = await Promise.all([
          api.getUserBookings(),
          api.getClasses(),
        ]);

        if (bookingsRes.success && bookingsRes.data) {
          setBookings(bookingsRes.data);
        }

        if (classesRes.success && classesRes.data) {
          setClasses(classesRes.data);
        }
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <LoadingSkeleton />
      </div>
    );
  }

  const totalRevenue = bookings
    .filter(b => b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
  const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED').length;
  const totalClasses = classes.length;

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  const popularClasses = classes
    .map(cls => {
      const classBookings = bookings.filter(
        b => b.classSession.gymflowClass.id === cls.id && b.status === 'CONFIRMED'
      );
      return {
        ...cls,
        bookingCount: classBookings.length,
        revenue: classBookings.reduce((sum, b) => sum + b.totalPrice, 0),
      };
    })
    .sort((a, b) => b.bookingCount - a.bookingCount)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Admin Dashboard"
          subtitle="Manage your gym's classes, bookings, and performance"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">${totalRevenue}</p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalBookings}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Confirmed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{confirmedBookings}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Classes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalClasses}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Popular Classes</h2>
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>

            <div className="space-y-4">
              {popularClasses.map((cls, index) => (
                <div
                  key={cls.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{cls.name}</p>
                      <p className="text-sm text-gray-600">{cls.instructor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{cls.bookingCount} bookings</p>
                    <p className="text-sm text-green-600 font-semibold">${cls.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
              <Clock className="h-6 w-6 text-orange-600" />
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {booking.classSession.gymflowClass.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${booking.totalPrice}</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.status === 'CONFIRMED'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Statistics Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 font-medium mb-2">Confirmation Rate</p>
              <p className="text-4xl font-bold text-green-600">
                {totalBookings > 0 ? Math.round((confirmedBookings / totalBookings) * 100) : 0}%
              </p>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600 font-medium mb-2">Cancellation Rate</p>
              <p className="text-4xl font-bold text-red-600">
                {totalBookings > 0 ? Math.round((cancelledBookings / totalBookings) * 100) : 0}%
              </p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 font-medium mb-2">Average Booking Value</p>
              <p className="text-4xl font-bold text-blue-600">
                ${confirmedBookings > 0 ? Math.round(totalRevenue / confirmedBookings) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
