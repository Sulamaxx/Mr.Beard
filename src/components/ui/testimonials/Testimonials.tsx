import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Testimonials.scss';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  image: string;
  position?: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  themeColor?: string;
  autoplay?: boolean;
  autoplaySpeed?: number;
}

const Testimonials: React.FC<TestimonialsProps> = ({ 
  testimonials, 
  themeColor = '#f5ce42',
  autoplay = true,
  autoplaySpeed = 5000 
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const [visibleTestimonials, setVisibleTestimonials] = useState<Testimonial[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  
  // Minimum swipe distance (in px)
  const MIN_SWIPE_DISTANCE = 50;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Set up visible testimonials
  useEffect(() => {
    if (testimonials.length === 0) return;

    if (windowWidth < 768) {
      // On mobile, show only one testimonial
      setVisibleTestimonials([testimonials[activeIndex]]);
    } else {
      // On desktop, show three testimonials
      let leftIndex = activeIndex - 1;
      let rightIndex = activeIndex + 1;
      
      // Handle edge cases
      if (leftIndex < 0) leftIndex = testimonials.length - 1;
      if (rightIndex >= testimonials.length) rightIndex = 0;
      
      setVisibleTestimonials([
        testimonials[leftIndex], 
        testimonials[activeIndex], 
        testimonials[rightIndex]
      ]);
    }
  }, [testimonials, activeIndex, windowWidth]);

  // Handle autoplay
  useEffect(() => {
    if (autoplay) {
      startAutoplay();
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, activeIndex, testimonials.length]);

  const startAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
    
    autoplayRef.current = setInterval(() => {
      goToNext();
    }, autoplaySpeed);
  };

  const resetAutoplay = () => {
    if (autoplay) {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
      startAutoplay();
    }
  };

  // Navigation functions
  const goToNext = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrev = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToIndex = (index: number) => {
    setActiveIndex(index);
    resetAutoplay();
  };

  // Touch event handlers for swipe on mobile
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > MIN_SWIPE_DISTANCE;
    const isRightSwipe = distance < -MIN_SWIPE_DISTANCE;
    
    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
  };

  return (
    <section className="testimonials-section">
      <Container>
        <div className="testimonials-container">
          <Row className="justify-content-center">
            {windowWidth >= 768 ? (
              // Desktop layout with three testimonials
              visibleTestimonials.map((testimonial, index) => {
                const isActive = index === 1; // Middle item is active
                return (
                  <Col 
                    key={testimonial.id} 
                    md={4} 
                    className="testimonial-col"
                  >
                    <div 
                      className={`testimonial-card ${isActive ? 'active' : ''}`}
                      style={{ 
                        backgroundColor: isActive ? themeColor : '#f0f0f0',
                      }}
                      onClick={() => {
                        if (!isActive) {
                          if (index === 0) {
                            goToPrev();
                          } else {
                            goToNext();
                          }
                        }
                      }}
                    >
                      <div className="quote-icon">
                        <i className="bi bi-quote"></i>
                      </div>
                      <p className="testimonial-text">{testimonial.quote}</p>
                      <div className="testimonial-author">
                        <div className="author-image">
                          <img src={testimonial.image} alt={testimonial.author} />
                        </div>
                        <div className="author-info">
                          <h4>{testimonial.author}</h4>
                          {testimonial.position && (
                            <p className="author-position">{testimonial.position}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })
            ) : (
              // Mobile layout with touch swipe
              <Col xs={12} className="testimonial-col">
                <div 
                  className="testimonial-card active"
                  style={{ backgroundColor: themeColor }}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  <div className="quote-icon">
                    <i className="bi bi-quote"></i>
                  </div>
                  <p className="testimonial-text">{visibleTestimonials[0]?.quote}</p>
                  <div className="testimonial-author">
                    <div className="author-image">
                      <img src={visibleTestimonials[0]?.image} alt={visibleTestimonials[0]?.author} />
                    </div>
                    <div className="author-info">
                      <h4>{visibleTestimonials[0]?.author}</h4>
                      {visibleTestimonials[0]?.position && (
                        <p className="author-position">{visibleTestimonials[0]?.position}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile navigation dots */}
                <div className="testimonial-dots">
                  {testimonials.map((_, index) => (
                    <span 
                      key={`dot-${index}`}
                      className={`dot ${index === activeIndex ? 'active' : ''}`}
                      onClick={() => goToIndex(index)}
                      style={{ backgroundColor: index === activeIndex ? themeColor : '#ccc' }}
                    ></span>
                  ))}
                </div>
                
                {/* Mobile navigation arrows */}
                <div className="testimonial-arrows">
                  <button 
                    className="arrow-btn prev" 
                    onClick={goToPrev}
                    aria-label="Previous testimonial"
                  >
                    <span>‹</span>
                  </button>
                  <button 
                    className="arrow-btn next" 
                    onClick={goToNext}
                    aria-label="Next testimonial"
                  >
                    <span>›</span>
                  </button>
                </div>
              </Col>
            )}
          </Row>
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;