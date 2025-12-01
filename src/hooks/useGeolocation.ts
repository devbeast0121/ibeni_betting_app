import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LocationData {
  country_code: string;
  state_code: string;
  city: string;
  is_restricted: boolean;
}

interface GeolocationState {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  isRestricted: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: true,
    error: null,
    isRestricted: false,
  });

  useEffect(() => {
    const checkLocation = async () => {
      try {
        // First check if we have a cached location check
        const cachedCheck = localStorage.getItem('ibeni_location_check');
        const cachedTime = localStorage.getItem('ibeni_location_check_time');
        
        if (cachedCheck && cachedTime) {
          const hoursSinceCheck = (Date.now() - parseInt(cachedTime)) / (1000 * 60 * 60);
          if (hoursSinceCheck < 24) { // Cache for 24 hours
            const cached = JSON.parse(cachedCheck);
            setState({
              location: cached,
              loading: false,
              error: null,
              isRestricted: cached.is_restricted,
            });
            return;
          }
        }

        // Get IP-based location using a free service
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('Failed to get location');
        
        const data = await response.json();
        
        // Get restricted states from database
        const { data: restrictedStates } = await supabase
          .from('restricted_states')
          .select('state_code')
          .eq('is_active', true);

        const restrictedStateCodes = restrictedStates?.map(s => s.state_code) || [];
        const isRestricted = restrictedStateCodes.includes(data.region_code);

        const locationData: LocationData = {
          country_code: data.country_code || 'US',
          state_code: data.region_code || 'XX',
          city: data.city || 'Unknown',
          is_restricted: isRestricted,
        };

        // Save to database if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('user_locations')
            .insert({
              user_id: user.id,
              ip_address: data.ip,
              country_code: locationData.country_code,
              state_code: locationData.state_code,
              city: locationData.city,
              is_restricted: locationData.is_restricted,
            });
        }

        // Cache the result
        localStorage.setItem('ibeni_location_check', JSON.stringify(locationData));
        localStorage.setItem('ibeni_location_check_time', Date.now().toString());

        setState({
          location: locationData,
          loading: false,
          error: null,
          isRestricted,
        });

      } catch (error) {
        console.error('Geolocation error:', error);
        
        // Fallback: assume US location but don't restrict
        const fallbackLocation: LocationData = {
          country_code: 'US',
          state_code: 'XX',
          city: 'Unknown',
          is_restricted: false,
        };

        setState({
          location: fallbackLocation,
          loading: false,
          error: 'Unable to determine location',
          isRestricted: false,
        });
      }
    };

    checkLocation();
  }, []);

  const recheckLocation = () => {
    localStorage.removeItem('ibeni_location_check');
    localStorage.removeItem('ibeni_location_check_time');
    setState(prev => ({ ...prev, loading: true }));
    
    // Trigger recheck after clearing cache
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return {
    ...state,
    recheckLocation,
  };
};