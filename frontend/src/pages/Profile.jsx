import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, CreditCard, Shield, LogOut, AlertTriangle, Edit } from 'lucide-react';
import { logout } from '../redux/slices/authSlice';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 mb-6">
        Profile
      </h1>

      {/* User Info Card */}
      <Card className="mb-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-soft">
            <span className="text-white font-bold text-3xl">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-neutral-800">{user?.name}</h2>
            <Badge variant="primary" size="sm" className="mt-2">
              {user?.role}
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
            <Mail size={20} className="text-neutral-600" />
            <div>
              <p className="text-xs text-neutral-600">Email</p>
              <p className="font-semibold text-neutral-800">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
            <Phone size={20} className="text-neutral-600" />
            <div>
              <p className="text-xs text-neutral-600">Phone</p>
              <p className="font-semibold text-neutral-800">{user?.phone}</p>
            </div>
          </div>

          {user?.aadhaarNumber && (
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
              <CreditCard size={20} className="text-neutral-600" />
              <div>
                <p className="text-xs text-neutral-600">Aadhaar Number</p>
                <p className="font-semibold text-neutral-800 font-mono">
                  {user.aadhaarNumber}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Account Status */}
      <Card className="mb-6">
        <h3 className="font-bold text-neutral-800 mb-4 flex items-center gap-2">
          <Shield size={20} />
          Account Status
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-neutral-600">No-Show Count</span>
            <Badge variant={user?.noShowCount >= 3 ? 'danger' : 'success'}>
              {user?.noShowCount || 0}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-600">Account Status</span>
            <Badge variant={user?.isPenalized ? 'danger' : 'success'}>
              {user?.isPenalized ? 'Penalized' : 'Active'}
            </Badge>
          </div>

          {user?.isPenalized && user?.penaltyEndDate && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-start gap-2">
                <AlertTriangle size={18} className="text-red-600 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-semibold mb-1">Account Temporarily Suspended</p>
                  <p>
                    Your account has been temporarily suspended due to multiple no-shows.
                    Penalty ends on {new Date(user.penaltyEndDate).toLocaleDateString()}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate('/edit-profile')}
          icon={<Edit size={20} />}
        >
          Edit Profile
        </Button>

        <Button
          variant="danger"
          size="lg"
          fullWidth
          icon={<LogOut size={20} />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Profile;