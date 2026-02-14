import Slot from "../model/Slot.js"

export const generateSlotsForDate = async (center, date) => {
  const slots = [];
  const dayOfWeek = date.getDay();

  if (!center.workingDays.includes(dayOfWeek)) {
    return [];
  }

  const [startHour, startMin] = center.workingHours.start.split(':').map(Number);
  const [endHour, endMin] = center.workingHours.end.split(':').map(Number);

  let currentTime = new Date(date);
  currentTime.setHours(startHour, startMin, 0, 0);

  const endTime = new Date(date);
  endTime.setHours(endHour, endMin, 0, 0);

  while (currentTime < endTime) {
    const slotStart = new Date(currentTime);
    currentTime.setMinutes(currentTime.getMinutes() + center.slotDuration);
    const slotEnd = new Date(currentTime);

    if (slotEnd <= endTime) {
      const slot = {
        center: center._id,
        date: new Date(date.setHours(0, 0, 0, 0)),
        startTime: `${String(slotStart.getHours()).padStart(2, '0')}:${String(slotStart.getMinutes()).padStart(2, '0')}`,
        endTime: `${String(slotEnd.getHours()).padStart(2, '0')}:${String(slotEnd.getMinutes()).padStart(2, '0')}`,
        capacity: center.capacityPerSlot,
        currentLoad: 0,
        status: 'available',
        isActive: true
      };

      slots.push(slot);
    }
  }

  return slots;
};

export const generateSlotsForDays = async (center, days = 7) => {
  const allSlots = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    const dailySlots = await generateSlotsForDate(center, date);
    allSlots.push(...dailySlots);
  }

  try {
    await Slot.insertMany(allSlots, { ordered: false });
  } catch (error) {
    if (error.code !== 11000) {
      throw error;
    }
  }

  return allSlots.length;
};
