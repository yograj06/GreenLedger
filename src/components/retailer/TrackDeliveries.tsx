import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Truck, MapPin, Clock, Thermometer, Droplets } from 'lucide-react';
import { useDemoStore } from '@/state/demoStore';
import { format } from 'date-fns';

export default function TrackDeliveries() {
  const { state } = useDemoStore();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-success text-success-foreground">Delivered</Badge>;
      case 'in_transit':
        return <Badge className="bg-blockchain text-white">In Transit</Badge>;
      case 'picked_up':
        return <Badge className="bg-earth-orange text-white">Picked Up</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getProductName = (productIds: string[]) => {
    const products = productIds.map(id => state.products.find(p => p.id === id)).filter(Boolean);
    return products.map(p => p?.name).join(', ');
  };

  const getTransporterName = (transporterId: string) => {
    return state.users.find(u => u.id === transporterId)?.name || 'Unknown';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Truck className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Track Deliveries</h1>
          <p className="text-muted-foreground">Monitor your incoming and outgoing shipments</p>
        </div>
      </div>

      <div className="grid gap-6">
        {state.shipments.map((shipment) => (
          <Card key={shipment.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    {getProductName(shipment.productIds)}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Shipment ID: {shipment.id}
                  </p>
                </div>
                {getStatusBadge(shipment.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Route</span>
                  </div>
                  <p className="text-sm">{shipment.originDistrict} → {shipment.destinationDistrict}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Transporter</span>
                  </div>
                  <p className="text-sm">{getTransporterName(shipment.transporterId)}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Timeline</span>
                  </div>
                  <div className="text-sm">
                    {shipment.actualPickup && (
                      <p>Picked: {format(new Date(shipment.actualPickup), 'MMM dd, HH:mm')}</p>
                    )}
                    {shipment.estimatedDelivery && (
                      <p>ETA: {format(new Date(shipment.estimatedDelivery), 'MMM dd, HH:mm')}</p>
                    )}
                    {shipment.actualDelivery && (
                      <p>Delivered: {format(new Date(shipment.actualDelivery), 'MMM dd, HH:mm')}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Conditions</span>
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center gap-1">
                      <Thermometer className="h-3 w-3" />
                      <span>{shipment.temperature}°C</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Droplets className="h-3 w-3" />
                      <span>{shipment.humidity}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {shipment.currentLocation && (
                <div className="p-4 bg-muted rounded-lg mb-4">
                  <h4 className="font-medium mb-2">Current Location</h4>
                  <p className="text-sm text-muted-foreground">
                    Coordinates: {shipment.currentLocation.lat}, {shipment.currentLocation.lng}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {format(new Date(), 'MMM dd, HH:mm')}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm">View Details</Button>
                <Button variant="outline" size="sm">Contact Transporter</Button>
                {shipment.status === 'delivered' && (
                  <Button size="sm">Confirm Receipt</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {state.shipments.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No active deliveries found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}