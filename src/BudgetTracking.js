import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import './BudgetTracking.css';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetTracking = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'venue',
    date: new Date().toISOString().split('T')[0]
  });
  const [budget, setBudget] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [numberOfCustomers, setNumberOfCustomers] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Load saved data from localStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem('eventExpenses');
    const savedBudget = localStorage.getItem('eventBudget');
    const savedTicketPrice = localStorage.getItem('eventTicketPrice');
    const savedNumberOfCustomers = localStorage.getItem('eventNumberOfCustomers');
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedBudget) setBudget(savedBudget);
    if (savedTicketPrice) setTicketPrice(savedTicketPrice);
    if (savedNumberOfCustomers) setNumberOfCustomers(savedNumberOfCustomers);
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('eventExpenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    if (budget) localStorage.setItem('eventBudget', budget);
  }, [budget]);

  useEffect(() => {
    if (ticketPrice) localStorage.setItem('eventTicketPrice', ticketPrice);
  }, [ticketPrice]);

  useEffect(() => {
    if (numberOfCustomers) localStorage.setItem('eventNumberOfCustomers', numberOfCustomers);
  }, [numberOfCustomers]);

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount) return;

    const expenseToAdd = {
      ...newExpense,
      id: Date.now(),
      amount: parseFloat(newExpense.amount)
    };

    setExpenses([...expenses, expenseToAdd]);
    setNewExpense({
      description: '',
      amount: '',
      category: 'venue',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const getFilteredExpenses = () => {
    let filtered = [...expenses];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(expense => expense.category === selectedCategory);
    }

    if (selectedTimeRange !== 'all') {
      const today = new Date();
      const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
      const ninetyDaysAgo = new Date(today.setDate(today.getDate() - 90));

      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date);
        if (selectedTimeRange === '30') {
          return expenseDate >= thirtyDaysAgo;
        } else if (selectedTimeRange === '90') {
          return expenseDate >= ninetyDaysAgo;
        }
        return true;
      });
    }

    return filtered;
  };

  const getTotalExpenses = (expenses) => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const calculateTotalRevenue = () => {
    if (!ticketPrice || !numberOfCustomers) return 0;
    return parseFloat(ticketPrice) * parseInt(numberOfCustomers);
  };

  const calculateNetProfit = () => {
    const totalRevenue = calculateTotalRevenue();
    const totalExpenses = getTotalExpenses(expenses);
    return totalRevenue - totalExpenses;
  };

  const getRemainingBudget = () => {
    return budget - getTotalExpenses(expenses);
  };

  const getExpensesByCategory = () => {
    const categories = {};
    expenses.forEach(expense => {
      categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
    });
    return categories;
  };

  const filteredExpenses = getFilteredExpenses();
  const totalExpenses = getTotalExpenses(filteredExpenses);
  const remainingBudget = getRemainingBudget();
  const totalRevenue = calculateTotalRevenue();
  const netProfit = calculateNetProfit();
  const expensesByCategory = getExpensesByCategory();

  // Add this function to get chart data
  const getChartData = () => {
    const categories = getExpensesByCategory();
    const total = getTotalExpenses(expenses);

    return {
      labels: Object.keys(categories).map(category => 
        category.charAt(0).toUpperCase() + category.slice(1)
      ),
      datasets: [
        {
          data: Object.values(categories),
          backgroundColor: [
            'rgba(52, 152, 219, 0.8)',  // Venue - Blue
            'rgba(39, 174, 96, 0.8)',   // Catering - Green
            'rgba(241, 196, 15, 0.8)',  // Decoration - Yellow
            'rgba(155, 89, 182, 0.8)',  // Entertainment - Purple
            'rgba(149, 165, 166, 0.8)', // Other - Gray
          ],
          borderColor: [
            'rgba(52, 152, 219, 1)',
            'rgba(39, 174, 96, 1)',
            'rgba(241, 196, 15, 1)',
            'rgba(155, 89, 182, 1)',
            'rgba(149, 165, 166, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Add chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'var(--text-primary)',
          font: {
            family: "'Poppins', sans-serif",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const total = getTotalExpenses(expenses);
            const percentage = ((value / total) * 100).toFixed(1);
            return `₹${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  const getCategoryIcon = (category) => {
    const icons = {
      venue: 'fa-building',
      catering: 'fa-utensils',
      decoration: 'fa-paint-brush',
      entertainment: 'fa-music',
      other: 'fa-ellipsis-h'
    };
    return icons[category] || icons.other;
  };

  const getBudgetAlert = () => {
    const totalExpenses = getTotalExpenses(expenses);
    const budgetPercentage = (totalExpenses / budget) * 100;
    
    if (budgetPercentage >= 90) {
      return {
        type: 'danger',
        message: 'Warning: You are close to exceeding your budget!',
        icon: 'fa-exclamation-triangle'
      };
    } else if (budgetPercentage >= 75) {
      return {
        type: 'warning',
        message: 'Note: You have used 75% of your budget.',
        icon: 'fa-exclamation-circle'
      };
    }
    return null;
  };

  const budgetAlert = getBudgetAlert();

  return (
    <div className="budget-tracking-container">
      <div className="budget-header">
        <h1><i className="fas fa-wallet"></i> Event Budget Tracking</h1>
      </div>

      <div className="budget-content">
        <div className="budget-section">
          <div className="section-header">
            <h2><i className="fas fa-chart-line"></i> Budget Overview</h2>
          </div>
          {budgetAlert && (
            <div className={`alert alert-${budgetAlert.type}`}>
              <i className={`fas ${budgetAlert.icon}`}></i>
              {budgetAlert.message}
            </div>
          )}
          <div className="budget-inputs">
            <div className="form-row">
              <div className="form-group">
                <label>Total Budget</label>
                <div className="tooltip">
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Enter total budget"
                  />
                  <span className="tooltip-text">Set your total event budget</span>
                </div>
              </div>
              <div className="form-group">
                <label>Event Price per Ticket (₹)</label>
                <div className="tooltip">
                  <input
                    type="number"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(e.target.value)}
                    placeholder="Enter ticket price"
                  />
                  <span className="tooltip-text">Price per ticket for the event</span>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Number of Customers</label>
              <div className="tooltip">
                <input
                  type="number"
                  value={numberOfCustomers}
                  onChange={(e) => setNumberOfCustomers(e.target.value)}
                  placeholder="Enter number of customers"
                />
                <span className="tooltip-text">Expected number of attendees</span>
              </div>
            </div>
          </div>
          <div className="budget-summary">
            <div className="budget-item">
              <div className="budget-item-header">
                <i className="fas fa-receipt"></i>
                <span>Total Expenses</span>
              </div>
              <span className="amount">₹{totalExpenses.toFixed(2)}</span>
            </div>
            <div className="budget-item">
              <div className="budget-item-header">
                <i className="fas fa-money-bill-wave"></i>
                <span>Total Revenue</span>
              </div>
              <span className="amount positive">
                ₹{totalRevenue.toFixed(2)}
                <i className="fas fa-arrow-up"></i>
              </span>
            </div>
            <div className="budget-item">
              <div className="budget-item-header">
                <i className="fas fa-chart-pie"></i>
                <span>Net Profit</span>
              </div>
              <span className={`amount ${netProfit < 0 ? 'negative' : 'positive'}`}>
                ₹{netProfit.toFixed(2)}
                {netProfit < 0 ? (
                  <i className="fas fa-arrow-down"></i>
                ) : (
                  <i className="fas fa-arrow-up"></i>
                )}
              </span>
            </div>
            <div className="budget-item">
              <div className="budget-item-header">
                <i className="fas fa-piggy-bank"></i>
                <span>Remaining Budget</span>
              </div>
              <span className={`amount ${remainingBudget < 0 ? 'negative' : 'positive'}`}>
                ₹{remainingBudget.toFixed(2)}
                {remainingBudget < 0 ? (
                  <i className="fas fa-arrow-down"></i>
                ) : (
                  <i className="fas fa-arrow-up"></i>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="add-expense-section">
          <div className="section-header">
            <h2><i className="fas fa-plus-circle"></i> Add New Expense</h2>
          </div>
          <form onSubmit={handleExpenseSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  placeholder="Enter expense description"
                  required
                />
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  placeholder="Enter amount"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                >
                  <option value="venue">Venue</option>
                  <option value="catering">Catering</option>
                  <option value="decoration">Decoration</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                />
              </div>
            </div>
            <button type="submit" className="add-expense-btn">
              <i className="fas fa-plus"></i> Add Expense
            </button>
          </form>
        </div>

        <div className="expenses-section">
          <div className="section-header">
            <h2><i className="fas fa-list"></i> Expenses List</h2>
            <div className="filters">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Time</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                <option value="venue">Venue</option>
                <option value="catering">Catering</option>
                <option value="decoration">Decoration</option>
                <option value="entertainment">Entertainment</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="expenses-list">
            {filteredExpenses.map(expense => (
              <div key={expense.id} className="expense-item">
                <div className="expense-info">
                  <i className={`fas ${getCategoryIcon(expense.category)}`}></i>
                  <div>
                    <h3>{expense.description}</h3>
                    <p className="expense-category">
                      <i className="fas fa-tag"></i> {expense.category}
                    </p>
                    <p className="expense-date">
                      <i className="fas fa-calendar"></i> {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="expense-amount-section">
                  <span className="expense-amount">₹{expense.amount.toFixed(2)}</span>
                  <button 
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="delete-btn"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="category-summary-section">
          <div className="section-header">
            <h2><i className="fas fa-chart-pie"></i> Category Summary</h2>
          </div>
          <div className="charts-container">
            <div className="chart-card">
              <h3><i className="fas fa-pie-chart"></i> Expense Distribution</h3>
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Pie data={getChartData()} options={chartOptions} />
              </div>
            </div>
            <div className="chart-card">
              <h3><i className="fas fa-chart-bar"></i> Category Breakdown</h3>
              <div className="category-list">
                {Object.entries(expensesByCategory).map(([category, amount]) => (
                  <div key={category} className="category-item">
                    <div className="category-info">
                      <span className="category-name">
                        <i className={`fas ${getCategoryIcon(category)}`}></i>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </span>
                      <span className="category-amount">₹{amount.toFixed(2)}</span>
                    </div>
                    <div className="category-bar-container">
                      <div 
                        className="category-bar"
                        data-category={category}
                        style={{ 
                          width: `${(amount / getTotalExpenses(expenses)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getCategoryColor = (category) => {
  const colors = {
    venue: '#4CAF50',
    catering: '#2196F3',
    decoration: '#FF9800',
    entertainment: '#9C27B0',
    other: '#607D8B'
  };
  return colors[category] || colors.other;
};

export default BudgetTracking; 