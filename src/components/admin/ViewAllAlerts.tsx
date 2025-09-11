import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Search, Bell, CheckCircle, XCircle, Info, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';
type AlertStatus = 'active' | 'resolved' | 'dismissed';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  status: AlertStatus;
  category: string;
  createdAt: number;
  resolvedAt?: number;
  userId?: string;
  relatedId?: string;
}

// Demo alerts data
const demoAlerts: Alert[] = [
  {
    id: 'alert-1',
    title: 'Trust Score Alert',
    message: 'User TRP002 trust score dropped below 70%',
    severity: 'critical',
    status: 'active',
    category: 'trust_score',
    createdAt: Date.now() - 2 * 60 * 1000, // 2 minutes ago
    userId: 'transporter-1'
  },
  {
    id: 'alert-2',
    title: 'System Maintenance Completed',
    message: 'Scheduled backup and maintenance completed successfully',
    severity: 'success',
    status: 'resolved',
    category: 'system',
    createdAt: Date.now() - 60 * 60 * 1000, // 1 hour ago
    resolvedAt: Date.now() - 50 * 60 * 1000
  },
  {
    id: 'alert-3',
    title: 'High Volume Registration',
    message: '15 new farmers registered today - above average',
    severity: 'info',
    status: 'active',
    category: 'registration',
    createdAt: Date.now() - 3 * 60 * 60 * 1000 // 3 hours ago
  },
  {
    id: 'alert-4',
    title: 'Temperature Threshold Exceeded',
    message: 'Shipment SHIP-001 temperature exceeded safe limits',
    severity: 'warning',
    status: 'active',
    category: 'shipment',
    createdAt: Date.now() - 5 * 60 * 60 * 1000, // 5 hours ago
    relatedId: 'ship-1'
  },
  {
    id: 'alert-5',
    title: 'Payment Pending',
    message: 'Payment PAY-003 has been in escrow for over 48 hours',
    severity: 'warning',
    status: 'active',
    category: 'payment',
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    relatedId: 'pay-3'
  },
  {
    id: 'alert-6',
    title: 'QR Generator Service Down',
    message: 'QR code generation service is experiencing issues',
    severity: 'critical',
    status: 'active',
    category: 'system',
    createdAt: Date.now() - 30 * 60 * 1000 // 30 minutes ago
  },
  {
    id: 'alert-7',
    title: 'Successful Product Verification',
    message: '50+ products verified in the last hour',
    severity: 'success',
    status: 'active',
    category: 'verification',
    createdAt: Date.now() - 45 * 60 * 1000 // 45 minutes ago
  },
  {
    id: 'alert-8',
    title: 'Database Connection Issue',
    message: 'Brief database connectivity issue resolved',
    severity: 'warning',
    status: 'resolved',
    category: 'system',
    createdAt: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
    resolvedAt: Date.now() - 5.5 * 60 * 60 * 1000
  }
];

export default function ViewAllAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(demoAlerts);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
    }
  };

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500 text-white">Warning</Badge>;
      case 'info':
        return <Badge className="bg-blue-500 text-white">Info</Badge>;
      case 'success':
        return <Badge className="bg-success text-success-foreground">Success</Badge>;
    }
  };

  const getStatusBadge = (status: AlertStatus) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blockchain text-white">Active</Badge>;
      case 'resolved':
        return <Badge className="bg-success text-success-foreground">Resolved</Badge>;
      case 'dismissed':
        return <Badge variant="secondary">Dismissed</Badge>;
    }
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'resolved' as AlertStatus, resolvedAt: Date.now() }
        : alert
    ));
    toast.success('Alert marked as resolved');
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'dismissed' as AlertStatus }
        : alert
    ));
    toast.success('Alert dismissed');
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || alert.category === categoryFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus && matchesCategory;
  });

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">System Alerts</h1>
            <p className="text-muted-foreground">Monitor and manage system notifications</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {activeAlerts.length} Active
          </Badge>
          {criticalAlerts.length > 0 && (
            <Badge variant="destructive">
              {criticalAlerts.length} Critical
            </Badge>
          )}
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{criticalAlerts.length}</div>
            <div className="text-sm text-muted-foreground">Critical</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">
              {activeAlerts.filter(a => a.severity === 'warning').length}
            </div>
            <div className="text-sm text-muted-foreground">Warnings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{activeAlerts.length}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">
              {alerts.filter(a => a.status === 'resolved').length}
            </div>
            <div className="text-sm text-muted-foreground">Resolved</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Severities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="trust_score">Trust Score</SelectItem>
                <SelectItem value="shipment">Shipment</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="registration">Registration</SelectItem>
                <SelectItem value="verification">Verification</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <Card key={alert.id} className={cn(
            "border-l-4",
            alert.severity === 'critical' && "border-l-destructive",
            alert.severity === 'warning' && "border-l-yellow-500",
            alert.severity === 'info' && "border-l-blue-500",
            alert.severity === 'success' && "border-l-success"
          )}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getSeverityIcon(alert.severity)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{alert.title}</h3>
                      {getSeverityBadge(alert.severity)}
                      {getStatusBadge(alert.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Category: {alert.category.replace('_', ' ')}</span>
                      <span>Created: {format(new Date(alert.createdAt), 'MMM dd, HH:mm')}</span>
                      {alert.resolvedAt && (
                        <span>Resolved: {format(new Date(alert.resolvedAt), 'MMM dd, HH:mm')}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {alert.status === 'active' && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleResolveAlert(alert.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Resolve
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDismissAlert(alert.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Dismiss
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredAlerts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || severityFilter !== 'all' || statusFilter !== 'all' 
                  ? 'No alerts match your filters' 
                  : 'No alerts found'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}