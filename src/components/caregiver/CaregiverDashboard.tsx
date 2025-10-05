import React, { useState, useMemo, createContext, useContext, useCallback } from 'react';
import { 
    Calendar, DollarSign, Star, User, Bell, Settings, BookOpen, TrendingUp,
    ChevronRight, Clock, Briefcase, CheckCircle, XCircle, Globe 
} from 'lucide-react';

// --- MOCKED DATA AND CONTEXTS (For self-contained runnable code) ---

// 1. Typescript Interfaces
interface User {
    id: string;
    fullName: string;
    email: string;
}

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface Booking {
    id: string;
    customerName: string;
    serviceType: string;
    startDate: string;
    totalAmount: number;
    status: BookingStatus;
}

// 2. Mock Context Hooks
const useAuth = () => ({
    user: { id: 'user-caregiver-123', fullName: 'Priya Sharma', email: 'priya@example.com' } as User,
});

const mockBookings: Booking[] = [
    { id: 'b1', customerName: 'Rajesh Kumar', serviceType: 'Elder Care (Full Day)', startDate: '2025-10-05', totalAmount: 4500, status: 'pending' },
    { id: 'b2', customerName: 'Aisha Singh', serviceType: 'Child Care (Evening)', startDate: '2025-10-01', totalAmount: 2200, status: 'confirmed' },
    { id: 'b3', customerName: 'Vikas Gupta', serviceType: 'Post-Surgery Assistance', startDate: '2025-09-28', totalAmount: 8000, status: 'completed' },
    { id: 'b4', customerName: 'Sonia Mehta', serviceType: 'Special Needs Care', startDate: '2025-09-25', totalAmount: 3500, status: 'cancelled' },
    { id: 'b5', customerName: 'Gaurav Jain', serviceType: 'Elder Care (Half Day)', startDate: '2025-10-10', totalAmount: 1800, status: 'pending' },
];

const useData = () => ({
    getBookingsByUserId: (userId: string, role: 'caregiver' | 'customer') => mockBookings,
});

// --- COMPONENT START ---

const CaregiverDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    
    const { user } = useAuth();
    const { getBookingsByUserId } = useData();
    
    // --- Data Calculation ---
    const bookings = getBookingsByUserId(user?.id || '', 'caregiver');
    const pendingBookings = bookings.filter(b => b.status === 'pending');
    const completedBookings = bookings.filter(b => b.status === 'completed');
    // FIX: Added explicit type annotations to reduce function for clarity
    const totalEarnings = completedBookings.reduce((sum: number, booking: Booking) => sum + booking.totalAmount, 0); 
    const averageRating = 4.8; // Mocked value

    const stats = [
        {
            id: 'bookings',
            title: 'Total Bookings',
            value: bookings.length,
            icon: Calendar,
            color: 'bg-indigo-600',
            shadow: 'shadow-indigo-200'
        },
        {
            id: 'pending',
            title: 'Pending Requests',
            value: pendingBookings.length,
            icon: Bell,
            color: 'bg-yellow-500',
            shadow: 'shadow-yellow-200'
        },
        {
            id: 'earnings',
            title: 'Total Earnings',
            value: `₹${totalEarnings.toLocaleString()}`,
            icon: DollarSign,
            color: 'bg-green-600',
            shadow: 'shadow-green-200'
        },
        {
            id: 'rating',
            title: 'Avg. Rating',
            value: averageRating.toFixed(1),
            icon: Star,
            color: 'bg-pink-500',
            shadow: 'shadow-pink-200'
        }
    ];
    
    // Helper to render the status badge consistently
    const getStatusBadge = (status: Booking['status']) => {
        let text = '';
        let Icon = Briefcase; // Default icon
        let colorClasses = '';

        switch (status) {
            case 'pending':
                text = 'Pending';
                Icon = Clock;
                colorClasses = 'bg-yellow-100 text-yellow-800';
                break;
            case 'confirmed':
                text = 'Confirmed';
                Icon = Briefcase;
                colorClasses = 'bg-blue-100 text-blue-800';
                break;
            case 'completed':
                text = 'Completed';
                Icon = CheckCircle;
                colorClasses = 'bg-green-100 text-green-800';
                break;
            case 'cancelled':
            default:
                text = 'Cancelled';
                Icon = XCircle;
                colorClasses = 'bg-red-100 text-red-800';
                break;
        }
        return <span className={`text-xs font-medium px-3 py-1 rounded-full flex items-center ${colorClasses}`}><Icon className='w-3 h-3 mr-1'/> {text}</span>;
    };

    const renderOverview = () => (
        <div className="space-y-8">
            {/* Stat Cards - Enhanced UI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div 
                        key={index} 
                        className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 p-6 border-b-4 ${stat.color.replace('bg-', 'border-')}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                                <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
                            </div>
                            <div className={`p-4 rounded-full bg-opacity-90 shadow-lg ${stat.color} ${stat.shadow}`}>
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        {stat.id === 'rating' && (
                            <div className="mt-4 flex items-center text-yellow-500">
                                {/* Mocked 4.5 star rating visualization */}
                                <Star className='h-4 w-4 fill-yellow-500 mr-1'/>
                                <Star className='h-4 w-4 fill-yellow-500 mr-1'/>
                                <Star className='h-4 w-4 fill-yellow-500 mr-1'/>
                                <Star className='h-4 w-4 fill-yellow-500 mr-1'/>
                                <Star className='h-4 w-4 text-gray-300'/>
                                <span className='ml-2 text-sm font-semibold text-gray-700'>(12 Reviews)</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Recent Bookings and Earnings - Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Recent Bookings - 2/3 column width */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-2xl border border-gray-100">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center"><BookOpen className='w-5 h-5 mr-2 text-indigo-500'/> Recent Bookings</h3>
                        <button 
                            onClick={() => setActiveTab('bookings')}
                            className='text-sm text-indigo-600 font-semibold hover:text-indigo-800 flex items-center transition-colors'
                        >
                            View All <ChevronRight className='w-4 h-4 ml-1'/> 
                        </button>
                    </div>
                    <div className="p-4">
                        {bookings.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No recent bookings found. Check back later!</p>
                        ) : (
                            <div className="space-y-3">
                                {bookings.slice(0, 4).map((booking) => (
                                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg transition-shadow hover:shadow-lg border border-gray-100">
                                        <div className='flex items-center space-x-3'>
                                            <div className='p-3 bg-blue-100 text-blue-600 rounded-xl'>
                                                <Calendar className='w-5 h-5'/>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-base">{booking.customerName}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{booking.serviceType} &bull; {booking.startDate}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="text-right flex items-center space-x-4">
                                            <p className="font-bold text-lg text-gray-800">₹{booking.totalAmount.toLocaleString()}</p>
                                            {getStatusBadge(booking.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Earnings Overview - 1/3 column width */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-2xl border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center"><DollarSign className='w-5 h-5 mr-2 text-green-600'/> Earnings Snapshot</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex flex-col p-4 bg-green-50 border border-green-300 rounded-xl shadow-inner">
                            <span className="text-sm text-green-700 font-medium">Total Lifetime Earnings</span>
                            <span className="text-4xl font-extrabold text-green-900 mt-1">₹{totalEarnings.toLocaleString()}</span>
                        </div>
                        <div className="space-y-3 pt-2 text-gray-700">
                            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                <span className="text-base font-medium">This Month</span>
                                <span className="font-bold text-gray-900">₹{Math.floor(totalEarnings * 0.3).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                <span className="text-base font-medium">Completed Jobs</span>
                                <span className="font-bold text-gray-900">{completedBookings.length}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-base font-medium text-indigo-600">Potential Income</span>
                                <span className="font-bold text-indigo-900">₹{pendingBookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderBookings = () => (
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100">
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 flex items-center"><Calendar className='w-5 h-5 mr-2 text-indigo-500'/> All Service Bookings</h3>
            </div>
            <div className="overflow-x-auto">
                {bookings.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">You have no bookings yet.</p>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Service
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className='hover:bg-indigo-50 transition-colors'>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-700">{booking.serviceType}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-700">{booking.startDate}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-gray-900">₹{booking.totalAmount.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(booking.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {booking.status === 'pending' && (
                                            <button className="text-green-600 hover:text-green-800 mr-3 font-semibold transition-colors bg-green-100 px-3 py-1 rounded-md shadow-sm">
                                                Accept
                                            </button>
                                        )}
                                        <button className="text-indigo-600 hover:text-indigo-900 font-medium transition-colors">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
    
    const renderProfile = () => (
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center"><User className='w-6 h-6 mr-2 text-indigo-500'/> Profile Management</h3>
            <p className="text-gray-600 border-t border-gray-100 pt-4">Update your personal and professional details for better matching.</p>
            <div className='mt-6 space-y-4'>
                <div className='p-4 bg-yellow-50 border border-yellow-300 rounded-xl flex justify-between items-center cursor-pointer hover:bg-yellow-100 transition-colors shadow-md'>
                    <p className='text-yellow-800 font-semibold flex items-center'><Settings className='w-5 h-5 mr-2'/> Update Credentials</p>
                    <ChevronRight className='w-5 h-5 text-yellow-600'/>
                </div>
                <div className='p-4 bg-red-50 border border-red-300 rounded-xl flex justify-between items-center cursor-pointer hover:bg-red-100 transition-colors shadow-md'>
                    <p className='text-red-800 font-semibold flex items-center'><DollarSign className='w-5 h-5 mr-2'/> Payment & Payout Verification</p>
                    <ChevronRight className='w-5 h-5 text-red-600'/>
                </div>
            </div>
        </div>
    );

    const tabs = [
        { id: 'overview', name: 'Dashboard', icon: TrendingUp },
        { id: 'bookings', name: 'My Bookings', icon: Calendar },
        { id: 'earnings', name: 'My Earnings', icon: DollarSign },
        { id: 'profile', name: 'Profile & Settings', icon: User },
    ];
    
    const renderDesktopSidebar = () => (
        <div className="hidden lg:block w-64 bg-white shadow-xl h-screen fixed top-0 left-0 border-r border-gray-100 z-30">
            <div className="p-6">
                <h2 className="text-2xl font-extrabold text-indigo-700 flex items-center">
                    <Briefcase className="w-6 h-6 mr-2 text-indigo-500" /> CareConnect
                </h2>
            </div>
            <nav className="flex flex-col space-y-2 px-4 mt-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-4 py-3 text-base font-semibold rounded-xl transition-all duration-200 w-full text-left ${
                            activeTab === tab.id
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-300'
                                : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
                        }`}
                    >
                        <tab.icon className="h-5 w-5 mr-3" />
                        {tab.name}
                    </button>
                ))}
            </nav>
            <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">© 2024 CareConnect. All rights reserved</p>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
            case 'earnings':
                return renderOverview();
            case 'bookings':
                return renderBookings();
            case 'profile':
                return renderProfile();
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            
            {/* Desktop Sidebar (Left-hand navigation) */}
            {renderDesktopSidebar()}

            {/* Main Content Wrapper - Shifted left by the sidebar width on large screens */}
            <div className="lg:pl-64">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    
                    {/* Header Section */}
                    <div className="mb-10 border-b border-gray-200 pb-4 flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-900">
                                Welcome, <span className='text-indigo-600'>{user?.fullName || 'Caregiver'}</span>!
                            </h1>
                            <p className="text-gray-500 mt-2 text-lg">
                                Manage your services, requests, and earnings here.
                            </p>
                        </div>

                        {/* Language Button was here, now removed */}
                    </div>

                    {/* Mobile Tab Navigation - Hidden on large screens */}
                    <div className="mb-10 lg:hidden bg-gray-50 pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6 border-b border-gray-200">
                        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto whitespace-nowrap">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center px-4 py-3 text-base font-semibold rounded-xl transition-all duration-200 ${
                                        activeTab === tab.id
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300 transform scale-[1.02]'
                                            : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
                                    }`}
                                >
                                    <tab.icon className="h-5 w-5 mr-2" />
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className='pt-2'>
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaregiverDashboard;
