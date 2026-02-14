export const calculateLoadScore = (slot) => {
  if (slot.capacity === 0) return 1;
  return slot.currentLoad / slot.capacity;
};

export const findAlternativeSlots = async (Slot, requestedSlot, limit = 5) => {
  const requestedTime = new Date(
    `${requestedSlot.date.toISOString().split('T')[0]}T${requestedSlot.startTime}:00`
  );

  const slots = await Slot.find({
    center: requestedSlot.center,
    date: requestedSlot.date,
    status: 'available',
    _id: { $ne: requestedSlot._id }
  });

  const scoredSlots = slots.map(slot => {
    const slotTime = new Date(
      `${slot.date.toISOString().split('T')[0]}T${slot.startTime}:00`
    );

    const timeDiff = Math.abs(slotTime - requestedTime) / (1000 * 60); // minutes
    const loadScore = calculateLoadScore(slot);
    const timeWeight = timeDiff / 120;

    const combinedScore = loadScore * 0.7 + timeWeight * 0.3;

    return {
      slot,
      loadScore,
      timeDiffMinutes: timeDiff,
      combinedScore
    };
  });

  return scoredSlots
    .sort((a, b) => a.combinedScore - b.combinedScore)
    .slice(0, limit);
};


export const estimateWaitTime = (slot) => {
  const loadScore = calculateLoadScore(slot);

  if (loadScore < 0.5) {
    return { min: 0, max: 10, average: 5 };
  } else if (loadScore < 0.8) {
    return { min: 10, max: 20, average: 15 };
  } else {
    return { min: 20, max: 40, average: 30 };
  }
};
