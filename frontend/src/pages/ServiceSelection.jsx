import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CreditCard, Globe, Car, Building, Briefcase, ChevronRight } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const ServiceSelection = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState('');

  // Available services with icons and descriptions
  const services = [
    {
      id: 'aadhaar',
      name: 'Aadhaar Services',
      icon: <FileText size={32} />,
      description: 'Aadhaar enrollment, update, and related services',
      color: 'blue'
    },
    {
      id: 'pan',
      name: 'PAN Card Services',
      icon: <CreditCard size={32} />,
      description: 'PAN card application, correction, and reprint',
      color: 'green'
    },
    {
      id: 'passport',
      name: 'Passport Services',
      icon: <Globe size={32} />,
      description: 'Passport application and renewal services',
      color: 'purple'
    },
    {
      id: 'rto',
      name: 'RTO Services',
      icon: <Car size={32} />,
      description: 'Driving license and vehicle registration',
      color: 'orange'
    },
    {
      id: 'municipal',
      name: 'Municipal Services',
      icon: <Building size={32} />,
      description: 'Birth certificate, property tax, and civic services',
      color: 'indigo'
    },
    {
      id: 'other',
      name: 'Other Services',
      icon: <Briefcase size={32} />,
      description: 'General government and administrative services',
      color: 'gray'
    }
  ];

  const getColorClasses = (color, isSelected) => {
    const colors = {
      blue: isSelected 
        ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-500' 
        : 'border-neutral-200 hover:border-blue-300',
      green: isSelected 
        ? 'bg-green-100 border-green-500 ring-2 ring-green-500' 
        : 'border-neutral-200 hover:border-green-300',
      purple: isSelected 
        ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-500' 
        : 'border-neutral-200 hover:border-purple-300',
      orange: isSelected 
        ? 'bg-orange-100 border-orange-500 ring-2 ring-orange-500' 
        : 'border-neutral-200 hover:border-orange-300',
      indigo: isSelected 
        ? 'bg-indigo-100 border-indigo-500 ring-2 ring-indigo-500' 
        : 'border-neutral-200 hover:border-indigo-300',
      gray: isSelected 
        ? 'bg-gray-100 border-gray-500 ring-2 ring-gray-500' 
        : 'border-neutral-200 hover:border-gray-300'
    };
    return colors[color];
  };

  const getIconColor = (color, isSelected) => {
    const colors = {
      blue: isSelected ? 'text-blue-600' : 'text-blue-500',
      green: isSelected ? 'text-green-600' : 'text-green-500',
      purple: isSelected ? 'text-purple-600' : 'text-purple-500',
      orange: isSelected ? 'text-orange-600' : 'text-orange-500',
      indigo: isSelected ? 'text-indigo-600' : 'text-indigo-500',
      gray: isSelected ? 'text-gray-600' : 'text-gray-500'
    };
    return colors[color];
  };

  const handleContinue = () => {
    if (selectedService) {
      navigate(`/centers?service=${selectedService}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">
          Book an Appointment
        </h1>
        <p className="text-neutral-600">
          Select the service you need to find available centers
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
            1
          </div>
          <span className="font-medium text-blue-600">Choose Service</span>
        </div>
        <ChevronRight size={16} className="text-neutral-400" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center font-semibold">
            2
          </div>
          <span className="text-neutral-500">Select Center</span>
        </div>
        <ChevronRight size={16} className="text-neutral-400" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center font-semibold">
            3
          </div>
          <span className="text-neutral-500">Pick Date & Time</span>
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => {
          const isSelected = selectedService === service.id;
          return (
            <button
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              className={`text-left p-6 rounded-2xl border-2 transition-all ${getColorClasses(
                service.color,
                isSelected
              )}`}
            >
              <div className={`mb-4 ${getIconColor(service.color, isSelected)}`}>
                {service.icon}
              </div>
              <h3 className="text-lg font-bold text-neutral-800 mb-2">
                {service.name}
              </h3>
              <p className="text-sm text-neutral-600">
                {service.description}
              </p>
              {isSelected && (
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    ✓
                  </div>
                  Selected
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="flex justify-center pt-4">
        <Button
          variant="primary"
          size="lg"
          disabled={!selectedService}
          onClick={handleContinue}
          className="min-w-[200px]"
        >
          Continue to Centers
          <ChevronRight size={20} />
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-center text-sm text-neutral-500 pt-4">
        Not sure which service you need?{' '}
        <button className="text-blue-600 hover:underline">
          View all centers
        </button>
      </div>
    </div>
  );
};

export default ServiceSelection;