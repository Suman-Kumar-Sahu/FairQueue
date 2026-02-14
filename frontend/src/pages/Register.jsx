import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone, CreditCard } from 'lucide-react';
import { register, reset } from '../redux/slices/authSlice';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    aadhaarNumber: '',
  });

  const { name, email, phone, password, confirmPassword, aadhaarNumber } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      toast.success('Registration successful!');
      navigate('/dashboard');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!name || !email || !phone || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error('Please enter a valid Indian phone number');
      return;
    }

    if (aadhaarNumber && !/^\d{12}$/.test(aadhaarNumber)) {
      toast.error('Aadhaar number must be 12 digits');
      return;
    }

    const userData = {
      name,
      email,
      phone,
      password,
      aadhaarNumber: aadhaarNumber || undefined,
    };

    dispatch(register(userData));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl mb-4 shadow-soft-lg">
            <span className="text-white font-bold text-3xl">Q</span>
          </div>
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">
            Create Account
          </h1>
          <p className="text-neutral-600">
            Join QueueWise and skip the wait
          </p>
        </div>

        {/* Registration Card */}
        <Card>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={onChange}
                  placeholder="Enter your full name"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="your.email@example.com"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
                  <Phone size={20} />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={onChange}
                  placeholder="10-digit mobile number"
                  className="input-field pl-12"
                  required
                  maxLength={10}
                />
              </div>
            </div>

            {/* Aadhaar Number (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Aadhaar Number (Optional)
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
                  <CreditCard size={20} />
                </div>
                <input
                  type="text"
                  name="aadhaarNumber"
                  value={aadhaarNumber}
                  onChange={onChange}
                  placeholder="12-digit Aadhaar number"
                  className="input-field pl-12"
                  maxLength={12}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="At least 6 characters"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={onChange}
                  placeholder="Re-enter password"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              icon={<UserPlus size={20} />}
            >
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-neutral-500">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Sign In Link */}
          <Link to="/login">
            <Button variant="outline" size="lg" fullWidth>
              Sign In
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default Register;