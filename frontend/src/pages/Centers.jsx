import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Clock, Users, Building2, Search, Filter, ChevronRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { getCenters } from '../redux/slices/centerSlice';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import SkeletonLoader from '../components/common/SkeletonLoader';
import Button from '../components/common/Button';

const Centers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { centers, isLoading } = useSelector((state) => state.center);
  
  const [searchTerm, setSearchTerm] = useState('');
  const serviceFromUrl = searchParams.get('service'); 

  useEffect(() => {
    dispatch(getCenters());
  }, [dispatch]);

  const getServiceName = (serviceId) => {
    const serviceNames = {
      'aadhaar': 'Aadhaar Services',
      'pan': 'PAN Card Services',
      'passport': 'Passport Services',
      'rto': 'RTO Services',
      'municipal': 'Municipal Services',
      'other': 'Other Services'
    };
    return serviceNames[serviceId] || serviceId;
  };

  const filteredCenters = centers.filter((center) => {
    if (!center.isActive) return false;
L
    if (serviceFromUrl) {
      const hasService = center.type === serviceFromUrl;
      if (!hasService) return false;
    }

    const matchesSearch = 
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.address?.city?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleBookNow = (centerId) => {
    const params = new URLSearchParams();
    params.append('center', centerId);
    if (serviceFromUrl) {
      params.append('service', serviceFromUrl);
    }
    navigate(`/booking?${params.toString()}`);
  };

  const handleBackToServices = () => {
    navigate('/book');
  };

  if (isLoading) {
    return <SkeletonLoader type="card" count={3} />;
  }

  return (
    <div className="space-y-6">
      {serviceFromUrl && (
        <div className="flex items-center justify-center gap-2 text-sm bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
              ✓
            </div>
            <span className="text-neutral-600">Choose Service</span>
          </div>
          <ChevronRight size={16} className="text-neutral-400" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
              2
            </div>
            <span className="font-medium text-blue-600">Select Center</span>
          </div>
          <ChevronRight size={16} className="text-neutral-400" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center font-semibold">
              3
            </div>
            <span className="text-neutral-500">Pick Date & Time</span>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-3 mb-2">
          {serviceFromUrl && (
            <button
              onClick={handleBackToServices}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-neutral-600" />
            </button>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800">
              {serviceFromUrl ? `Centers for ${getServiceName(serviceFromUrl)}` : 'Service Centers'}
            </h1>
            <p className="text-neutral-600 mt-1">
              {serviceFromUrl 
                ? `Select a center that offers ${getServiceName(serviceFromUrl).toLowerCase()}`
                : 'Browse available service centers and book your appointment'
              }
            </p>
          </div>
        </div>

        {serviceFromUrl && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm text-neutral-600">Selected Service:</span>
            <Badge variant="primary" size="lg">
              {getServiceName(serviceFromUrl)}
            </Badge>
            <button
              onClick={handleBackToServices}
              className="text-sm text-blue-600 hover:underline"
            >
              Change
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
          <input
            type="text"
            placeholder="Search by center name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="text-sm text-neutral-600">
        {filteredCenters.length === 0 ? (
          <span className="text-orange-600 font-medium">No centers found</span>
        ) : (
          <span>
            Showing {filteredCenters.length} {filteredCenters.length === 1 ? 'center' : 'centers'}
          </span>
        )}
      </div>

      {filteredCenters.length === 0 ? (
        <Card className="text-center py-12">
          <AlertCircle size={48} className="mx-auto text-orange-400 mb-4" />
          <h3 className="text-lg font-semibold text-neutral-800 mb-2">
            {serviceFromUrl 
              ? `No Centers Available for ${getServiceName(serviceFromUrl)}`
              : 'No Centers Found'
            }
          </h3>
          <p className="text-neutral-600 mb-6 max-w-md mx-auto">
            {serviceFromUrl
              ? `Unfortunately, there are no service centers currently offering ${getServiceName(serviceFromUrl).toLowerCase()} in your area. Please try a different service or check back later.`
              : searchTerm
              ? 'Try adjusting your search terms'
              : 'No service centers are available at the moment'
            }
          </p>
          {serviceFromUrl && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="secondary"
                onClick={handleBackToServices}
              >
                <ArrowLeft size={18} />
                Choose Different Service
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/centers')}
              >
                View All Centers
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCenters.map((center) => (
            <Card key={center._id} hover className="flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-neutral-800">
                      {center.name}
                    </h3>
                    <Badge variant="success" size="sm">Active</Badge>
                  </div>
                  <Badge variant="primary" size="sm">
                    {center.type.charAt(0).toUpperCase() + center.type.slice(1)}
                  </Badge>
                </div>
                <Building2 size={32} className="text-blue-500 opacity-20" />
              </div>

              <div className="space-y-3 flex-1">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={16} className="text-neutral-500 mt-1 flex-shrink-0" />
                  <div className="text-neutral-700">
                    <p>{center.address?.street}</p>
                    <p>{center.address?.city}, {center.address?.state} - {center.address?.pincode}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-neutral-700">
                  <Clock size={16} className="text-neutral-500 flex-shrink-0" />
                  <span>
                    {center.workingHours?.start} - {center.workingHours?.end}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-neutral-700">
                  <Users size={16} className="text-neutral-500 flex-shrink-0" />
                  <span>
                    {center.activeCounters}/{center.totalCounters} counters active
                  </span>
                </div>

                {center.services && center.services.length > 0 && (
                  <div className="pt-3 border-t border-neutral-200">
                    <p className="text-xs text-neutral-600 mb-2 font-medium">Available Services:</p>
                    <div className="flex flex-wrap gap-2">
                      {center.services.slice(0, 3).map((service, idx) => (
                        <Badge key={idx} variant="neutral" size="sm">
                          {service.name}
                        </Badge>
                      ))}
                      {center.services.length > 3 && (
                        <Badge variant="neutral" size="sm">
                          +{center.services.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-200">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => handleBookNow(center._id)}
                >
                  Book Appointment
                  <ChevronRight size={18} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Centers;