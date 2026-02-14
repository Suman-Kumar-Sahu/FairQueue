import fetch from 'node-fetch';
import { ErrorResponse } from '../middleware/errorHandler.js';

export const getCoordinates = async (req, res, next) => {
  try {
    const { street, city, state, pincode } = req.query;

    if (!city && !pincode) {
      return next(
        new ErrorResponse('Please provide at least city or pincode', 400)
      );
    }

    const addressParts = [];
    if (street) addressParts.push(street);
    if (city) addressParts.push(city);
    if (state) addressParts.push(state);
    if (pincode) addressParts.push(pincode);
    addressParts.push('India');

    const query = addressParts.join(', ');
    
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'QueueManagementApp/1.0', 
      },
    });

    if (!response.ok) {
      console.error('❌ Response not OK:', response.status, response.statusText);
      return next(
        new ErrorResponse('Failed to fetch coordinates from geocoding service', 500)
      );
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon, display_name } = data[0];
      
      console.log('✅ Found coordinates:', { lat, lon, display_name });
      
      res.status(200).json({
        success: true,
        data: {
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          displayName: display_name,
        },
      });
    } else {
      if (street && city && state) {
        const simpleQuery = `${city}, ${state}, India`;
        const simpleUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(simpleQuery)}&limit=1`;
        
        const retryResponse = await fetch(simpleUrl, {
          headers: {
            'User-Agent': 'QueueManagementApp/1.0',
          },
        });
        
        const retryData = await retryResponse.json();
        
        if (retryData && retryData.length > 0) {
          const { lat, lon, display_name } = retryData[0];
          console.log('✅ Found coordinates on retry:', { lat, lon });
          
          return res.status(200).json({
            success: true,
            data: {
              latitude: parseFloat(lat),
              longitude: parseFloat(lon),
              displayName: display_name,
            },
          });
        }
      }
      
      return next(
        new ErrorResponse(
          'Could not find coordinates for this address. Please try entering more details.',
          404
        )
      );
    }
  } catch (error) {
    console.error('❌ Geocoding error:', error);
    next(
      new ErrorResponse(
        'Failed to fetch coordinates. Please try again later.',
        500
      )
    );
  }
};