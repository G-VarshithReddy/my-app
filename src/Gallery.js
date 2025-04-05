import React, { useState, useEffect } from "react";
import "./Gallery.css";

const images = [
  { src: "/image1.jpg", title: "College Events" },
  { src: "/image2.jpg", title: "Business Meetings" },
  { src: "/image3.jpg", title: "Community Meetups" },
  { src: "/image4.jpg", title: "Conferences" },
  { src: "/image5.jpg", title: "Private Events" },
  { src: "/image6.jpg", title: "Festivals" },
  { src: "/image7.jpg", title: "DJ Nights" },
  { src: "/image8.jpg", title: "Concerts" },
  { src: "/image9.jpg", title: "Night Parties" }
];

const videos = [
  "/video1.mp4", "/video2.mp4", "/video3.mp4", "/video4.mp4"
];

function Gallery() {
  const [currentVideo, setCurrentVideo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="gallerybody">
      <h2 className="gallery-glowing-header">Event Gallery</h2>
      <p className="gallery-subtitle">
  Take a glimpse into the electrifying<br />
  atmosphere and memorable moments from<br />
  our past events.
</p>

      <div className="gallery-image-grid">
        {images.map((img, index) => (
          <div key={index} className="gallery-image-box" data-title={img.title}>
            <img src={img.src} alt={img.title} className="gallery-image" />
            <div className="gallery-image-overlay">{img.title}</div>
          </div>
        ))}
      </div>

      <h2 className="gallery-glowing-header">Event Highlights</h2>
      <div className="gallery-video-section">
        <video key={videos[currentVideo]} controls autoPlay muted>
          <source src={videos[currentVideo]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      </div>
    </div>
  );
}

export default Gallery;
