import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, Package2, Scan, TrendingUp, AlertCircle, CreditCard } from 'lucide-react';
import PaymentEscrow from '@/components/payments/PaymentEscrow';
import { useDemoStore } from '@/state/demoStore';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Retailer() {
  const navigate = useNavigate();
  const { state } = useDemoStore();
  
  const currentUser = state.currentUser;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <Store className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Retailer Hub</h1>
            <p className="text-muted-foreground">Manage inventory and verify products</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Inventory Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package2 className="h-5 w-5" />
                Inventory Overview
              </CardTitle>
              <CardDescription>Current stock levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Rice (Premium)</p>
                    <p className="text-sm text-muted-foreground">45 bags remaining</p>
                  </div>
                  <Badge className="bg-success text-success-foreground">In Stock</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Wheat (Organic)</p>
                    <p className="text-sm text-muted-foreground">12 bags remaining</p>
                  </div>
                  <Badge variant="secondary">Low Stock</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Tomatoes</p>
                    <p className="text-sm text-muted-foreground">Out of stock</p>
                  </div>
                  <Badge variant="destructive">Empty</Badge>
                </div>
              </div>
              <Button className="w-full mt-4" onClick={() => navigate('/manage-inventory')}>Manage Inventory</Button>
            </CardContent>
          </Card>

          {/* Incoming Deliveries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Incoming Deliveries
              </CardTitle>
              <CardDescription>Expected shipments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium">Fresh Vegetables</p>
                    <Badge variant="outline">Today</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">From: Ravi Kumar Farm</p>
                  <p className="text-sm text-muted-foreground">ETA: 2:30 PM</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium">Organic Rice</p>
                    <Badge variant="outline">Tomorrow</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">From: Green Valley Farms</p>
                  <p className="text-sm text-muted-foreground">ETA: 10:00 AM</p>
                </div>
              </div>
              <Button className="w-full mt-4" onClick={() => navigate('/track-deliveries')}>Track Deliveries</Button>
            </CardContent>
          </Card>

          {/* Product Verification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5" />
                Product Verification
              </CardTitle>
              <CardDescription>Scan and verify products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-6 border-2 border-dashed rounded-lg">
                  <Scan className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Scan QR codes to verify product authenticity
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">Scan QR Code</Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/manual-entry')}>Manual Entry</Button>
                </div>
              </div>
              <Button className="w-full mt-4" onClick={() => navigate('/verification-history')}>Verification History</Button>
            </CardContent>
          </Card>

          {/* Payment Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Management
              </CardTitle>
              <CardDescription>Track outgoing payments and escrow</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentEscrow userRole="retailer" userId={currentUser?.id} />
              <Button className="w-full mt-4" onClick={() => navigate('/payments')}>
                View Payment Dashboard
              </Button>
            </CardContent>
          </Card>

          {/* Sales Analytics */}
          <Card className="md:col-span-2 lg:col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Sales Analytics
              </CardTitle>
              <CardDescription>Weekly performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">₹45,280</p>
                  <p className="text-sm text-muted-foreground">Weekly Revenue</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-success">156</p>
                  <p className="text-sm text-muted-foreground">Products Sold</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">28</p>
                  <p className="text-sm text-muted-foreground">Verified Items</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">4.7</p>
                  <p className="text-sm text-muted-foreground">Customer Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}