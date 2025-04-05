import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import './CustomerBudgetTracking.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

const CustomerBudgetTracking = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: '',
    price: '',
    tickets: '',
  });

  useEffect(() => {
    const savedEvents = localStorage.getItem('customerEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.name || !newEvent.price || !newEvent.tickets) {
      alert('Please fill in all fields');
      return;
    }

    const event = {
      id: Date.now(),
      name: newEvent.name,
      price: parseFloat(newEvent.price),
      tickets: parseInt(newEvent.tickets),
      total: parseFloat(newEvent.price) * parseInt(newEvent.tickets),
      date: new Date().toISOString().split('T')[0]
    };

    const updatedEvents = [...events, event];
    setEvents(updatedEvents);
    localStorage.setItem('customerEvents', JSON.stringify(updatedEvents));
    
    // Reset form
    setNewEvent({
      name: '',
      price: '',
      tickets: '',
    });
  };

  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem('customerEvents', JSON.stringify(updatedEvents));
  };

  const totalBudget = events.reduce((sum, event) => sum + event.total, 0);

  const chartData = {
    labels: events.map(event => event.name),
    datasets: [
      {
        data: events.map(event => event.total),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        align: 'center',
        labels: {
          font: {
            size: 22,
            weight: 900,
            family: 'Arial'
          },
          padding: 30,
          color: '#000000',
          usePointStyle: true,
          boxWidth: 15,
          boxHeight: 15,
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return {
                  text: `${label}\n(${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  hidden: false,
                  index: i,
                  lineWidth: 2,
                  strokeStyle: '#000'
                };
              });
            }
            return [];
          }
        }
      },
      title: {
        display: true,
        text: 'Budget Distribution by Event',
        font: {
          size: 24,
          weight: 900
        },
        color: '#000000',
        padding: 30
      },
      tooltip: {
        titleFont: {
          size: 20,
          weight: 'bold'
        },
        bodyFont: {
          size: 18,
          weight: 'bold'
        },
        padding: 15,
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `₹${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="customer-budget-container">
      <div className="budget-header">
        <h1><i className="fas fa-wallet"></i> My Budget Tracking</h1>
        <p>Track and manage your event budgets</p>
      </div>

      <div className="budget-content">
        <div className="budget-form-section">
          <h2>Add New Event</h2>
          <form onSubmit={handleAddEvent} className="budget-form">
            <div className="form-group">
              <label htmlFor="name">Event Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newEvent.name}
                onChange={handleInputChange}
                placeholder="Enter event name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price per Ticket (₹)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={newEvent.price}
                onChange={handleInputChange}
                placeholder="Enter price per ticket"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label htmlFor="tickets">Number of Tickets</label>
              <input
                type="number"
                id="tickets"
                name="tickets"
                value={newEvent.tickets}
                onChange={handleInputChange}
                placeholder="Enter number of tickets"
                required
                min="1"
              />
            </div>
            <button type="submit" className="submit-button">
              <i className="fas fa-plus"></i> Add Event
            </button>
          </form>
        </div>

        <div className="budget-summary-section">
          <h2>Budget Summary</h2>
          <div className="budget-cards">
            <div className="budget-card">
              <i className="fas fa-calendar-check"></i>
              <div className="card-content">
                <h3>Total Events</h3>
                <p>{events.length}</p>
              </div>
            </div>
            <div className="budget-card">
              <i className="fas fa-rupee-sign"></i>
              <div className="card-content">
                <h3>Total Budget</h3>
                <p>₹{totalBudget.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="budget-chart-section">
          <h2>Budget Distribution</h2>
          <div className="chart-container" style={{ height: '600px', maxWidth: '1000px' }}>
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="events-list-section">
          <h2>My Events</h2>
          <div className="events-list">
            {events.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-events-info">
                  <h3 className="event-name">{event.name}</h3>
                  <p className="event-detail"><i className="fas fa-calendar"></i> Date: {event.date}</p>
                  <p className="event-detail"><i className="fas fa-ticket-alt"></i> Price per Ticket: ₹{event.price.toLocaleString()}</p>
                  <p className="event-detail"><i className="fas fa-users"></i> Number of Tickets: {event.tickets}</p>
                  <p className="event-detail total"><i className="fas fa-rupee-sign"></i> Total: ₹{event.total.toLocaleString()}</p>
                </div>
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteEvent(event.id)}
                  title="Delete Event"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
            {events.length === 0 && (
              <p className="no-events">No events added yet. Add your first event above!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerBudgetTracking; 