import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext.tsx';
import ClassCard from './ClassCard';

export default function ClassesPreview() {
    const { classes, loading } = useData();
    const previewClasses = classes.slice(0, 3);

    if (loading) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Upcoming Classes
                    </h2>
                    <p className="text-xl text-gray-600">
                        Popular classes filling up fast. Reserve your spot now.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {previewClasses.map((classItem) => (
                        <ClassCard key={classItem.id} classItem={classItem} />
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        to="/classes"
                        className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-semibold text-lg group"
                    >
                        <span>View All Classes</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
