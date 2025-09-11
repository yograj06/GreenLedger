import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Truck, Package, MapPin, Clock, Star, Calendar, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDemoStore, storeUtils } from '@/state/demoStore';

export default function Transporter() {
  const { state } = useDemoStore();
  const [deliveriesOpen, setDeliveriesOpen] = useState(false);
  const [jobsOpen, setJobsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);

  // Get current transporter (for demo, using first transporter)
  const currentTransporter = state.users.find(u => u.role === 'transporter') || state.users[0];
  const transporterShipments = storeUtils.getShipmentsByTransporter(currentTransporter?.id || '', state);
  const allProducts = state.products;

  // Generate available jobs (products without assigned transporters)
  const availableJobs = allProducts.filter(p => 
    !transporterShipments.some(s => s.productIds.includes(p.id)) && 
    p.status === 'registered'
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <Truck className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Transport Hub</h1>
            <p className="text-muted-foreground">Manage deliveries and track shipments</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Active Deliveries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Active Deliveries
              </CardTitle>
              <CardDescription>Current shipments in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Rice Batch #R001</p>
                    <p className="text-sm text-muted-foreground">Cuttack → Bhubaneswar</p>
                  </div>
                  <Badge>In Transit</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Wheat Batch #W002</p>
                    <p className="text-sm text-muted-foreground">Sambalpur → Puri</p>
                  </div>
                  <Badge variant="secondary">Pickup</Badge>
                </div>
              </div>
              <Dialog open={deliveriesOpen} onOpenChange={setDeliveriesOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-4">View All Deliveries</Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>All Deliveries</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {transporterShipments.map((shipment) => {
                      const product = state.products.find(p => shipment.productIds.includes(p.id));
                      const farmer = state.users.find(u => u.id === product?.farmerId);
                      return (
                        <div key={shipment.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{product?.name || 'Unknown Product'}</h4>
                              <p className="text-sm text-muted-foreground">
                                {shipment.originDistrict} → {shipment.destinationDistrict}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Farmer: {farmer?.name || 'Unknown'}
                              </p>
                            </div>
                            <Badge variant={shipment.status === 'delivered' ? 'default' : 'secondary'}>
                              {shipment.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Created: {new Date(shipment.createdAt).toLocaleDateString()}
                            </div>
                            {shipment.actualDelivery && (
                              <div className="flex items-center gap-1">
                                <Package className="h-4 w-4" />
                                Delivered: {new Date(shipment.actualDelivery).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {transporterShipments.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No deliveries found</p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Available Jobs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Available Jobs
              </CardTitle>
              <CardDescription>New delivery opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium">Tomato Delivery</p>
                    <Badge variant="outline">₹2,500</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Berhampur → Brahmapur</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">2 hours ago</span>
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium">Potato Batch</p>
                    <Badge variant="outline">₹1,800</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Balasore → Cuttack</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">5 hours ago</span>
                  </div>
                </div>
              </div>
              <Dialog open={jobsOpen} onOpenChange={setJobsOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-4">Browse Jobs</Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Available Jobs</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {availableJobs.map((product) => {
                      const farmer = state.users.find(u => u.id === product.farmerId);
                      const estimatedEarnings = Math.round(product.quantity * product.pricePerUnit * 0.1); // 10% commission
                      return (
                        <div key={product.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                From: {product.district} • Farmer: {farmer?.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Quantity: {product.quantity} {product.unit}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="mb-2">₹{estimatedEarnings}</Badge>
                              <p className="text-xs text-muted-foreground">Estimated earnings</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>Posted: {new Date(product.createdAt).toLocaleDateString()}</span>
                            </div>
                            <Button size="sm">Accept Job</Button>
                          </div>
                        </div>
                      );
                    })}
                    {availableJobs.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No available jobs at the moment</p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Performance
              </CardTitle>
              <CardDescription>Your delivery statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Total Deliveries</span>
                  <span className="font-medium">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Success Rate</span>
                  <span className="font-medium text-success">98.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Average Rating</span>
                  <span className="font-medium">4.8/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Trust Score</span>
                  <span className="font-medium text-primary">92%</span>
                </div>
              </div>
              <Dialog open={statsOpen} onOpenChange={setStatsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mt-4">View Detailed Stats</Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Detailed Performance Statistics</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Performance Overview */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Performance Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span>Total Deliveries</span>
                          <span className="font-medium">{currentTransporter?.totalTransactions || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Successful Deliveries</span>
                          <span className="font-medium text-success">{currentTransporter?.successfulDeliveries || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Success Rate</span>
                          <span className="font-medium">
                            {currentTransporter?.totalTransactions ? 
                              Math.round((currentTransporter.successfulDeliveries / currentTransporter.totalTransactions) * 100) : 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Trust Score</span>
                          <span className="font-medium text-primary">{currentTransporter?.trustScore || 0}%</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {transporterShipments.slice(0, 5).map((shipment) => {
                            const product = state.products.find(p => shipment.productIds.includes(p.id));
                            return (
                              <div key={shipment.id} className="flex items-center justify-between text-sm">
                                <div>
                                  <p className="font-medium">{product?.name}</p>
                                  <p className="text-muted-foreground">{shipment.originDistrict} → {shipment.destinationDistrict}</p>
                                </div>
                                <Badge variant={shipment.status === 'delivered' ? 'default' : 'secondary'} className="text-xs">
                                  {shipment.status}
                                </Badge>
                              </div>
                            );
                          })}
                          {transporterShipments.length === 0 && (
                            <p className="text-muted-foreground text-center py-4">No recent activity</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Earnings Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-5 w-5" />
                          Earnings Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span>This Month</span>
                          <span className="font-medium">₹{Math.round(Math.random() * 50000 + 25000)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Month</span>
                          <span className="font-medium">₹{Math.round(Math.random() * 45000 + 20000)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Earnings</span>
                          <span className="font-medium">₹{Math.round(Math.random() * 200000 + 100000)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average per Delivery</span>
                          <span className="font-medium">₹{Math.round(Math.random() * 3000 + 1500)}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Ratings & Reviews */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Star className="h-5 w-5" />
                          Ratings & Reviews
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {state.ratings.filter(r => r.targetId === currentTransporter?.id).slice(0, 3).map((rating) => {
                            const reviewer = state.users.find(u => u.id === rating.fromId);
                            return (
                              <div key={rating.id} className="border-b pb-3 last:border-b-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-sm">{reviewer?.name}</span>
                                  <div className="flex items-center gap-1">
                                    {Array.from({ length: rating.stars }).map((_, i) => (
                                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">{rating.comment}</p>
                              </div>
                            );
                          })}
                          {state.ratings.filter(r => r.targetId === currentTransporter?.id).length === 0 && (
                            <p className="text-muted-foreground text-center py-4">No reviews yet</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}