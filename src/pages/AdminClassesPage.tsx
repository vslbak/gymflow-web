import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api/apiFactory';
import type { GymFlowClass } from '../types';
import type { CreateClassRequest, UpdateClassRequest } from '../api/base';
import PageHeader from '../components/common/PageHeader';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ConfirmModal from '../components/common/ConfirmModal';
import Snackbar from '../components/common/Snackbar';
import { parseIsoDuration, formatToIsoDuration, formatDurationDisplay } from '../utils/durationParser';

export default function AdminClassesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<GymFlowClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<GymFlowClass | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState<CreateClassRequest>({
    name: '',
    instructor: '',
    duration: '',
    totalSpots: 0,
    imageUrl: '',
    category: '',
    level: '',
    location: '',
    description: '',
    price: 0,
    classTime: '',
    daysOfWeek: [],
    whatToBring: [],
  });

  const [durationMinutes, setDurationMinutes] = useState<number>(60);

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    fetchClasses();
  }, [user, navigate]);

  const fetchClasses = async () => {
    try {
      const res = await api.getClasses();
      if (res.success && res.data) {
        setClasses(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingClass(null);
    setDurationMinutes(60);
    setFormData({
      name: '',
      instructor: '',
      duration: 'PT1H',
      totalSpots: 20,
      imageUrl: 'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Cardio',
      level: 'All Levels',
      location: 'Main Gym Floor',
      description: '',
      price: 25,
      classTime: '09:00',
      daysOfWeek: [],
      whatToBring: [],
    });
    setShowModal(true);
  };

  const handleOpenEdit = (cls: GymFlowClass) => {
    setEditingClass(cls);
    const parsedMinutes = parseIsoDuration(cls.duration);
    setDurationMinutes(parsedMinutes);
    const newFormData = {
      name: cls.name,
      instructor: cls.instructor,
      duration: cls.duration,
      totalSpots: cls.totalSpots,
      imageUrl: cls.imageUrl,
      category: cls.category,
      level: cls.level,
      location: cls.location,
      description: cls.description,
      price: cls.price,
      classTime: cls.classTime || '09:00',
      daysOfWeek: cls.daysOfWeek || [],
      whatToBring: cls.whatToBring || [],
    };
    setFormData(newFormData);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const dataToSave = {
        ...formData,
        duration: formatToIsoDuration(durationMinutes),
      };

      if (editingClass) {
        const updateData: UpdateClassRequest = {
          id: editingClass.id,
          ...dataToSave,
        };
        const res = await api.updateClass(updateData);
        if (res.success && res.data) {
          setSnackbar({ message: 'Class updated successfully', type: 'success' });
          setClasses(classes.map(cls => cls.id === res.data!.id ? res.data! : cls));
        } else {
          setSnackbar({ message: res.error || 'Failed to update class', type: 'error' });
        }
      } else {
        const res = await api.createClass(dataToSave);
        if (res.success && res.data) {
          setSnackbar({ message: 'Class created successfully', type: 'success' });
          setClasses([...classes, res.data]);
        } else {
          setSnackbar({ message: res.error || 'Failed to create class', type: 'error' });
        }
      }
      setShowModal(false);
    } catch (err) {
      setSnackbar({ message: 'An error occurred', type: 'error' });
    }
  };

  const handleDelete = async (classId: string) => {
    try {
      const res = await api.deleteClass(classId);
      if (res.success) {
        setSnackbar({ message: 'Class deleted successfully', type: 'success' });
        setClasses(classes.filter(cls => cls.id !== classId));
      } else {
        setSnackbar({ message: res.error || 'Failed to delete class', type: 'error' });
      }
    } catch (err) {
      setSnackbar({ message: 'An error occurred', type: 'error' });
    }
    setDeleteConfirm(null);
  };

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
        <div className="flex items-center justify-between mb-8">
          <PageHeader
            title="Manage Classes"
            subtitle="Create, edit, and manage your gym classes"
          />
          <button
            onClick={handleOpenCreate}
            className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            <span>Add Class</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src={cls.imageUrl}
                alt={cls.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{cls.name}</h3>
                    <p className="text-sm text-gray-600">{cls.instructor}</p>
                  </div>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {cls.category}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-semibold text-gray-900">{cls.classTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold text-gray-900">{cls.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-semibold text-gray-900">{cls.totalSpots} spots</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-green-600">${cls.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Level:</span>
                    <span className="font-semibold text-gray-900">{cls.level}</span>
                  </div>
                </div>

                {cls.daysOfWeek && cls.daysOfWeek.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Schedule:</p>
                    <div className="flex flex-wrap gap-1">
                      {cls.daysOfWeek.map((day) => (
                        <span
                          key={day}
                          className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded"
                        >
                          {day.slice(0, 3)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenEdit(cls)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(cls.id)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div key={editingClass?.id || 'new'} className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingClass ? 'Edit Class' : 'Create New Class'}
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
                  Class Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Power Yoga Flow"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Instructor
                  </label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Sarah Mitchell"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration: {formatDurationDisplay(durationMinutes)}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="180"
                    step="5"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5m</span>
                    <span>180m</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Spots
                  </label>
                  <input
                    type="number"
                    value={formData.totalSpots}
                    onChange={(e) => setFormData({ ...formData, totalSpots: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>All Levels</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option>Yoga</option>
                    <option>Cardio</option>
                    <option>Strength</option>
                    <option>Pilates</option>
                    <option>Boxing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Studio A, 2nd Floor"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://images.pexels.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Describe the class..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Class Time
                  </label>
                  <input
                    type="time"
                    value={formData.classTime}
                    onChange={(e) => setFormData({ ...formData, classTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Days of Week
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                      const dayUpper = day.toUpperCase();
                      const isChecked = formData.daysOfWeek?.some(d => d.toUpperCase() === dayUpper) || false;
                      return (
                        <label key={day} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const currentDays = formData.daysOfWeek || [];
                              if (e.target.checked) {
                                setFormData({ ...formData, daysOfWeek: [...currentDays, dayUpper] });
                              } else {
                                setFormData({ ...formData, daysOfWeek: currentDays.filter(d => d !== dayUpper) });
                              }
                            }}
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700">{day.slice(0, 3)}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What to Bring (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.whatToBring.join(', ')}
                  onChange={(e) => setFormData({ ...formData, whatToBring: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Yoga mat, Water bottle, Towel"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
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
                <span>{editingClass ? 'Update' : 'Create'} Class</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <ConfirmModal
          title="Delete Class"
          message="Are you sure you want to delete this class? This will also delete all associated sessions."
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
