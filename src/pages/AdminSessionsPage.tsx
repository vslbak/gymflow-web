import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, X, Save, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api/apiFactory';
import type { GymFlowClass, ClassSession } from '../types';
import type { CreateSessionRequest, UpdateSessionRequest } from '../api/base';
import PageHeader from '../components/common/PageHeader';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ConfirmModal from '../components/common/ConfirmModal';
import Snackbar from '../components/common/Snackbar';

export default function AdminSessionsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [classes, setClasses] = useState<GymFlowClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [filterClassId, setFilterClassId] = useState<string>('all');

  const [formData, setFormData] = useState<CreateSessionRequest>({
    classId: '',
    date: '',
    time: '',
    spotsLeft: 0,
  });

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [sessionsRes, classesRes] = await Promise.all([
        api.getClassSessions(),
        api.getClasses(),
      ]);

      if (sessionsRes.success && sessionsRes.data) {
        setSessions(sessionsRes.data);
      }

      if (classesRes.success && classesRes.data) {
        setClasses(classesRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingSession(null);
    setFormData({
      classId: classes[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      spotsLeft: classes[0]?.totalSpots || 20,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (session: ClassSession) => {
    setEditingSession(session);
    setFormData({
      classId: session.gymflowClass.id,
      date: session.date,
      time: session.gymflowClass.time,
      spotsLeft: session.spotsLeft,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingSession) {
        const updateData: UpdateSessionRequest = {
          id: editingSession.id,
          date: formData.date,
          time: formData.time,
          spotsLeft: formData.spotsLeft,
        };
        const res = await api.updateSession(updateData);
        if (res.success) {
          setSnackbar({ message: 'Session updated successfully', type: 'success' });
          fetchData();
        } else {
          setSnackbar({ message: res.error || 'Failed to update session', type: 'error' });
        }
      } else {
        const res = await api.createSession(formData);
        if (res.success) {
          setSnackbar({ message: 'Session created successfully', type: 'success' });
          fetchData();
        } else {
          setSnackbar({ message: res.error || 'Failed to create session', type: 'error' });
        }
      }
      setShowModal(false);
    } catch (err) {
      setSnackbar({ message: 'An error occurred', type: 'error' });
    }
  };

  const handleDelete = async (sessionId: string) => {
    try {
      const res = await api.deleteSession(sessionId);
      if (res.success) {
        setSnackbar({ message: 'Session deleted successfully', type: 'success' });
        fetchData();
      } else {
        setSnackbar({ message: res.error || 'Failed to delete session', type: 'error' });
      }
    } catch (err) {
      setSnackbar({ message: 'An error occurred', type: 'error' });
    }
    setDeleteConfirm(null);
  };

  const handleClassChange = (classId: string) => {
    const selectedClass = classes.find(c => c.id === classId);
    setFormData({
      ...formData,
      classId,
      spotsLeft: selectedClass?.totalSpots || formData.spotsLeft,
    });
  };

  const filteredSessions = filterClassId === 'all'
    ? sessions
    : sessions.filter(s => s.gymflowClass.id === filterClassId);

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    const dateA = new Date(a.date + ' ' + a.gymflowClass.time);
    const dateB = new Date(b.date + ' ' + b.gymflowClass.time);
    return dateA.getTime() - dateB.getTime();
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <PageHeader
            title="Manage Sessions"
            subtitle="Schedule and manage class sessions"
          />
          <div className="flex items-center space-x-4">
            <select
              value={filterClassId}
              onChange={(e) => setFilterClassId(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
            <button
              onClick={handleOpenCreate}
              className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              <Plus className="h-5 w-5" />
              <span>Add Session</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Spots Left
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">{session.gymflowClass.name}</div>
                      <div className="text-sm text-gray-500">{session.gymflowClass.duration}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {session.gymflowClass.instructor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(session.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        {session.gymflowClass.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        session.spotsLeft === 0
                          ? 'bg-red-100 text-red-800'
                          : session.spotsLeft < 5
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {session.spotsLeft} / {session.gymflowClass.totalSpots}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                        {session.gymflowClass.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleOpenEdit(session)}
                        className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-2"
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(session.id)}
                        className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {sortedSessions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No sessions found. Create your first session to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingSession ? 'Edit Session' : 'Create New Session'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Class
                </label>
                <select
                  value={formData.classId}
                  onChange={(e) => handleClassChange(e.target.value)}
                  disabled={!!editingSession}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - {cls.instructor}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Available Spots
                </label>
                <input
                  type="number"
                  value={formData.spotsLeft}
                  onChange={(e) => setFormData({ ...formData, spotsLeft: parseInt(e.target.value) || 0 })}
                  min="0"
                  max={classes.find(c => c.id === formData.classId)?.totalSpots || 100}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Max capacity: {classes.find(c => c.id === formData.classId)?.totalSpots || 0} spots
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end space-x-3 rounded-b-xl">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>{editingSession ? 'Update' : 'Create'} Session</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <ConfirmModal
          title="Delete Session"
          message="Are you sure you want to delete this session? This action cannot be undone."
          confirmText="Delete"
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      {snackbar && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </div>
  );
}
