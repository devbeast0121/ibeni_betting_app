import React from 'react';
import { AlertTriangle, MapPin, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGeolocation } from '@/hooks/useGeolocation';

interface GeographicRestrictionProps {
  onLocationVerified: () => void;
}

const GeographicRestriction: React.FC<GeographicRestrictionProps> = ({ onLocationVerified }) => {
  const { location, loading, error, isRestricted, recheckLocation } = useGeolocation();

  React.useEffect(() => {
    if (!loading && !isRestricted) {
      onLocationVerified();
    }
  }, [loading, isRestricted, onLocationVerified]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="animate-spin">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Verifying Location</h2>
              <p className="text-xs md:text-sm text-muted-foreground">
                We're checking if ibeni is available in your location...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isRestricted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Service Not Available
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-destructive/50 bg-destructive/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-destructive">
                <strong>ibeni is not currently available in your state.</strong>
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <p className="text-xs md:text-sm">
                We've detected that you're accessing ibeni from{' '}
                <span className="font-medium">{location?.city}, {location?.state_code}</span>.
              </p>
              
              <p className="text-xs md:text-sm text-muted-foreground">
                Unfortunately, ibeni's sweepstakes entertainment platform is not available 
                in Idaho (ID) and Washington (WA) due to state regulations.
              </p>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Available States</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  ibeni is available in 48 states plus D.C. We're working to expand 
                  availability as regulations permit.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                variant="outline" 
                onClick={recheckLocation}
                className="w-full"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Recheck Location
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                If you believe this is an error or you're traveling, 
                click "Recheck Location" to verify your current location.
              </p>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Legal Compliance:</strong> State availability is determined by applicable laws and regulations.</p>
              <p><strong>VPN Notice:</strong> Use of VPNs or location spoofing to circumvent geographic restrictions is prohibited.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !location) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
              <h2 className="text-xl font-semibold">Location Check Failed</h2>
              <p className="text-xs md:text-sm text-muted-foreground">
                We couldn't verify your location. You can continue, but some features may be restricted.
              </p>
              <div className="space-y-2 w-full">
                <Button onClick={recheckLocation} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={onLocationVerified} className="w-full">
                  Continue Anyway
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Location verified and not restricted - this component won't be visible
  return null;
};

export default GeographicRestriction;