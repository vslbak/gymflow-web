import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../api/apiFactory';
import type { GymFlowClass } from '../types';

interface DataContextType {
    classes: GymFlowClass[];
    loading: boolean;
    error: string | null;
    getClassById: (id: string) => GymFlowClass | undefined;
    refreshClasses: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    const [classes, setClasses] = useState<GymFlowClass[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClasses = async () => {
        try {
            const response = await api.getClasses();
            if (response.success && response.data) {
                setClasses(response.data);
                setError(null);
            } else {
                setError(response.error || 'Failed to load classes');
            }
        } catch (err) {
            setError('Failed to load classes');
            console.error('Failed to fetch classes:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const getClassById = (id: string) => {
        return classes.find(c => c.id === id);
    };

    const refreshClasses = async () => {
        setLoading(true);
        await fetchClasses();
    };

    return (
        <DataContext.Provider value={{ classes, loading, error, getClassById, refreshClasses }}>
    {children}
    </DataContext.Provider>
);
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
