import React, { useState, useEffect } from 'react';
import { X, MapPin, Loader } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import toast from 'react-hot-toast';
import api from '../../services/api';

const CreateCenterModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'aadhaar',
    street: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    workingHoursStart: '09:00',
    workingHoursEnd: '17:00',
    slotDuration: 15,
    capacityPerSlot: 4,
    totalCounters: 4,
  });

  const [loading, setLoading] = useState(false);
  const [fetchingCoordinates, setFetchingCoordinates] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Function to fetch coordinates from backend API
  const fetchCoordinates = async () => {
    const { street, city, state, pincode } = formData;

    // Check if we have enough address data
    if (!city && !pincode) {
      toast.error('Please enter at least city or pincode');
      return;
    }

    setFetchingCoordinates(true);

    try {
      // Call your backend geocoding endpoint
      const params = new URLSearchParams();
      if (street) params.append('street', street);
      if (city) params.append('city', city);
      if (state) params.append('state', state);
      if (pincode) params.append('pincode', pincode);

      const response = await api.get(`/geocode?${params.toString()}`);

      if (response.data.success) {
        const { latitude, longitude } = response.data.data;
        setFormData({
          ...formData,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6)
        });
        toast.success('Coordinates found successfully!');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch coordinates. Please enter manually.');
    } finally {
      setFetchingCoordinates(false);
    }
  };

  // Auto-fetch coordinates when address fields change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.city || formData.pincode) {
        fetchCoordinates();
      }
    }, 1500); // Wait 1.5 seconds after user stops typing

    return () => clearTimeout(timer);
  }, [formData.street, formData.city, formData.state, formData.pincode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const centerData = {
        name: formData.name,
        type: formData.type,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        location: {
          type: 'Point',
          coordinates: [
            parseFloat(formData.longitude) || 0,
            parseFloat(formData.latitude) || 0
          ]
        },
        workingHours: {
          start: formData.workingHoursStart,
          end: formData.workingHoursEnd,
        },
        slotDuration: parseInt(formData.slotDuration),
        capacityPerSlot: parseInt(formData.capacityPerSlot),
        totalCounters: parseInt(formData.totalCounters),
        activeCounters: parseInt(formData.totalCounters),
      };

      await api.post('/centers', centerData);
      toast.success('Center created successfully!');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create center');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-xl font-bold text-neutral-800">
            Create New Service Center
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Center Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Main Aadhaar Center"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Center Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="aadhaar">Aadhaar</option>
              <option value="pan">PAN</option>
              <option value="passport">Passport</option>
              <option value="rto">RTO</option>
              <option value="municipal">Municipal</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Address */}
          <div className="space-y-4 pt-4 border-t border-neutral-200">
            <h3 className="font-semibold text-neutral-800">Address</h3>
            
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="e.g., 123 Main Street"
                className="input-field"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g., Bhubaneswar"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g., Odisha"
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Pincode *
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="e.g., 751001"
                className="input-field"
                maxLength={6}
                required
              />
            </div>

            {/* Location Coordinates */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-blue-600" />
                  <h4 className="font-semibold text-neutral-800">Location Coordinates</h4>
                </div>
                <button
                  type="button"
                  onClick={fetchCoordinates}
                  disabled={fetchingCoordinates}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {fetchingCoordinates ? (
                    <>
                      <Loader size={14} className="animate-spin" />
                      Fetching...
                    </>
                  ) : (
                    <>
                      <MapPin size={14} />
                      Get Coordinates
                    </>
                  )}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="Auto-filled"
                    step="any"
                    className="input-field bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="Auto-filled"
                    step="any"
                    className="input-field bg-white"
                  />
                </div>
              </div>
              
              <p className="text-xs text-blue-700 mt-2 flex items-center gap-1">
                {fetchingCoordinates ? (
                  <>
                    <Loader size={12} className="animate-spin" />
                    Automatically fetching coordinates...
                  </>
                ) : formData.latitude && formData.longitude ? (
                  <>
                    <span className="text-green-600">✓</span>
                    Coordinates fetched successfully
                  </>
                ) : (
                  <>
                    <span>📍</span>
                    Coordinates will be fetched automatically after entering address
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Working Hours */}
          <div className="space-y-4 pt-4 border-t border-neutral-200">
            <h3 className="font-semibold text-neutral-800">Working Hours</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  name="workingHoursStart"
                  value={formData.workingHoursStart}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  End Time *
                </label>
                <input
                  type="time"
                  name="workingHoursEnd"
                  value={formData.workingHoursEnd}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          {/* Capacity Configuration */}
          <div className="space-y-4 pt-4 border-t border-neutral-200">
            <h3 className="font-semibold text-neutral-800">Capacity Configuration</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Slot Duration (min) *
                </label>
                <input
                  type="number"
                  name="slotDuration"
                  value={formData.slotDuration}
                  onChange={handleChange}
                  min="5"
                  max="60"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Capacity per Slot *
                </label>
                <input
                  type="number"
                  name="capacityPerSlot"
                  value={formData.capacityPerSlot}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Total Counters *
                </label>
                <input
                  type="number"
                  name="totalCounters"
                  value={formData.totalCounters}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              Create Center
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCenterModal;