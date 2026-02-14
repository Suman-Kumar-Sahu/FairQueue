import React from 'react';
import { motion } from 'framer-motion';
import { Heart, DollarSign, FileText, Check } from 'lucide-react';
import Card from '../common/Card';

const ServiceSelector = ({ services = [], selectedService, onSelect }) => {
  const iconMap = {
    'Medical Clinic': Heart,
    'Bank Services': DollarSign,
    'Government ID': FileText,
  };

  const defaultServices = [
    { name: 'Medical Clinic', icon: 'Heart', color: 'from-blue-400 to-blue-600' },
    { name: 'Bank Services', icon: 'DollarSign', color: 'from-green-400 to-green-600' },
    { name: 'Government ID', icon: 'FileText', color: 'from-purple-400 to-purple-600' },
  ];

  const serviceList = services.length > 0 ? services : defaultServices;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-neutral-800">Choose Service</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {serviceList.map((service, index) => {
          const Icon = iconMap[service.name] || FileText;
          const isSelected = selectedService === service.name;

          return (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                hover
                onClick={() => onSelect(service.name)}
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected ? 'ring-4 ring-primary-500 ring-opacity-50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${service.color} shadow-soft`}>
                    <Icon className="text-white" size={32} />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-neutral-800">
                      {service.name}
                    </h3>
                    {service.duration && (
                      <p className="text-sm text-neutral-600">
                        ~{service.duration} minutes
                      </p>
                    )}
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 bg-success-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="text-white" size={20} />
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceSelector;