import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Edit, Trash2, MapPin, Clock, Users, Power,Building2 } from 'lucide-react';
import { getCenters } from '../../redux/slices/centerSlice';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import CreateCenterModal from '../../components/admin/CreateCenterModal';
import toast from 'react-hot-toast';
import api from '../../services/api';

const CenterManagement = () => {
  const dispatch = useDispatch();
  const { centers, isLoading } = useSelector((state) => state.center);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);

  useEffect(() => {
    dispatch(getCenters());
  }, [dispatch]);

  const handleToggleCenter = async (centerId, currentStatus) => {
    try {
      await api.put(`/centers/${centerId}`, { isActive: !currentStatus });
      toast.success(`Center ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      dispatch(getCenters());
    } catch (error) {
      toast.error('Failed to update center status');
    }
  };

  const handleDeleteCenter = async (centerId) => {
    if (window.confirm('Are you sure you want to delete this center?')) {
      try {
        await api.delete(`/centers/${centerId}`);
        toast.success('Center deleted successfully');
        dispatch(getCenters());
      } catch (error) {
        toast.error('Failed to delete center');
      }
    }
  };

  if (isLoading) {
    return <SkeletonLoader type="card" count={3} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800">
            Service Centers
          </h1>
          <p className="text-neutral-600 mt-1">
            Manage service centers and their configurations
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus size={20} />}
          onClick={() => setShowCreateModal(true)}
        >
          Add Center
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Centers</p>
              <p className="text-3xl font-bold">{centers.length}</p>
            </div>
            <Building2 size={32} className="opacity-80" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Active Centers</p>
              <p className="text-3xl font-bold">
                {centers.filter(c => c.isActive).length}
              </p>
            </div>
            <Power size={32} className="opacity-80" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Total Capacity</p>
              <p className="text-3xl font-bold">
                {centers.reduce((sum, c) => sum + (c.capacityPerSlot || 0), 0)}
              </p>
            </div>
            <Users size={32} className="opacity-80" />
          </div>
        </Card>
      </div>

      {/* Centers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {centers.map((center) => (
          <Card key={center._id} hover>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-neutral-800">
                    {center.name}
                  </h3>
                  <Badge variant={center.isActive ? 'success' : 'neutral'}>
                    {center.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <Badge variant="primary" size="sm">
                  {center.type}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCenter(center)}
                  className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteCenter(center._id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={() => handleToggleCenter(center._id, center.isActive)}
                  className={`p-2 rounded-lg ${
                    center.isActive 
                      ? 'hover:bg-red-50 text-red-600' 
                      : 'hover:bg-green-50 text-green-600'
                  }`}
                >
                  <Power size={18} />
                </button>
              </div>
            </div>

            {/* Center Details */}
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <MapPin size={16} className="text-neutral-500 mt-1" />
                <div className="text-neutral-700">
                  <p>{center.address?.street}</p>
                  <p>{center.address?.city}, {center.address?.state} - {center.address?.pincode}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <Clock size={16} className="text-neutral-500" />
                <span>
                  {center.workingHours?.start} - {center.workingHours?.end}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <Users size={16} className="text-neutral-500" />
                <span>
                  {center.activeCounters}/{center.totalCounters} counters active
                </span>
              </div>

              {/* Services */}
              {center.services && center.services.length > 0 && (
                <div className="pt-3 border-t border-neutral-200">
                  <p className="text-xs text-neutral-600 mb-2 font-medium">Services:</p>
                  <div className="flex flex-wrap gap-2">
                    {center.services.map((service, idx) => (
                      <Badge key={idx} variant="neutral" size="sm">
                        {service.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Configuration */}
              <div className="pt-3 border-t border-neutral-200 grid grid-cols-2 gap-3 text-sm">
                <div className="bg-neutral-50 rounded-xl p-3">
                  <p className="text-neutral-600 text-xs mb-1">Slot Duration</p>
                  <p className="font-semibold text-neutral-800">
                    {center.slotDuration} min
                  </p>
                </div>
                <div className="bg-neutral-50 rounded-xl p-3">
                  <p className="text-neutral-600 text-xs mb-1">Capacity/Slot</p>
                  <p className="font-semibold text-neutral-800">
                    {center.capacityPerSlot}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Center Modal */}
      {showCreateModal && (
        <CreateCenterModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            dispatch(getCenters());
          }}
        />
      )}
    </div>
  );
};

export default CenterManagement;