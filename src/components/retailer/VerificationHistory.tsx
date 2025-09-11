import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, CheckCircle, Search, Calendar } from 'lucide-react';
import { useDemoStore } from '@/state/demoStore';
import { format } from 'date-fns';

export default function VerificationHistory() {
  const { state } = useDemoStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const verificationEvents = state.events.filter(event => 
    event.type === 'verified' || event.type === 'registration'
  );

  const getProductName = (productId: string) => {
    return state.products.find(p => p.id === productId)?.name || 'Unknown Product';
  };

  const getActorName = (actorId: string) => {
    return state.users.find(u => u.id === actorId)?.name || 'Unknown User';
  };

  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case 'verified':
        return <Badge className="bg-success text-success-foreground">Verified</Badge>;
      case 'registration':
        return <Badge className="bg-blockchain text-white">Registered</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const filteredEvents = verificationEvents.filter(event => {
    const matchesSearch = getProductName(event.productId).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.type === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Verification History</h1>
          <p className="text-muted-foreground">View all product verification records</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by product name or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="registration">Registration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Records */}
      <div className="grid gap-4">
        {filteredEvents.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <h3 className="text-lg font-semibold">{getProductName(event.productId)}</h3>
                    {getEventTypeBadge(event.type)}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Verified by:</span>
                      <p>{getActorName(event.actorId)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Location:</span>
                      <p>{event.location}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Date & Time:</span>
                      <p>{format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {event.notes && (
                <div className="p-3 bg-muted rounded-lg mb-4">
                  <p className="text-sm">{event.notes}</p>
                </div>
              )}

              {(event.temperature || event.humidity) && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {event.temperature && (
                    <div>
                      <span className="font-medium text-muted-foreground">Temperature:</span>
                      <span className="ml-2">{event.temperature}°C</span>
                    </div>
                  )}
                  {event.humidity && (
                    <div>
                      <span className="font-medium text-muted-foreground">Humidity:</span>
                      <span className="ml-2">{event.humidity}%</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredEvents.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || filterStatus !== 'all' 
                  ? 'No verification records match your filters' 
                  : 'No verification records found'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary Stats */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Verification Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-primary">{verificationEvents.length}</p>
              <p className="text-sm text-muted-foreground">Total Verifications</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-success">
                {verificationEvents.filter(e => e.type === 'verified').length}
              </p>
              <p className="text-sm text-muted-foreground">Products Verified</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-blockchain">
                {verificationEvents.filter(e => e.type === 'registration').length}
              </p>
              <p className="text-sm text-muted-foreground">Registrations</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">
                {Math.round((verificationEvents.filter(e => e.type === 'verified').length / verificationEvents.length) * 100) || 0}%
              </p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}