import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, TrendingUp, DollarSign, Activity, Clock, ArrowUp, ArrowDown, BarChart3, PieChart } from 'lucide-react';
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
    .reduce((sum, b) => sum + b.classSession.gymflowClass.price, 0);

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
  const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED').length;
  const totalClasses = classes.length;

  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  const recentRevenue = bookings
    .filter(b => b.status === 'CONFIRMED' && new Date(b.createdAt) > last7Days)
    .reduce((sum, b) => sum + b.classSession.gymflowClass.price, 0);

  const recentBookingsCount = bookings.filter(b => new Date(b.createdAt) > last7Days).length;

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
        revenue: classBookings.reduce((sum, b) => sum + b.classSession.gymflowClass.price, 0),
      };
    })
    .sort((a, b) => b.bookingCount - a.bookingCount)
    .slice(0, 8);

  const categoryStats = classes.reduce((acc, cls) => {
    const classBookings = bookings.filter(
      b => b.classSession.gymflowClass.id === cls.id && b.status === 'CONFIRMED'
    );
    const count = classBookings.length;

    if (!acc[cls.category]) {
      acc[cls.category] = { count: 0, revenue: 0 };
    }
    acc[cls.category].count += count;
    acc[cls.category].revenue += classBookings.reduce((sum, b) => sum + b.classSession.gymflowClass.price, 0);
    return acc;
  }, {} as Record<string, { count: number; revenue: number }>);

  const topCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5);

  const instructorStats = classes.reduce((acc, cls) => {
    const classBookings = bookings.filter(
      b => b.classSession.gymflowClass.id === cls.id && b.status === 'CONFIRMED'
    );
    const count = classBookings.length;

    if (!acc[cls.instructor]) {
      acc[cls.instructor] = { count: 0, revenue: 0 };
    }
    acc[cls.instructor].count += count;
    acc[cls.instructor].revenue += classBookings.reduce((sum, b) => sum + b.classSession.gymflowClass.price, 0);
    return acc;
  }, {} as Record<string, { count: number; revenue: number }>);

  const topInstructors = Object.entries(instructorStats)
    .sort(([, a], [, b]) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Admin Dashboard"
          subtitle="Comprehensive overview of your gym's performance and analytics"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 font-medium mb-1">Total Revenue</p>
                <p className="text-4xl font-bold">${totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-2 text-orange-100">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+${recentRevenue} last 7 days</span>
                </div>
              </div>
              <div className="bg-white/20 rounded-full p-4">
                <DollarSign className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 font-medium mb-1">Total Bookings</p>
                <p className="text-4xl font-bold">{totalBookings}</p>
                <div className="flex items-center mt-2 text-blue-100">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+{recentBookingsCount} last 7 days</span>
                </div>
              </div>
              <div className="bg-white/20 rounded-full p-4">
                <Calendar className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 font-medium mb-1">Confirmed</p>
                <p className="text-4xl font-bold">{confirmedBookings}</p>
                <div className="flex items-center mt-2 text-green-100">
                  <Activity className="h-4 w-4 mr-1" />
                  <span className="text-sm">{totalBookings > 0 ? Math.round((confirmedBookings / totalBookings) * 100) : 0}% of total</span>
                </div>
              </div>
              <div className="bg-white/20 rounded-full p-4">
                <Activity className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 font-medium mb-1">Active Classes</p>
                <p className="text-4xl font-bold">{totalClasses}</p>
                <div className="flex items-center mt-2 text-purple-100">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">{Object.keys(instructorStats).length} instructors</span>
                </div>
              </div>
              <div className="bg-white/20 rounded-full p-4">
                <Users className="h-10 w-10" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Top Performing Classes</h2>
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>

            <div className="space-y-3">
              {popularClasses.map((cls, index) => (
                <div
                  key={cls.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:shadow-md transition-all border border-gray-100"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`rounded-full w-10 h-10 flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                      index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500' :
                      'bg-gradient-to-br from-gray-400 to-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{cls.name}</p>
                      <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                        <span>{cls.instructor}</span>
                        <span className="text-gray-400">•</span>
                        <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs font-semibold">{cls.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-gray-900 text-lg">{cls.bookingCount}</p>
                    <p className="text-sm text-green-600 font-bold">${cls.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Category Breakdown</h2>
              <PieChart className="h-6 w-6 text-orange-600" />
            </div>

            <div className="space-y-4">
              {topCategories.map(([category, stats], index) => {
                const percentage = totalBookings > 0 ? (stats.count / confirmedBookings * 100) : 0;
                const colors = [
                  'from-orange-500 to-orange-600',
                  'from-blue-500 to-blue-600',
                  'from-green-500 to-green-600',
                  'from-purple-500 to-purple-600',
                  'from-pink-500 to-pink-600'
                ];

                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-gray-900">{category}</span>
                      <span className="text-gray-600">{stats.count} bookings</span>
                    </div>
                    <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full bg-gradient-to-r ${colors[index]} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">${stats.revenue} revenue</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Top Instructors</h2>
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>

            <div className="space-y-4">
              {topInstructors.map(([instructor, stats], index) => (
                <div key={instructor} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {instructor.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{instructor}</p>
                      <p className="text-sm text-gray-600">{stats.count} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600 text-lg">${stats.revenue}</p>
                    <p className="text-xs text-gray-500">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
              <Clock className="h-6 w-6 text-orange-600" />
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
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
                      })} at {booking.classSession.gymflowClass.classTime}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-gray-900">${booking.classSession.gymflowClass.price}</p>
                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
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

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
              <p className="text-sm text-gray-700 font-semibold mb-2">Confirmation Rate</p>
              <p className="text-5xl font-bold text-green-600 mb-2">
                {totalBookings > 0 ? Math.round((confirmedBookings / totalBookings) * 100) : 0}%
              </p>
              <p className="text-xs text-gray-600">{confirmedBookings} of {totalBookings} bookings</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-2 border-red-200">
              <p className="text-sm text-gray-700 font-semibold mb-2">Cancellation Rate</p>
              <p className="text-5xl font-bold text-red-600 mb-2">
                {totalBookings > 0 ? Math.round((cancelledBookings / totalBookings) * 100) : 0}%
              </p>
              <p className="text-xs text-gray-600">{cancelledBookings} cancelled</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
              <p className="text-sm text-gray-700 font-semibold mb-2">Avg Booking Value</p>
              <p className="text-5xl font-bold text-blue-600 mb-2">
                ${confirmedBookings > 0 ? Math.round(totalRevenue / confirmedBookings) : 0}
              </p>
              <p className="text-xs text-gray-600">per confirmed booking</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
              <p className="text-sm text-gray-700 font-semibold mb-2">Classes per Instructor</p>
              <p className="text-5xl font-bold text-purple-600 mb-2">
                {Object.keys(instructorStats).length > 0 ? Math.round(totalClasses / Object.keys(instructorStats).length) : 0}
              </p>
              <p className="text-xs text-gray-600">average classes taught</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
