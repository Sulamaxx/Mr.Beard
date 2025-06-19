import { useNavigate } from 'react-router-dom';
import './Unauthorized.scss';

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="unauthorized">
      <div className="unauthorized__container">
        <div className="unauthorized__icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M15 9L9 15" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M9 9L15 15" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="unauthorized__title">Access Denied</h1>
        <p className="unauthorized__message">
          You don't have permission to access this page. This area is restricted to authorized users only.
        </p>
        <div className="unauthorized__actions">
          <button className="unauthorized__button unauthorized__button--primary" onClick={goBack}>
            Go Back
          </button>
          <button className="unauthorized__button unauthorized__button--secondary" onClick={goHome}>
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;