import { Link } from "react-router-dom";
import "./Landing.css";
import { useState } from "react";
 // Import useState for handling email input

const testimonials = [
  { name: "Sarah Johnson", role: "Marketing Director", feedback: "EventZen transformed our event planning process with its intuitive design.", rating: 5, image: "/sarah.jpeg" },
  { name: "Michael Chen", role: "Event Manager", feedback: "Over 20 events managed flawlessly—EventZen’s support is unmatched.", rating: 5, image: "/michael.jpg" },
  { name: "Emily Rodriguez", role: "Conference Organizer", feedback: "Handled a 1,000-person conference with ease—flexibility at its best.", rating: 5, image: "/emily.jpeg" },
];

const TestimonialsSection = () => (
  <section className="testimonials-section">
    <h2 className="title animate__animated animate__fadeInDown">Voices of Success</h2>
    <p className="subtitle animate__animated animate__fadeInUp" style={{ animationDelay: "0.2s" }}>
      Discover how EventZen empowers event planners worldwide.
    </p>
    <div className="testimonials-grid">
      {testimonials.map((testimonial, index) => (
        <div key={index} className="testimonial-card animate__animated animate__zoomIn" style={{ animationDelay: `${index * 0.3}s` }}>
          <div className="testimonial-glow"></div>
          <img src={testimonial.image} alt={testimonial.name} className="testimonial-img" />
          <h3>{testimonial.name}</h3>
          <p className="role">{testimonial.role}</p>
          <p className="feedback">"{testimonial.feedback}"</p>
          <div className="stars">{"★".repeat(testimonial.rating)}</div>
        </div>
      ))}
    </div>
  </section>
);

const ServicesSection = () => (
  <section className="services-section">
    <h2 className="title animate__animated animate__fadeInDown">Unleash Your Event Potential</h2>
    <p className="subtitle animate__animated animate__fadeInUp" style={{ animationDelay: "0.2s" }}>
      Tools designed to make every event extraordinary.
    </p>
    <div className="services-container">
      <div className="services-text animate__animated animate__slideInLeft">
        <p>From small gatherings to grand conferences, EventZen offers cutting-edge features to streamline planning, engage attendees, and deliver unforgettable experiences.</p>
        <button className="learn-more-btn" onClick={() => alert("Learn More clicked!")}>Learn More</button>
      </div>
      <div className="services-image animate__animated animate__slideInRight">
        <img src="/event-experience.jpg" alt="Event Experience" className="services-img" />
      </div>
    </div>
    <div className="stats-section">
      <div className="stat animate__animated animate__flipInX" style={{ animationDelay: "0.4s" }}>
        <h3>50+</h3>
        <p>Events</p>
      </div>
      <div className="stat animate__animated animate__flipInX" style={{ animationDelay: "0.6s" }}>
        <h3>1000+</h3>
        <p>Customers</p>
      </div>
      <div className="stat animate__animated animate__flipInX" style={{ animationDelay: "0.8s" }}>
        <h3>10+</h3>
        <p>Sponsors</p>
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section className="features-section">
    <h2 className="title animate__animated animate__fadeInDown">Powerful Features</h2>
    <p className="subtitle animate__animated animate__fadeInUp" style={{ animationDelay: "0.2s" }}>
      Everything you need to create exceptional events
    </p>
    <div className="features-grid">
      <div className="feature-card animate__animated animate__zoomIn" style={{ animationDelay: "0.3s" }}>
        <div className="feature-icon">📅</div>
        <h3>Easy Scheduling</h3>
        <p>Plan and organize your events with our intuitive scheduling tools.</p>
      </div>
      <div className="feature-card animate__animated animate__zoomIn" style={{ animationDelay: "0.4s" }}>
        <div className="feature-icon">👥</div>
        <h3>Attendee Management</h3>
        <p>Easily manage attendees, send invitations, and track RSVPs.</p>
      </div>
      <div className="feature-card animate__animated animate__zoomIn" style={{ animationDelay: "0.5s" }}>
        <div className="feature-icon">⏰</div>
        <h3>Real-time Updates</h3>
        <p>Keep everyone informed with instant updates and notifications.</p>
      </div>
      <div className="feature-card animate__animated animate__zoomIn" style={{ animationDelay: "0.6s" }}>
        <div className="feature-icon">📍</div>
        <h3>Venue Coordination</h3>
        <p>Seamlessly coordinate with venues for perfect event execution.</p>
      </div>
    </div>
  </section>
);

const LandingPage = () => {
  // State to manage email input
  const [email, setEmail] = useState("");

  // Handle form submission for the subscribe section
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed with email: ${email}`);
      setEmail(""); // Clear the input after submission
    } else {
      alert("Please enter a valid email address.");
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="hero">
        <nav className="navbar animate__animated animate__fadeInDown">
          <h1 className="logo">EventZen</h1>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/event">Events</Link></li>
            <li><Link to="/admin-sign">Admin</Link></li>
            <li><Link to="/user-signin">Customer</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
          <button className="get-started" onClick={() => alert("Get Started clicked!")}>Get Started</button>
        </nav>
        <div className="hero-content">
          <h1 className="animate__animated animate__zoomIn">Plan. Manage. Celebrate.</h1>
          <p className="animate__animated animate__fadeInUp" style={{ animationDelay: "0.3s" }}>
            Seamless event management at your fingertips.
          </p>
          <button
            className="explore-btn animate__animated animate__bounceIn"
            style={{ animationDelay: "0.5s" }}
            onClick={() => alert("Explore Events clicked!")}
          >
            Explore Events
          </button>
        </div>
      </div>

      {/* About Us Section */}
      <div className="about-us" id="about">
        <div className="about-container">
          <div className="about-image-wrapper animate__animated animate__fadeInLeft">
            <img src="/about-image.jpg" alt="About Us" className="about-image" />
            <div className="about-glow"></div>
          </div>
          <div className="about-content animate__animated animate__fadeInRight">
            <h2>Who We Are</h2>
            <p>
              EventZen redefines event management with innovative tools and a passion for perfection. Whether it’s a festival, conference, or wedding, we turn visions into reality.
            </p>
            <button className="discover-btn" onClick={() => alert("Discover More clicked!")}>Discover More</button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <ServicesSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <div className="cta-container">
        <div className="cta-box animate__animated animate__zoomIn">
          <div className="cta-glow"></div>
          <h2 className="cta-title">Launch Your Next Big Event</h2>
          <p className="cta-description">Join a global community of planners crafting memorable moments with EventZen.</p>
          <div className="cta-buttons">
            <button className="cta-sales-btn" onClick={() => alert("Contact Sales clicked!")}><span className="cta-icon">💬</span> Contact Sales</button>
            <button className="cta-start-btn" onClick={() => alert("Start Now clicked!")}>Start Now →</button>
          </div>
        </div>
      </div>

      {/* Subscribe Section */}
      <div className="subscribe-container animate__animated animate__fadeInUp">
        <h2 className="subscribe-title">Stay in the Loop</h2>
        <p className="subscribe-text">Get exclusive event tips, updates, and insights delivered to your inbox.</p>
        <form className="subscribe-form" onSubmit={handleSubscribe}>
          <div className="input-container">
            <span className="email-icon">✉️</span>
            <input
              type="email"
              placeholder="Your email address"
              className="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="subscribe-button">
            Join Now
          </button>
        </form>
        <p className="subscribe-terms">We respect your privacy—unsubscribe anytime.</p>
      </div>

      {/* Footer */}
      <footer className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">EventZen</h3>
            <p className="footer-text">
              EventZen is a modern event management platform that helps you create, organize, and manage unforgettable experiences.
            </p>
            <div className="social-icons">
            </div>
          </div>
          <div className="footer-links">
            <div>
              <h4>Product</h4>
              <ul><li>Features</li><li>Pricing</li><li>Testimonials</li><li>FAQ</li></ul>
            </div>
            <div>
              <h4>Company</h4>
              <ul><li>About Us</li><li>Careers</li><li>Blog</li><li>Contact</li></ul>
            </div>
            <div>
              <h4>Resources</h4>
              <ul><li>Event Planning</li><li>Help Center</li><li>Privacy Policy</li><li>Terms of Service</li></ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 EventZen. All rights reserved.</p>
          <div className="footer-bottom-links">
            <div>Privacy Policy</div><div>Terms of Service</div><div>Cookies</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;