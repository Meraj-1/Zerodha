import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://kitebackend.vercel.app/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      console.log('Frontend signup response:', data); // Debug log

      if (response.ok) {
        console.log('Signup successful, storing token and redirecting...'); // Debug log
        // Store token and redirect to dashboard
        localStorage.setItem('token', data.token);
        // Immediate redirect without delay
        window.location.href = 'https://dashboardclone.vercel.app/profile';
      } else {
        console.log('Signup failed:', response.status, data.message); // Debug log
        if (response.status === 409 || data.message === "User already exists") {
          setError("This email is already registered. Please login instead or use a different email.");
        } else {
          setError(data.message || 'Signup failed');
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-20 px-4">
      {/* Signup Section */}
      <div className="flex flex-wrap items-center p-3">
        {/* Left Side - Image */}
        <div className="w-full md:w-1/2 p-5 flex justify-center">
          <img
            className="max-w-full h-auto"
            src="https://signup.zerodha.com/img/landing.46a77378.png"
            alt="Sign Up"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-5">
          <h1 className="text-gray-700 font-serif text-3xl font-bold mb-6 text-center md:text-left">
            Create Your Account
          </h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div className="flex items-center border-b-2 border-blue-300 py-2">
              <span className="text-2xl text-blue-700">👤</span>
              <input
                className="ml-2 p-2 w-full outline-none text-lg"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
            </div>

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

            {/* Phone Input */}
            <div className="flex items-center border-b-2 border-blue-300 py-2">
              <span className="text-2xl text-blue-700">📱</span>
              <input
                className="ml-2 p-2 w-full outline-none text-lg"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
                placeholder="Mobile Number (Optional)"
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
                placeholder="Password (min 6 characters)"
                required
              />
            </div>

            {/* Confirm Password Input */}
            <div className="flex items-center border-b-2 border-blue-300 py-2">
              <span className="text-2xl text-blue-700">🔒</span>
              <input
                className="ml-2 p-2 w-full outline-none text-lg"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white font-bold text-lg font-serif py-3 px-6 rounded mt-5 hover:bg-blue-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Google Signup */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 mb-3">Or sign up with</p>
            <a 
              href="https://kitebackend.vercel.app/auth/google"
              className="inline-flex items-center justify-center w-full bg-red-500 text-white font-bold py-3 px-6 rounded hover:bg-red-600 transition duration-300"
            >
              <span className="mr-2">🔍</span>
              Continue with Google
            </a>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-blue-500 hover:underline font-bold"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mb-10 md:mt-10 text-center px-4">
        <p className="text-gray-700 font-serif text-sm mb-3">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
          <br />
          Your data is secure and will not be shared with third parties.
        </p>
      </div>
    </div>
  );
}

export default SignUp;