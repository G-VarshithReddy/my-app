import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./Landing";
import Gallery from "./Gallery";
import ContactPage from "./ContactPage";
import Event from "./Event";
import ViewCustomers from "./ViewCustomers";
import Admin from "./Admin";
import Events from "./Events";
import RegisterAdmin from "./RegisterAdmin";
import AddCategory from './AddCategory';
import AddEvent from "./AddEvent";
import EventBookings from "./EventBookings";
import Logout from "./Logout";
import AdminSign from "./adminsign";
import UpdateEvent from "./UpdateEvent";
import UserSignIn from "./UserSignIn";
import RegisterEvent from "./RegisterEvent";
import Categories from "./Categories";
import UpdateCategory from "./UpdateCategory";
import UserSignup from './UserSignup';
import CustomerDashboard from './CustomerDashboard';
import Messages from './Messages';
import Venues from './Venues';
import ManageVenues from './ManageVenues';
import ManageVenueBookings from './ManageVenueBookings';
import CustomerVenues from "./CustomerVenues";
import VenueRegistration from './VenueRegistration';
import CustomerBookingDetails from './CustomerBookingDetails';
import MyProfile from './MyProfile';
import CustomerBudgetTracking from './CustomerBudgetTracking';
import BudgetTracking from './BudgetTracking';
import EventManagement from './EventManagement';
import Payment from './Payment';
import PrivateRoute from './components/PrivateRoute';
import MyBookings from './MyBookings';
import PayNow from './PayNow';
import VenuePayment from './VenuePayment';
import VenuePayNow from './VenuePayNow';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/Event" element={<Event />} />
          <Route path="/customer" element={<ViewCustomers />} />
          <Route path="/admin-sign" element={<AdminSign />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/events" element={<Events />} />
          <Route path="/register-admin" element={<RegisterAdmin />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/all-categories" element={<Categories />} />
          <Route path="/view-categories" element={<Categories />} />
          <Route path="/add-event" element={<AddEvent />} />
          <Route path="/event-bookings" element={<EventBookings />} />
          <Route path="/view-customers" element={<ViewCustomers />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/event/:id" element={<UpdateEvent />} />
          <Route path="/user-signin" element={<UserSignIn />} />
          <Route path="/register-event/:id" element={<RegisterEvent />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/update/:id" element={<UpdateCategory />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/customer-dashboard" element={<PrivateRoute><CustomerDashboard /></PrivateRoute>} />
          <Route path="/customer/profile" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
          <Route path="/customer/booking-details" element={<PrivateRoute><CustomerBookingDetails /></PrivateRoute>} />
          <Route path="/customer/budget-tracking" element={<CustomerBudgetTracking />} />
          <Route path="/venues" element={<PrivateRoute><Venues /></PrivateRoute>} />
          <Route path="/manage-venues" element={<ManageVenues />} />
          <Route path="/manage-venue-bookings" element={<ManageVenueBookings />} />
          <Route path="/customer-venues" element={<CustomerVenues />} />
          <Route path="/venue-registration/:venueId" element={<PrivateRoute><VenueRegistration /></PrivateRoute>} />
          <Route path="/budget-tracking" element={<BudgetTracking />} />
          <Route path="/event-management" element={<EventManagement />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payNow" element={<PayNow />} />
          <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
          <Route path="/venue-payment" element={<PrivateRoute><VenuePayment /></PrivateRoute>} />
          <Route path="/venue-paynow" element={<PrivateRoute><VenuePayNow /></PrivateRoute>} />
          <Route path="/" element={<Events />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
