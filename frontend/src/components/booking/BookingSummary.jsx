import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  CreditCard, 
  Globe, 
  Car, 
  Building2, 
  Briefcase, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowLeft, 
  Check,
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';

const serviceDetails = {
  aadhaar: {
    name: 'Aadhaar Services',
    icon: FileText,
    gradient: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    accentColor: 'blue',
    docs: [
      'Original Proof of Identity (POI) document (e.g. Passport, PAN Card, Voter ID)',
      'Original Proof of Address (POA) document (e.g. Utility bill, Bank statement)',
      'Printed application form receipt (if pre-filled online)'
    ]
  },
  pan: {
    name: 'PAN Card Services',
    icon: CreditCard,
    gradient: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    accentColor: 'emerald',
    docs: [
      'Two recent passport-sized photographs',
      'Proof of Identity (POI) (e.g. Aadhaar Card, Driving License)',
      'Proof of Address (POA) (e.g. Aadhaar Card, Utility bill)',
      'Proof of Date of Birth (DOB) document'
    ]
  },
  passport: {
    name: 'Passport Services',
    icon: Globe,
    gradient: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    accentColor: 'purple',
    docs: [
      'Online payment receipt and appointment confirmation',
      'Original matriculation certificate or proof of Date of Birth',
      'Original address proof documents (1 year residence history proof)',
      'Original document of parent/spouse (if applicable)'
    ]
  },
  rto: {
    name: 'RTO Services',
    icon: Car,
    gradient: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    accentColor: 'amber',
    docs: [
      'Original Learner\'s License (for driving test)',
      'Vehicle documents: Registration Certificate (RC), Insurance, PUCC',
      'Medical certificate Form 1-A (for applicants above 40 years)',
      'Application fee payment receipt'
    ]
  },
  municipal: {
    name: 'Municipal Services',
    icon: Building2,
    gradient: 'from-cyan-500 to-sky-600',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    accentColor: 'cyan',
    docs: [
      'Previous tax receipt or property assessment document',
      'Birth/Death/Marriage certificate registration details',
      'Owner\'s identity proof documents',
      'Completed application form'
    ]
  },
  other: {
    name: 'Other Services',
    icon: Briefcase,
    gradient: 'from-neutral-500 to-neutral-600',
    bgColor: 'bg-neutral-50',
    textColor: 'text-neutral-700',
    accentColor: 'neutral',
    docs: [
      'Valid government-issued photo ID card',
      'Printed booking confirmation email',
      'Any supportive application documents or pre-filled forms'
    ]
  }
};

const BookingSummary = ({ 
  selectedCenter, 
  selectedSlot, 
  selectedService, 
  bookingLoading, 
  onConfirm, 
  onBack 
}) => {
  const [isChecked, setIsChecked] = useState(false);
  
  const currentService = serviceDetails[selectedService] || serviceDetails.other;
  const ServiceIcon = currentService.icon;

  const handleConfirmClick = () => {
    if (!isChecked) return;
    onConfirm();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-neutral-100 transition-colors border border-neutral-200"
          title="Back to Slot Selection"
        >
          <ArrowLeft size={20} className="text-neutral-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Review Booking</h1>
          <p className="text-sm text-neutral-500">Please review your appointment details below before confirming.</p>
        </div>
      </div>

      {/* Ticket Layout Card */}
      <Card className="relative overflow-visible border border-neutral-100/50 shadow-soft-lg">
        {/* Ticket punch holes & dashed line */}
        <div className="absolute left-0 right-0 top-[115px] flex items-center justify-between pointer-events-none">
          <div className="w-5 h-10 -ml-2.5 rounded-r-full bg-neutral-50 border-y border-r border-neutral-200" />
          <div className="flex-1 mx-4 border-t-2 border-dashed border-neutral-200" />
          <div className="w-5 h-10 -mr-2.5 rounded-l-full bg-neutral-50 border-y border-l border-neutral-200" />
        </div>

        <div className="space-y-6">
          {/* Top section: Service Details */}
          <div className="flex items-center gap-4 pb-8">
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${currentService.gradient} shadow-soft text-white`}>
              <ServiceIcon size={32} />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Service Type</p>
              <h2 className="text-xl font-bold text-neutral-800">{currentService.name}</h2>
              <Badge variant="primary" size="sm" className="mt-1">
                Standard Slot
              </Badge>
            </div>
          </div>

          {/* Ticket Body section (below the dashed line) */}
          <div className="pt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date & Time Column */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Date & Time</h3>
                
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary-50 text-primary-600">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-medium">Appointment Date</p>
                    <p className="font-semibold text-neutral-800">
                      {selectedSlot?.date ? format(new Date(selectedSlot.date), 'EEEE, MMMM dd, yyyy') : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary-50 text-primary-600">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-medium">Time Slot</p>
                    <p className="font-semibold text-neutral-800">
                      {selectedSlot?.startTime} - {selectedSlot?.endTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Service Center Column */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Service Center</h3>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-primary-50 text-primary-600 mt-0.5">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-medium">{selectedCenter?.name}</p>
                    <p className="font-medium text-neutral-700 text-sm mt-0.5">
                      {selectedCenter?.address?.street}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {selectedCenter?.address?.city}, {selectedCenter?.address?.state} - {selectedCenter?.address?.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Checklist Guidelines Card */}
            <div className="p-5 bg-neutral-50 border border-neutral-200/60 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-neutral-800 font-semibold text-sm">
                <Info size={16} className="text-primary-500" />
                <span>What to bring for your appointment:</span>
              </div>
              <ul className="space-y-2 pl-1">
                {currentService.docs.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-600 leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Important Warning Alert */}
            <div className="p-4 bg-yellow-50/70 border border-yellow-200/80 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="text-yellow-600 mt-0.5 flex-shrink-0" size={18} />
              <p className="text-xs text-yellow-800 leading-relaxed">
                <span className="font-bold">Important Notice:</span> Please arrive at least <span className="font-semibold">10 minutes before</span> your scheduled time. If you do not check-in on time, your slot may be automatically cancelled to serve other waitlisted users.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Interactive Checkbox Section */}
      <div className="flex items-start gap-3 p-1">
        <div className="flex items-center h-5">
          <input
            id="verify-details"
            name="verify-details"
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="h-5 w-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 cursor-pointer accent-primary-500"
          />
        </div>
        <div className="text-sm">
          <label htmlFor="verify-details" className="font-medium text-neutral-700 cursor-pointer select-none">
            I verify that the service center, date, and time slot selected above are correct.
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          variant="secondary"
          size="lg"
          onClick={onBack}
          className="flex-1"
        >
          <ArrowLeft size={18} />
          Change Date & Time
        </Button>
        
        <Button
          variant={isChecked ? 'success' : 'primary'}
          size="lg"
          fullWidth
          disabled={!isChecked}
          loading={bookingLoading}
          icon={<ShieldCheck size={20} />}
          onClick={handleConfirmClick}
          className="flex-2 transition-all duration-200"
        >
          Confirm & Book Appointment
        </Button>
      </div>
    </motion.div>
  );
};

export default BookingSummary;
