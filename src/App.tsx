import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Navbar from './components/layout/Navbar';
import Hero from './components/layout/Hero';
import Features from './components/layout/Features';
import ClassesPreview from './components/classes/ClassesPreview';
import Footer from './components/layout/Footer';
import ClassesPage from './pages/ClassesPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ClassPage from './pages/ClassPage';
import DashboardPage from './pages/DashboardPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import AdminDashboardLayout from './pages/AdminDashboardLayout';

function HomePage() {
    return (
        <>
            <Hero />
            <Features />
            <ClassesPreview />
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <DataProvider>
                <div className="min-h-screen bg-white">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/classes" element={<ClassesPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/class/:id" element={<ClassPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/classes/manage" element={<AdminDashboardLayout />} />
                        <Route path="/classes/manage/classes" element={<AdminDashboardLayout />} />
                        <Route path="/schedule" element={<ClassesPage />} />
                        <Route path="/booking/success" element={<BookingSuccessPage />} />
                    </Routes>
                    <Footer />
                </div>
            </DataProvider>
        </AuthProvider>
    );
}

export default App;
