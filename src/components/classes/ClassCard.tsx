import { Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { GymFlowClass } from '../../types';
import { formatDuration } from '../../utils/formatDuration';

interface ClassCardProps {
    classItem: GymFlowClass;
}

export default function ClassCard({ classItem }: ClassCardProps) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={classItem.imageUrl}
                    alt={classItem.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 right-4">
          <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {classItem.category}
          </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-xl font-bold mb-1">
                        {classItem.name}
                    </h3>
                    <p className="text-gray-200 text-sm">{classItem.instructor}</p>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {classItem.level}
          </span>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                        <Clock className="h-5 w-5 mr-2 text-orange-600" />
                        <span>{formatDuration(classItem.duration)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                        <span>{classItem.location}</span>
                    </div>
                </div>

                <Link
                    to={`/class/${classItem.id}`}
                    className="block w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-md hover:shadow-lg text-center"
                >
                    Book Now
                </Link>
            </div>
        </div>
    );
}
