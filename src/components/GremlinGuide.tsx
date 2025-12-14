import { useState, useEffect } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import './GremlinGuide.css';

interface TourStep {
  target: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface GremlinGuideProps {
  isVisible: boolean;
  onClose: () => void;
}

const tourSteps: TourStep[] = [
  {
    target: '.home-section',
    title: 'Welcome to Famroot!',
    content: 'Hi! I\'m your friendly guide. Let me show you around your family connection hub!',
    position: 'bottom'
  },
  {
    target: '.chat-section',
    title: 'Chat with Family',
    content: 'Stay connected with your family members through our chat feature. Send messages, share moments!',
    position: 'right'
  },
  {
    target: '.connects-section',
    title: 'Family Connections',
    content: 'View and manage your family tree connections. Add new members and see relationships!',
    position: 'right'
  },
  {
    target: '.maps-section',
    title: 'Family Map',
    content: 'See where your family members are located around the world!',
    position: 'right'
  },
  {
    target: '.notes-section',
    title: 'Family Notes',
    content: 'Keep important family notes, memories, and information all in one place!',
    position: 'right'
  },
  {
    target: '.vault-section',
    title: 'Family Vault',
    content: 'Securely store important family documents and precious memories!',
    position: 'right'
  }
];

export function GremlinGuide({ isVisible, onClose }: GremlinGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 100, left: 100 });
  const [gremlinMood, setGremlinMood] = useState<'happy' | 'excited' | 'thinking'>('happy');

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      return;
    }

    if (currentStep < tourSteps.length) {
      const step = tourSteps[currentStep];
      const element = document.querySelector(step.target);

      if (element) {
        const rect = element.getBoundingClientRect();
        const pos = calculatePosition(rect, step.position || 'right');
        setPosition(pos);

        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('tour-highlight');

        return () => {
          element.classList.remove('tour-highlight');
        };
      }
    }
  }, [currentStep, isVisible]);

  const calculatePosition = (rect: DOMRect, position: string) => {
    const offset = 20;
    switch (position) {
      case 'right':
        return { top: rect.top + rect.height / 2 - 150, left: rect.right + offset };
      case 'left':
        return { top: rect.top + rect.height / 2 - 150, left: rect.left - 320 - offset };
      case 'bottom':
        return { top: rect.bottom + offset, left: rect.left + rect.width / 2 - 160 };
      case 'top':
        return { top: rect.top - 200 - offset, left: rect.left + rect.width / 2 - 160 };
      default:
        return { top: rect.top, left: rect.right + offset };
    }
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setGremlinMood('excited');
      setTimeout(() => setGremlinMood('happy'), 500);
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setGremlinMood('thinking');
      setTimeout(() => setGremlinMood('happy'), 500);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setGremlinMood('excited');
    setTimeout(() => {
      onClose();
      setGremlinMood('happy');
    }, 500);
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isVisible) return null;

  const currentTourStep = tourSteps[currentStep];

  return (
    <>
      <div className="tour-overlay" onClick={handleSkip} />
      <div
        className="gremlin-guide-container"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`
        }}
      >
        <div className={`gremlin-character ${gremlinMood}`}>
          <div className="gremlin-body">
            <div className="gremlin-ears">
              <div className="ear left"></div>
              <div className="ear right"></div>
            </div>
            <div className="gremlin-head">
              <div className="gremlin-eyes">
                <div className="eye left">
                  <div className="pupil"></div>
                </div>
                <div className="eye right">
                  <div className="pupil"></div>
                </div>
              </div>
              <div className="gremlin-mouth"></div>
            </div>
            <div className="gremlin-body-main">
              <div className="gremlin-arms">
                <div className="arm left"></div>
                <div className="arm right"></div>
              </div>
            </div>
            <div className="gremlin-legs">
              <div className="leg left"></div>
              <div className="leg right"></div>
            </div>
          </div>
        </div>

        <div className="tour-bubble">
          <button className="tour-close" onClick={handleSkip}>
            <CloseOutlined />
          </button>

          <h3 className="tour-title">{currentTourStep.title}</h3>
          <p className="tour-content">{currentTourStep.content}</p>

          <div className="tour-progress">
            {tourSteps.map((_, index) => (
              <span
                key={index}
                className={`progress-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              />
            ))}
          </div>

          <div className="tour-actions">
            {currentStep > 0 && (
              <button className="tour-btn tour-btn-secondary" onClick={handlePrev}>
                Previous
              </button>
            )}
            <button className="tour-btn tour-btn-primary" onClick={handleNext}>
              {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
