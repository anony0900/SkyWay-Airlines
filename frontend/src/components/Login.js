// Login.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Add this import
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Set initial state based on the current path
  const [isLogin, setIsLogin] = useState("");

  useEffect(() => {
    setIsLogin(location.pathname === "/login");
  }, [location.pathname]);

  const toggleMode = () => {
    const newMode = !isLogin;
    setIsLogin(newMode);
    navigate(newMode ? "/login" : "/signup");
    // Refresh captcha when switching modes
    fetchCaptcha();
    // Clear form data including captcha
    setFormData({
      email: "",
      password: "",
      name: "",
      captcha: "",
    });
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    captcha: "",
  });
  const [error, setError] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [isLoadingCaptcha, setIsLoadingCaptcha] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBack = () => {
    navigate("/");
  };

  // Fetch new captcha when component mounts
  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    setIsLoadingCaptcha(true);
    try {
      // const response = await fetch("https://flight-backend-1fjz.onrender.com/api/get-captcha");
      const response = await fetch("http://127.0.0.1:5000/api/get-captcha");

      const data = await response.json();

      // console.log("Captcha data:", data);
      // console.log("response:", response);

      setCaptchaImage(data.captcha_image);
      localStorage.setItem("captcha_text", data.captcha_text);
    } catch (error) {
      console.error("Error fetching captcha:", error);
    } finally {
      setIsLoadingCaptcha(false);
    }
  };

  const handleRefreshClick = () => {
    const refreshButton = document.querySelector('.auth-refresh-button');
    if (refreshButton) {
      refreshButton.classList.add('rotating');
      setTimeout(() => {
        refreshButton.classList.remove('rotating');
      }, 500);
    }
    fetchCaptcha();
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const captcha = formData.captcha;
    const storedCaptcha = localStorage.getItem("captcha_text");
    
    console.log("Entered captcha:", captcha);
    console.log("Stored captcha:", storedCaptcha);
    
    if (captcha !== storedCaptcha) {
      alert("Invalid captcha");
      setFormData({
        ...formData,
        captcha: "",
      });
      fetchCaptcha();
      return;
    }
    localStorage.removeItem("captcha_text");

    try {
      const endpoint = isLogin ? "/api/login" : "/api/signup";
      // const response = await fetch(`https://flight-backend-1fjz.onrender.com${endpoint}`, {
      const response = await fetch(`http://127.0.0.1:5000/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Debugging response and data
      console.log("Response status:", response.status);
      console.log("Response data:", data);

      // Explicitly check if login/signup succeeded based on the backend's response
      if (response.ok && (data.message === "User logged in successfully" || data.message === "User registered successfully")) {
        localStorage.setItem('token', data.token);
        setFormData({
          email: "",
          password: "",
          name: "",
          captcha: "",
        });
        console.log(
          "Success:",
          isLogin ? "Login successful" : "Signup successful"
        );
        localStorage.setItem('email', formData.email);
        navigate("/airline-home",{
          state: {
            email:formData.email,
          },
        });
      } else {
        setError(data.message || "An error occurred");
        fetchCaptcha();
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Server error. Please try again.");
      fetchCaptcha();
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-content-wrapper">
        <div className="auth-welcome-text">
          <h1>Welcome to SkyWay Airlines</h1>
          <p>"Your Journey, Our Priority"</p>
        </div>
        {/* Auth Box */}
        <div className="auth-section">
          <div className="auth-form-box">
            <h2>{isLogin ? "Login" : "Sign Up"}</h2>

            {error && <div className="auth-error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="auth-form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="auth-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-captcha-container">
                <div className="auth-captcha-left">
                  <div className="auth-captcha-image-container">
                    <img
                      src={`data:image/png;base64,${captchaImage}`}
                      alt="CAPTCHA"
                    />
                    <button
                      type="button"
                      className="auth-refresh-button"
                      onClick={handleRefreshClick}
                      title="Refresh CAPTCHA"
                    >
                      ↻
                    </button>
                    {isLoadingCaptcha && (
                      <div className="auth-loading-overlay">
                        <div className="auth-loading-spinner"></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="auth-captcha-input-container">
                  <input
                    type="text"
                    id="captcha"
                    name="captcha"
                    className="auth-captcha-input"
                    value={formData.captcha}
                    onChange={handleChange}
                    placeholder="Enter the code shown"
                    required
                  />
                </div>
              </div>

              <div className="auth-button-container">
                <button
                  onClick={handleBack}
                  className="auth-submit-btn"
                  type="button"
                >
                  Back
                </button>
                <button type="submit" className="auth-submit-btn">
                  {isLogin ? "Login" : "Sign Up"}
                </button>
              </div>
            </form>

            <p className="auth-toggle-text">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <span className="auth-toggle-link" onClick={toggleMode}>
                {isLogin ? "Sign up" : "Login"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
