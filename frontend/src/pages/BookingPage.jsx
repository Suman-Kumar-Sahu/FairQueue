import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar as CalendarIcon, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { format, addDays } from 'date-fns';
import toast from 'react-hot-toast';

import { getCenters, setSelectedCenter } from '../redux/slices/centerSlice';
import {
  getSlots,
  setSelectedSlot,
  setSelectedDate,
  getAlternatives,
  clearAlternatives,
} from '../redux/slices/slotSlice';
import { createBooking, clearCurrentBooking } from '../redux/slices/bookingSlice';

import TimeSlotSelector from '../components/booking/TimeSlotSelector';
import AlternativeSlots from '../components/booking/AlternativeSlots';
import BookingConfirmation from '../components/booking/BookingConfirmation';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [showAlternatives, setShowAlternatives] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const centerFromUrl = searchParams.get('center');
  const serviceFromUrl = searchParams.get('service');

  const { centers, selectedCenter } = useSelector((state) => state.center);
  const { slots, selectedSlot, selectedDate, alternatives, isLoading: slotsLoading } =
    useSelector((state) => state.slot);
  const { currentBooking, isLoading: bookingLoading } = useSelector(
    (state) => state.booking
  );

  useEffect(() => {
    dispatch(getCenters());
  }, [dispatch]);

  useEffect(() => {
    if (centers.length === 0 || selectedCenter) return;

    if (centerFromUrl) {
      const centerFromQuery = centers.find((c) => c._id === centerFromUrl);
      if (centerFromQuery) {
        dispatch(setSelectedCenter(centerFromQuery));
        return;
      }
    }

    dispatch(setSelectedCenter(centers[0]));
  }, [centers, centerFromUrl, selectedCenter, dispatch]);

  useEffect(() => {
    if (!selectedDate) {
      dispatch(setSelectedDate(new Date().toISOString().split('T')[0]));
    }

    if (serviceFromUrl) {
      setSelectedService(serviceFromUrl);
    }
  }, [selectedDate, serviceFromUrl, dispatch]);

  useEffect(() => {
    if (selectedCenter && selectedDate && step === 1) {
      dispatch(
        getSlots({
          centerId: selectedCenter._id,
          date: selectedDate,
        })
      );
    }
  }, [selectedCenter, selectedDate, step, dispatch]);

  const handleSlotSelect = async (slot) => {
    dispatch(setSelectedSlot(slot));

    if (slot.loadScore > 0.6) {
      const result = await dispatch(getAlternatives(slot._id));
      if (result.payload?.alternatives?.length > 0) {
        setShowAlternatives(true);
        return;
      }
    }

    setStep(3);
  };

  const handleAlternativeSelect = (slot) => {
    dispatch(setSelectedSlot(slot));
    setShowAlternatives(false);
    setStep(3);
  };

  const handleDateChange = (days) => {
    const newDate = addDays(new Date(selectedDate), days);
    dispatch(setSelectedDate(newDate.toISOString().split('T')[0]));
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !selectedService) {
      toast.error('Please select a service and time slot');
      return;
    }

    const result = await dispatch(
      createBooking({
        slotId: selectedSlot._id,
        service: selectedService,
      })
    );

    if (result.type.endsWith('fulfilled')) {
      toast.success('Booking confirmed!');
      setStep(4);
    } else {
      toast.error('Booking failed');
    }
  };

  const handleDone = () => {
    dispatch(clearCurrentBooking());
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {step === 1 && (
        <>
          <Card>
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleDateChange(-1)}
                disabled={selectedDate === new Date().toISOString().split('T')[0]}
              >
                <ArrowLeft />
              </button>

              <p className="font-bold">
                {format(new Date(selectedDate), 'EEEE, MMMM dd, yyyy')}
              </p>

              <button onClick={() => handleDateChange(1)}>
                <ArrowRight />
              </button>
            </div>
          </Card>

          <TimeSlotSelector
            slots={slots}
            selectedSlot={selectedSlot}
            onSelect={handleSlotSelect}
            loading={slotsLoading}
          />

          {showAlternatives && (
            <AlternativeSlots
              alternatives={alternatives}
              onSelect={handleAlternativeSelect}
              onClose={() => setShowAlternatives(false)}
            />
          )}
        </>
      )}

      {step === 3 && selectedSlot && (
        <Card>
          <Button
            fullWidth
            loading={bookingLoading}
            icon={<Check size={18} />}
            onClick={handleConfirmBooking}
          >
            Confirm Booking
          </Button>
        </Card>
      )}

      {step === 4 && currentBooking && (
        <BookingConfirmation booking={currentBooking} onDone={handleDone} />
      )}
    </div>
  );
};

export default BookingPage;
