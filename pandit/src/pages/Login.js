import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://backendserver-pf4h.onrender.com/api/users/login', form);
      const { token, user } = response.data;

      if (token && user?._id) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        alert('✅ Login successful!');

        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'pandit') {
          navigate('/pandit-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Invalid login. Try again.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || '❌ Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full font-sans">
      {/* Left background image from public folder */}
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(91, 58, 41, 0.9), rgba(91, 58, 41, 0.6)), url('/images/download.jpeg')`,
        }}
      ></div>

      {/* Right side form */}
      <div className="md:w-1/2 w-full flex justify-center items-center bg-[#fff8f0]">
        <motion.div
          className="w-full max-w-md bg-white/90 p-8 rounded-lg shadow-lg text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo image from public folder */}
          <img
            src="/images/subh.png"
            alt="Logo"
            className="w-32 h-32 rounded-full mx-auto border-4 border-yellow-400 shadow-md mb-4 object-cover"
          />
          <p className="text-gray-700 italic text-sm mb-6">Your Path to Sacred Beginnings</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-100 text-red-700 p-2 rounded-md font-semibold text-sm">
                {error}
              </div>
            )}

            <div className="text-left">
              <label className="block font-semibold text-red-900 text-sm mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="example@gmail.com"
                className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            <div className="text-left">
              <label className="block font-semibold text-red-900 text-sm mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="********"
                className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className="bg-gradient-to-r from-orange-700 to-yellow-500 text-white font-bold py-3 rounded-full transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>
          </form>

          <div className="text-sm mt-5 text-gray-700 space-y-2">
            <p>
              Don’t have an account?{' '}
              <Link to="/signup" className="font-bold text-red-900 hover:text-orange-700">
                Join as Devotee
              </Link>
            </p>
            <p>
              Are you a Pandit?{' '}
              <Link to="/signup/pandit" className="font-bold text-red-900 hover:text-orange-700">
                Register as Pandit
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
