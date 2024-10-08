import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login, isAuthenticated } from '../auth';
import { gsap } from 'gsap';

function Login() {
  const [credentials, setCredentials] = useState({ identifier: '', password: '' });
  const [message, setMessage] = useState('');
  const [loginMethod, setLoginMethod] = useState('username');
  const [loading, setLoading] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [showSalute, setShowSalute] = useState(false);

  const navigate = useNavigate();
  const formRef = useRef(null);
  const buttonRef = useRef(null);
  const ballRef = useRef(null);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (e.target.name === 'identifier' || e.target.name === 'password') {
      triggerBallJump(); // Trigger the ball jump animation only for ID and password fields
    }
  };

  const handleMethodChange = (e) => {
    setLoginMethod(e.target.value);
    setCredentials({ ...credentials, identifier: '' });
  };

  const triggerBallJump = () => {
    gsap.to(ballRef.current.querySelector('.ball'), {
      y: -20, // Move the ball up
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: 'power1.out'
    });
  };

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard'); // Redirect if already authenticated
    }

    gsap.from(formRef.current, { opacity: 0, y: 50, duration: 1, ease: 'power3.out' });

    // Ball Animation (starts from the beginning)
    gsap.set(ballRef.current, { opacity: 1 });

    // Initial ball position setup (still)
    gsap.set(ballRef.current.querySelector('.ball'), { y: 0 });

  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        identifier: credentials.identifier,
        password: credentials.password,
      });

      setMessage('Login successful: ');
      login(response.data.user);
      setShowSalute(true);

      setTimeout(() => {
        navigate('/dashboard', { state: { user: response.data.user } });
      }, 2000);
    } catch (error) {
      setMessage('Error during login: ' + (error.response?.data?.detail || error.message));
      setLoginFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setLoginFailed(false);
    setShowSalute(false);
    setMessage('');
    setCredentials({ identifier: '', password: '' });
  };

  return (
    <div className="login-container">
      <h2>User Login</h2>
      
      <div className="ball-animation" ref={ballRef}>
        <svg viewBox="0 0 100 200">
          <defs>
            <linearGradient id="grad-1" x1="30" y1="0" x2="70" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0.2" stopColor="#0ae448" />
              <stop offset="0.5" stopColor="#abff84" />
            </linearGradient>
          </defs>
          <ellipse className="shadow" cx="50" cy="188" rx="15" ry="5" />
          <circle fill="url(#grad-1)" className="ball" cx="50" cy="22" r="15" />
        </svg>
      </div>

      <style jsx>{`
        .login-container {
          width: 400px;
          height: 500px; /* Set height for proper spacing */
          margin: 50px auto;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
          background-color: #333; /* Dark background for the container */
          color: #fff; /* White text color */
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: space-between; /* Space out content */
        }

        h2 {
          margin-bottom: 20px;
          color: #0ae448; /* Green color for heading */
        }

        .ball-animation {
          position: relative;
          margin: 20px 0; /* Space above and below the ball */
          height: 50px; /* Adjust height to prevent overlap */
        }

        form {
          display: flex;
          flex-direction: column;
          margin-top: auto; /* Move form to the bottom */
          margin-bottom: 14%; /* Leave space from the bottom */
        }

        label {
          margin: 10px 0 8px;
        }

        input[type="text"],
        input[type="password"] {
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #0ae448; /* Green border for inputs */
          border-radius: 5px;
          background-color: #444; /* Darker input background */
          color: #fff; /* White text color */
        }

        button {
          padding: 10px;
          background-color: #0ae448; /* Green background for button */
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        button:disabled {
          background-color: #a3c1e0;
        }

        button:hover:not(:disabled) {
          background-color: #0056b3; /* Darker shade on hover */
        }

        .shadow {
          opacity: 0.2;
        }
      `}</style>

      {!showSalute && !loginFailed && (
        <form onSubmit={handleSubmit} ref={formRef}>
          <div>
            <label>
              <input
                type="radio"
                value="username"
                checked={loginMethod === 'username'}
                onChange={handleMethodChange}
                style={{ accentColor: '#0ae448' }} // Custom radio color
              />
              Username
            </label>
            <label>
              <input
                type="radio"
                value="id"
                checked={loginMethod === 'id'}
                onChange={handleMethodChange}
                style={{ accentColor: '#0ae448' }} // Custom radio color
              />
              User ID
            </label>
          </div>
          <label htmlFor="identifier">Identifier</label>
          <input
            type="text"
            id="identifier"
            name="identifier"
            value={credentials.identifier}
            onChange={handleChange}
            placeholder={loginMethod === 'username' ? "Username" : "User ID"}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <button ref={buttonRef} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      )}

      {showSalute && (
        <div>
          <p>🎉 Welcome to the app!</p>
        </div>
      )}

      {loginFailed && (
        <div>
          <p>🚫 Login failed! Please try again.</p>
          <button onClick={handleRetry}>Return</button>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
