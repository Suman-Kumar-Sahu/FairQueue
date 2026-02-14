import ServiceCenter from '../model/ServiceCenter.js';
import { generateSlotsForDays } from '../utills/slotGenerator.js';
import { ErrorResponse } from '../middleware/errorHandler.js';

export const getCenters = async (req, res, next) => {
  try {
    let query = {};

    if (req.query.type) {
      query.type = req.query.type;
    }

    if (req.query.isActive) {
      query.isActive = req.query.isActive === 'true';
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { 'address.city': { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const centers = await ServiceCenter.find(query).sort('name');

    res.status(200).json({
      success: true,
      count: centers.length,
      data: centers
    });
  } catch (error) {
    next(error);
  }
};

export const getCenter = async (req, res, next) => {
  try {
    const center = await ServiceCenter.findById(req.params.id);

    if (!center) {
      return next(
        new ErrorResponse(`Center not found with id ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: center
    });
  } catch (error) {
    next(error);
  }
};

export const createCenter = async (req, res, next) => {
  try {
    if (!req.body.location || !req.body.location.coordinates || req.body.location.coordinates.length !== 2) {
      req.body.location = {
        type: 'Point',
        coordinates: [0, 0] 
      };
    }

    const center = await ServiceCenter.create(req.body);

    await generateSlotsForDays(center, 7);

    res.status(201).json({
      success: true,
      data: center
    });
  } catch (error) {
    next(error);
  }
};

export const updateCenter = async (req, res, next) => {
  try {
    if (req.body.location && (!req.body.location.coordinates || req.body.location.coordinates.length !== 2)) {
      req.body.location = {
        type: 'Point',
        coordinates: [0, 0]
      };
    }
    
    const center = await ServiceCenter.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!center) {
      return next(
        new ErrorResponse(`Center not found with id ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: center
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCenter = async (req, res, next) => {
  try {
    const center = await ServiceCenter.findByIdAndDelete(req.params.id);

    if (!center) {
      return next(
        new ErrorResponse(`Center not found with id ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

export const getCentersInRadius = async (req, res, next) => {
  try {
    const { lng, lat, distance } = req.params;

    const radius = distance / 6378;

    const centers = await ServiceCenter.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
      isActive: true
    });

    res.status(200).json({
      success: true,
      count: centers.length,
      data: centers
    });
  } catch (error) {
    next(error);
  }
};

export const addService = async (req, res, next) => {
  try {
    const center = await ServiceCenter.findById(req.params.id);

    if (!center) {
      return next(
        new ErrorResponse(`Center not found with id ${req.params.id}`, 404)
      );
    }

    center.services.push(req.body);
    await center.save();

    res.status(200).json({
      success: true,
      data: center
    });
  } catch (error) {
    next(error);
  }
};

export const updateCounters = async (req, res, next) => {
  try {
    const { activeCounters } = req.body;

    const center = await ServiceCenter.findById(req.params.id);

    if (!center) {
      return next(
        new ErrorResponse(`Center not found with id ${req.params.id}`, 404)
      );
    }

    if (activeCounters > center.totalCounters) {
      return next(
        new ErrorResponse('Active counters cannot exceed total counters', 400)
      );
    }

    center.activeCounters = activeCounters;
    center.capacityPerSlot = activeCounters;

    await center.save();

    res.status(200).json({
      success: true,
      data: center,
      message: 'Counter capacity updated successfully'
    });
  } catch (error) {
    next(error);
  }
};
