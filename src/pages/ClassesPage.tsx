import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { useData } from '../contexts/DataContext.tsx';
import PageHeader from '../components/common/PageHeader';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ClassCard from '../components/classes/ClassCard';

export default function ClassesPage() {
    const { classes, loading } = useData();
    const [filter, setFilter] = useState('All Categories');

    const filteredClasses = filter === 'All Categories'
        ? classes
        : classes.filter(c => c.category === filter);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16">
                <PageHeader
                    title="All Classes"
                    subtitle="Discover our full range of fitness classes and find your perfect workout"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <LoadingSkeleton type="cards" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            <PageHeader
                title="All Classes"
                subtitle="Discover our full range of fitness classes and find your perfect workout"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <Calendar className="h-6 w-6 text-gray-600" />
                        <span className="text-lg text-gray-700 font-medium">
              Showing {filteredClasses.length} classes
            </span>
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white cursor-pointer"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 0.5rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1.5em 1.5em',
                        }}
                    >
                        <option>All Categories</option>
                        <option>Yoga</option>
                        <option>Cardio</option>
                        <option>Strength</option>
                        <option>Pilates</option>
                        <option>Boxing</option>
                    </select>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredClasses.map((classItem) => (
                        <ClassCard key={classItem.id} classItem={classItem} />
                    ))}
                </div>
            </div>
        </div>
    );
}
