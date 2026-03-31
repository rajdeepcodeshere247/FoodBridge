import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import FoodList from '../components/food/FoodList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useLocationContext } from '../context/LocationContext';
import { getAllFood } from '../services/food.service';
import './HomePage.css'; 

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9] } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
};

function HomePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { location, status } = useLocationContext();
  
  const { scrollY } = useScroll();
  
  // Parallax: Background image moves slower than scroll
  const backgroundY = useTransform(scrollY, [0, 1000], ["0%", "30%"]);
  // Hero content fades out as user scrolls down
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    getAllFood()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.items || []);
        setItems(data);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    /* Wrap in fb-home-wrapper to handle navbar spacing */
    <div className="fb-home-wrapper">
      
      {/* --- HERO SECTION --- */}
      <section className="fb-hero-section">
        <motion.div style={{ y: backgroundY }} className="fb-hero-bg">
          <div className="fb-hero-overlay" />
          <img 
            src="/home-image.webp" 
            alt="Food Donation" 
            className="fb-hero-img"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          style={{ opacity: heroOpacity }}
          variants={staggerContainer}
          className="fb-hero-content"
        >
          <motion.div variants={fadeInUp}>
            <span className="fb-badge">Feed the Future</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="fb-title">
            Connect surplus <br/>
            <span className="fb-accent">food to people.</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="fb-description">
            FoodBridge helps donors, volunteers, and NGOs coordinate food rescue in real time.
          </motion.p>

          <motion.div variants={fadeInUp} className="fb-cta-group">
            <Link to="/foods" className="fb-btn-primary">Browse Food</Link>
            <Link to="/add-food" className="fb-btn-glass">Donate Food</Link>
            <Link to="/donate-money" className="fb-btn-glass">Donate Money</Link>
          </motion.div>

          {status === 'success' && location && (
            <motion.p variants={fadeInUp} className="fb-location-tag">
              ● Live near {location.lat.toFixed(2)}, {location.lng.toFixed(2)}
            </motion.p>
          )}
        </motion.div>

        {/* Animated Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="fb-scroll-indicator"
        >
          <div className="fb-mouse">
            <div className="fb-wheel" />
          </div>
        </motion.div>
      </section>

      {/* --- LISTINGS SECTION --- */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="fb-listings-section"
      >
        <div className="fb-section-header">
          <div>
            <h2 className="fb-section-title">Latest Listings</h2>
            <p className="fb-section-subtitle">Real-time surplus available for pickup.</p>
          </div>
          <Link to="/foods" className="fb-view-all">View all listings →</Link>
        </div>

        <div className="fb-list-wrapper">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loader"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="fb-loader-container"
              >
                <LoadingSpinner label="Locating donations..." />
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FoodList items={items.slice(0, 6)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>
    </div>
  );
}

export default HomePage;