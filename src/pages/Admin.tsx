import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, BarChart3, Users, Activity, Database, AlertTriangle, Banknote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor system health and manage operations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* System Stats */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">Currently processing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">99.8%</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Trust Score Avg</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">87.2%</div>
              <p className="text-xs text-muted-foreground">Network average</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>Monitor and manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Farmers</span>
                  <Badge className="bg-success text-success-foreground">482 active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Transporters</span>
                  <Badge className="bg-blockchain text-white">156 active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Retailers</span>
                  <Badge className="bg-earth-orange text-white">203 active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Consumers</span>
                  <Badge className="bg-accent text-accent-foreground">406 active</Badge>
                </div>
              </div>
              <Button className="w-full mt-4" onClick={() => navigate('/manage-users')}>Manage Users</Button>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Health
              </CardTitle>
              <CardDescription>Real-time system monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Blockchain Network</span>
                  <Badge className="bg-success text-success-foreground">Healthy</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database</span>
                  <Badge className="bg-success text-success-foreground">Connected</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Services</span>
                  <Badge className="bg-success text-success-foreground">Online</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">QR Generator</span>
                  <Badge variant="secondary">Maintenance</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">View Details</Button>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                System Analytics
              </CardTitle>
              <CardDescription>Platform usage insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Daily Transactions</span>
                  <span className="font-medium">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Products Verified</span>
                  <span className="font-medium">2,856</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Trust Violations</span>
                  <span className="font-medium text-destructive">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Revenue (₹)</span>
                  <span className="font-medium">4,56,780</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/generate-report')}>Generate Report</Button>
            </CardContent>
          </Card>

          {/* Payment Oversight */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5" />
                Payment Oversight
              </CardTitle>
              <CardDescription>Monitor escrow system and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Active Escrows</span>
                  <span className="font-medium text-earth-orange">₹18,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Released Today</span>
                  <span className="font-medium text-success">₹6,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Disputed Payments</span>
                  <span className="font-medium text-destructive">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">System Revenue</span>
                  <span className="font-medium">₹2,340</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/payments')}>
                Payment Dashboard
              </Button>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Alerts
              </CardTitle>
              <CardDescription>System notifications and warnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm font-medium text-destructive">Trust Score Alert</p>
                  <p className="text-xs text-muted-foreground">User TRP002 dropped below 70%</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">System Maintenance</p>
                  <p className="text-xs text-muted-foreground">Scheduled backup completed</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">New User Registration</p>
                  <p className="text-xs text-muted-foreground">15 new farmers joined today</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/view-alerts')}>View All Alerts</Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}