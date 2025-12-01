import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, AlertTriangle, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LocationStats {
  total_users: number;
  total_restricted: number;
  by_state: Array<{
    state_code: string;
    count: number;
    is_restricted: boolean;
  }>;
  recent_checks: Array<{
    id: string;
    state_code: string;
    city: string;
    is_restricted: boolean;
    detected_at: string;
  }>;
}

const LocationAnalytics: React.FC = () => {
  const { data: locationStats, isLoading } = useQuery({
    queryKey: ['admin-location-stats'],
    queryFn: async (): Promise<LocationStats> => {
      // Get location statistics
      const { data: locations } = await supabase
        .from('user_locations')
        .select('state_code, is_restricted, city, detected_at, id')
        .order('detected_at', { ascending: false });

      if (!locations) throw new Error('Failed to fetch location data');

      // Calculate stats
      const totalUsers = new Set(locations.map(l => l.id)).size;
      const totalRestricted = locations.filter(l => l.is_restricted).length;

      // Group by state
      const stateGroups = locations.reduce((acc, location) => {
        const key = location.state_code;
        if (!acc[key]) {
          acc[key] = { 
            state_code: key, 
            count: 0, 
            is_restricted: location.is_restricted 
          };
        }
        acc[key].count++;
        return acc;
      }, {} as Record<string, { state_code: string; count: number; is_restricted: boolean }>);

      const byState = Object.values(stateGroups)
        .sort((a, b) => b.count - a.count);

      return {
        total_users: totalUsers,
        total_restricted: totalRestricted,
        by_state: byState,
        recent_checks: locations.slice(0, 10),
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                <div className="h-8 bg-muted rounded w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!locationStats) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No location data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Location Checks</p>
                <p className="text-2xl font-bold">{locationStats.total_users}</p>
              </div>
              <Globe className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Restricted Access</p>
                <p className="text-2xl font-bold text-destructive">{locationStats.total_restricted}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available States</p>
                <p className="text-2xl font-bold text-green-600">48</p>
              </div>
              <MapPin className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Restricted States</p>
                <p className="text-2xl font-bold text-red-600">2</p>
                <p className="text-xs text-muted-foreground">ID, WA</p>
              </div>
              <Users className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* State Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top States by Access Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {locationStats.by_state.slice(0, 10).map((state, index) => (
                <div key={state.state_code} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">#{index + 1}</span>
                    <span className="font-medium">{state.state_code}</span>
                    {state.is_restricted && (
                      <Badge variant="destructive" className="text-xs">Restricted</Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">{state.count} checks</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Location Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {locationStats.recent_checks.map((check) => (
                <div key={check.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{check.city}, {check.state_code}</span>
                    {check.is_restricted && (
                      <Badge variant="destructive" className="text-xs">Restricted</Badge>
                    )}
                  </div>
                  <span className="text-muted-foreground">
                    {new Date(check.detected_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LocationAnalytics;