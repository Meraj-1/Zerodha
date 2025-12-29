import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://kitebackend.vercel.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and redirect to dashboard
        localStorage.setItem('token', data.token);
        window.location.href = 'https://dashboardclone.vercel.app/profile';
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-20 px-4">
      {/* Login Section */}
      <div className="flex flex-wrap items-center p-3">
        {/* Left Side - Image */}
        <div className="w-full md:w-1/2 p-5 flex justify-center">
          <img
            className="max-w-full h-auto"
            src="https://signup.zerodha.com/img/landing.46a77378.png"
            alt="Login"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-5">
          <h1 className="text-gray-700 font-serif text-3xl font-bold mb-6 text-center md:text-left">
            Welcome Back
          </h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="flex items-center border-b-2 border-blue-300 py-2">
              <span className="text-2xl text-blue-700">📧</span>
              <input
                className="ml-2 p-2 w-full outline-none text-lg"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
              />
            </div>

            {/* Password Input */}
            <div className="flex items-center border-b-2 border-blue-300 py-2">
              <span className="text-2xl text-blue-700">🔒</span>
              <input
                className="ml-2 p-2 w-full outline-none text-lg"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white font-bold text-lg font-serif py-3 px-6 rounded mt-5 hover:bg-blue-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Google Login */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 mb-3">Or sign in with</p>
            <a 
              href="https://kitebackend.vercel.app/auth/google"
              className="inline-flex items-center justify-center w-full bg-red-500 text-white font-bold py-3 px-6 rounded hover:bg-red-600 transition duration-300"
            >
              <span className="mr-2">🔍</span>
              Continue with Google
            </a>
          </div>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/signup')}
                className="text-blue-500 hover:underline font-bold"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mb-10 md:mt-10 text-center px-4">
        <p className="text-gray-700 font-serif text-sm mb-3">
          Your account is secure and protected with industry-standard encryption.
          <br />
          Need help? Contact our support team.
        </p>
      </div>
    </div>
  );
}

export default Login;