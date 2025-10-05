import React, { useState, useMemo, createContext, useContext, useCallback } from 'react';
import { Search, Star, Clock, Calendar, User, MapPin, DollarSign, Briefcase, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

// --- Global Setup (Mocks for Single File Execution) ---
const AuthContext = createContext({ user: null as any, loading: false });
const DataContext = createContext({
  getBookingsByUserId: () => [] as any[],
  caregivers: [] as Caregiver[],
  addBooking: (booking: Booking) => {},
});

// Mock Hook Implementations
const useAuth = () => useContext(AuthContext);
const useData = () => useContext(DataContext);

// --- Caregiver & Booking Types ---
interface Caregiver {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  serviceType: string;
  location: string;
  yearsExperience: number;
  services: string[];
  pricePerHour: number;
  dailyRate: number;
  weeklyRate: number;
  description: string;
}

interface Booking {
  id: number;
  caregiverName: string;
  date: string;
  status: 'confirmed' | 'completed';
  totalAmount: number;
}

// --- Mock Data ---
const MOCK_CAREGIVERS: Caregiver[] = [
  {
    id: 'cg1',
    name: 'Asha Kumari',
    rating: 4.8,
    reviews: 24,
    serviceType: 'Nursing',
    location: 'Mumbai, Maharashtra',
    yearsExperience: 5,
    services: ['ICU Care', 'Post-operative Care', 'Wound Dressing'],
    pricePerHour: 300,
    dailyRate: 2000,
    weeklyRate: 12000,
    description: 'Experienced nurse with expertise in critical care, patient rehabilitation, and basic physical therapy. Fluent in Hindi and Marathi.',
  },
  {
    id: 'cg2',
    name: 'Prakash Singh',
    rating: 4.5,
    reviews: 15,
    serviceType: 'Elder Care',
    location: 'Pune, Maharashtra',
    yearsExperience: 8,
    services: ['Companionship', 'Dementia Support', 'Medication Management'],
    pricePerHour: 250,
    dailyRate: 1800,
    weeklyRate: 11000,
    description: 'Caring male attendant specializing in elder care. Focuses on daily activities support and emotional well-being. Available for full-day bookings.',
  },
  {
    id: 'cg3',
    name: 'Sita Menon',
    rating: 4.9,
    reviews: 42,
    serviceType: 'Physiotherapy',
    location: 'Bangalore, Karnataka',
    yearsExperience: 12,
    services: ['Joint Pain', 'Stroke Rehab', 'Sports Injury'],
    pricePerHour: 550,
    dailyRate: 3500,
    weeklyRate: 21000,
    description: 'Highly-rated physiotherapist with a Master’s degree. Provides personalized home sessions using the latest therapeutic techniques.',
  },
];

const MOCK_USER = { id: 'cust1', fullName: 'Rajesh Verma', profileComplete: true };
const MOCK_BOOKINGS: Booking[] = [
  { id: 1, caregiverName: 'Sita Menon', date: '2024-08-15', status: 'completed', totalAmount: 2500 },
  { id: 2, caregiverName: 'Prakash Singh', date: '2024-09-01', status: 'confirmed', totalAmount: 1800 },
  { id: 3, caregiverName: 'Asha Kumari', date: '2024-09-20', status: 'completed', totalAmount: 4000 },
  { id: 4, caregiverName: 'Sita Menon', date: '2024-10-10', status: 'confirmed', totalAmount: 3500 },
];

// --- CaregiverCard ---
interface CaregiverCardProps {
  caregiver: Caregiver;
}

const CaregiverCard: React.FC<CaregiverCardProps> = ({ caregiver }) => {
  const [showDescription, setShowDescription] = useState(false);
  const { addBooking } = useData();

  const getAvatarLetter = (name: string) => name ? name.charAt(0).toUpperCase() : 'C';

  const handleBookNow = () => {
    const newBooking: Booking = {
      id: Math.floor(Math.random() * 10000),
      caregiverName: caregiver.name,
      date: new Date().toISOString().split('T')[0],
      status: 'confirmed',
      totalAmount: caregiver.dailyRate,
    };
    addBooking(newBooking);
    alert(`Booked ${caregiver.name} successfully!`);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-shadow hover:shadow-xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left */}
        <div className="flex flex-col items-center md:items-start w-full md:w-1/4">
          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-semibold mb-3 shadow-md">
            {getAvatarLetter(caregiver.name)}
          </div>
          <p className="text-xl font-bold text-gray-800 text-center md:text-left">{caregiver.name}</p>
          <p className="text-sm text-blue-600 font-medium">{caregiver.serviceType}</p>
          <div className="flex items-center text-sm text-yellow-500 mt-2">
            <Star className="w-4 h-4 mr-1 fill-current" />
            <span className="font-semibold">{caregiver.rating}</span>
            <span className="text-gray-500 ml-1">({caregiver.reviews} reviews)</span>
          </div>
        </div>

        {/* Center */}
        <div className="flex-1 space-y-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-red-500" />
            <span>{caregiver.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="w-4 h-4 mr-2 text-green-500" />
            <span>{caregiver.yearsExperience} Years Experience</span>
          </div>
          <div className="flex items-center text-sm text-green-600 font-semibold">
            <CheckCircle className="w-4 h-4 mr-2" />
            Verified
          </div>
          <div className="pt-2">
            <h4 className="text-xs font-semibold uppercase text-gray-500">Rate (Hourly)</h4>
            <p className="text-2xl font-bold text-gray-900 flex items-center">
              <DollarSign className="w-5 h-5 mr-1" />
              {caregiver.pricePerHour.toLocaleString()}
              <span className="text-sm font-normal text-gray-500 ml-1">/ hr</span>
            </p>
          </div>
        </div>

        {/* Right: Booking */}
        <div className="w-full md:w-auto flex flex-col justify-end">
          <button
            onClick={handleBookNow}
            className="w-full md:w-48 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Services & Description */}
      <div className="mt-4 border-t border-gray-100 pt-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {caregiver.services.map((service, index) => (
            <span key={index} className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">{service}</span>
          ))}
        </div>
        <button
          onClick={() => setShowDescription(!showDescription)}
          className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mt-2 focus:outline-none"
        >
          {showDescription ? 'Hide Description' : 'View Description'}
          {showDescription ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
        </button>
        {showDescription && (
          <p className="mt-3 p-4 bg-gray-50 text-gray-700 rounded-lg text-sm italic border-l-4 border-blue-500">
            {caregiver.description}
          </p>
        )}
      </div>
    </div>
  );
};

// --- Customer Booking Page ---
const CustomerBookingPage: React.FC = () => {
  const { caregivers } = useData();
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  const [locationSearchTerm, setLocationSearchTerm] = useState('');

  const filteredCaregivers = useMemo(() => {
    const lowerService = serviceSearchTerm.toLowerCase();
    const lowerLocation = locationSearchTerm.toLowerCase();

    return caregivers.filter((cg) => {
      const serviceMatch =
        !serviceSearchTerm ||
        cg.name.toLowerCase().includes(lowerService) ||
        cg.serviceType.toLowerCase().includes(lowerService) ||
        cg.services.some((service) => service.toLowerCase().includes(lowerService)) ||
        cg.description.toLowerCase().includes(lowerService);

      const locationMatch = !locationSearchTerm || cg.location.toLowerCase().includes(lowerLocation);

      return serviceMatch && locationMatch;
    });
  }, [caregivers, serviceSearchTerm, locationSearchTerm]);

  return (
    <div className="space-y-8 px-4 md:px-0">
      <h2 className="text-3xl font-bold text-gray-800">Search Caregivers</h2>

      {/* Search Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by service type, name, or skill..."
            value={serviceSearchTerm}
            onChange={(e) => setServiceSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Filter by city or state (e.g., Pune)"
            value={locationSearchTerm}
            onChange={(e) => setLocationSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Caregiver List */}
      {filteredCaregivers.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredCaregivers.map((caregiver) => (
            <CaregiverCard key={caregiver.id} caregiver={caregiver} />
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-white rounded-xl shadow-inner">
          <p className="text-xl font-medium text-gray-500">No caregivers found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

// --- Booking History ---
interface BookingHistoryProps {
  bookings: Booking[];
}

const BookingHistory: React.FC<BookingHistoryProps> = ({ bookings }) => {
  const upcomingBookings = bookings.filter(b => b.status === 'confirmed');
  const pastBookings = bookings.filter(b => b.status === 'completed');

  const BookingItem: React.FC<{ booking: Booking }> = ({ booking }) => (
    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm mb-3 border-l-4 border-blue-500">
      <div>
        <p className="font-semibold text-gray-800">{booking.caregiverName} ({booking.status === 'confirmed' ? 'Confirmed' : 'Completed'})</p>
        <p className="text-sm text-gray-500">
          <Calendar className="w-3 h-3 inline mr-1" />
          {booking.date} | Total: ₹{booking.totalAmount.toLocaleString()}
        </p>
      </div>
      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none">
        View Details
      </button>
    </div>
  );

  if (bookings.length === 0) {
    return (
      <div className="text-center p-12 bg-white rounded-xl shadow-md">
        <p className="text-xl font-medium text-gray-500">You have no recorded bookings.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-white rounded-xl shadow-md space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">My Bookings</h2>

      {/* Upcoming */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-blue-700 border-b pb-2">Upcoming Bookings ({upcomingBookings.length})</h3>
        {upcomingBookings.length > 0 ? (
          upcomingBookings.map(b => <BookingItem key={b.id} booking={b} />)
        ) : (
          <p className="text-gray-500 italic p-3 bg-gray-50 rounded-lg">No upcoming confirmed bookings.</p>
        )}
      </div>

      {/* Past */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-700 border-b pb-2">Past Bookings ({pastBookings.length})</h3>
        {pastBookings.length > 0 ? (
          pastBookings.map(b => <BookingItem key={b.id} booking={b} />)
        ) : (
          <p className="text-gray-500 italic p-3 bg-gray-50 rounded-lg">No completed bookings yet.</p>
        )}
      </div>
    </div>
  );
};

// --- Profile Setup ---
const ProfileSetup = () => (
  <div className="p-4 md:p-8 bg-blue-50 min-h-screen flex items-center justify-center">
    <div className="text-center p-8 bg-white shadow-xl rounded-xl max-w-lg w-full">
      <h2 className="text-3xl font-bold text-blue-700">Complete Your Profile</h2>
      <p className="mt-4 text-gray-600">Please finish setting up your profile to access the dashboard and start booking care.</p>
      <button className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300">
          Go to Profile Setup
      </button>
    </div>
  </div>
);

// --- Customer Dashboard ---
const CustomerDashboard = () => {
  const { user } = useAuth();
  const actualUser = user || MOCK_USER;
  const [activeTab, setActiveTab] = useState<'search' | 'bookings' | 'profile'>('search');
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
  };

  const stats = useMemo(() => {
    const upcoming = bookings.filter(b => b.status === 'confirmed');
    const completed = bookings.filter(b => b.status === 'completed');

    return [
      { title: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'bg-blue-500' },
      { title: 'Upcoming', value: upcoming.length, icon: Clock, color: 'bg-green-500' },
      { title: 'Completed', value: completed.length, icon: Star, color: 'bg-purple-500' },
      { title: 'Total Spent', value: `₹${completed.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}`, icon: DollarSign, color: 'bg-orange-500' },
    ];
  }, [bookings]);

  const TabButton = useCallback(({ tab, currentTab, icon: Icon, label }: { tab: typeof activeTab, currentTab: typeof activeTab, icon: React.FC<any>, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex-1 flex flex-col items-center justify-center py-3 px-1 text-sm font-medium border-b-2 transition-colors duration-200 focus:outline-none ${
        currentTab === tab
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      <Icon className="w-5 h-5 mb-1" />
      {label}
    </button>
  ), []);

  if (!actualUser?.profileComplete) return <ProfileSetup />;

  return (
    <DataContext.Provider value={{ getBookingsByUserId: () => bookings, caregivers: MOCK_CAREGIVERS, addBooking }}>
      <div className="flex-1 max-w-7xl mx-auto md:px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen font-sans">
        {/* Greeting */}
        <div className="px-4 md:px-0 mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome, {actualUser.fullName}</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`p-4 bg-white rounded-xl shadow-md flex flex-col items-center justify-center`}>
              <stat.icon className="w-6 h-6 mb-2 text-white p-1 rounded-full" style={{ backgroundColor: stat.color.split(' ')[0] }} />
              <p className="text-lg font-semibold">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="flex border-b border-gray-200">
            <TabButton tab="search" currentTab={activeTab} icon={Search} label="Search Caregivers" />
            <TabButton tab="bookings" currentTab={activeTab} icon={Calendar} label="Booking History" />
            <TabButton tab="profile" currentTab={activeTab} icon={User} label="Profile Setup" />
          </div>

          <div className="p-6">
            {activeTab === 'search' && <CustomerBookingPage />}
            {activeTab === 'bookings' && <BookingHistory bookings={bookings} />}
            {activeTab === 'profile' && <ProfileSetup />}
          </div>
        </div>
      </div>
    </DataContext.Provider>
  );
};

// --- Export ---
export default CustomerDashboard;
