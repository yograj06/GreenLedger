import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import PaymentEscrow from '@/components/payments/PaymentEscrow';
import PaymentFlow from '@/components/payments/PaymentFlow';
import { useDemoStore } from '@/state/demoStore';
import { Shield, TrendingUp, Users, AlertCircle, Banknote, Wallet } from 'lucide-react';
import { Payment } from '@/types';

export default function PaymentDashboard() {
  const { state } = useDemoStore();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const paymentStats = {
    totalVolume: state.payments.reduce((sum, p) => sum + p.amount, 0),
    activeEscrows: state.payments.filter(p => p.state === 'escrowed').length,
    completedPayments: state.payments.filter(p => p.state === 'released').length,
    disputedPayments: state.payments.filter(p => p.state === 'disputed').length,
  };

  const getPaymentTrend = () => {
    const recentPayments = state.payments.filter(
      p => p.createdAt > Date.now() - 30 * 24 * 60 * 60 * 1000
    );
    return recentPayments.length;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold hero-glow">Smart Payment Escrow System</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Secure, transparent, and automated payment processing for the agricultural supply chain.
          Built on blockchain technology with smart contract escrow protection.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover neon-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Volume</p>
                <h3 className="text-2xl font-bold text-primary">
                  ₹{paymentStats.totalVolume.toLocaleString()}
                </h3>
              </div>
              <Banknote className="h-8 w-8 text-primary" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-success mr-1" />
              <span className="text-success">+{getPaymentTrend()} this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Escrows</p>
                <h3 className="text-2xl font-bold text-earth-orange">
                  {paymentStats.activeEscrows}
                </h3>
              </div>
              <Shield className="h-8 w-8 text-earth-orange" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Funds secured in escrow
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <h3 className="text-2xl font-bold text-success">
                  {paymentStats.completedPayments}
                </h3>
              </div>
              <Wallet className="h-8 w-8 text-success" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Successfully released
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Disputes</p>
                <h3 className="text-2xl font-bold text-destructive">
                  {paymentStats.disputedPayments}
                </h3>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Require admin review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Payment Overview</TabsTrigger>
          <TabsTrigger value="flows">Payment Flows</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <PaymentEscrow userRole="admin" />
        </TabsContent>

        <TabsContent value="flows" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Payment to View Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {state.payments.map((payment) => (
                    <Button
                      key={payment.id}
                      variant={selectedPayment?.id === payment.id ? "default" : "outline"}
                      className="w-full justify-between"
                      onClick={() => setSelectedPayment(payment)}
                    >
                      <span>Payment #{payment.id.slice(-4)}</span>
                      <Badge variant="secondary">
                        ₹{payment.amount.toLocaleString()}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedPayment && (
              <PaymentFlow payment={selectedPayment} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['escrowed', 'released', 'disputed', 'refunded'].map((status) => {
                    const count = state.payments.filter(p => p.state === status).length;
                    const percentage = state.payments.length > 0 ? (count / state.payments.length) * 100 : 0;
                    
                    return (
                      <div key={status} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{status}</span>
                          <span>{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              status === 'escrowed' ? 'bg-earth-orange' :
                              status === 'released' ? 'bg-success' :
                              status === 'disputed' ? 'bg-destructive' :
                              'bg-warning'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Escrow Protection</h4>
                      <p className="text-sm text-muted-foreground">
                        Funds held securely until delivery confirmation
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Multi-Party Trust</h4>
                      <p className="text-sm text-muted-foreground">
                        Transparent process for farmers, retailers, and transporters
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Automated Releases</h4>
                      <p className="text-sm text-muted-foreground">
                        Smart contracts execute payments based on delivery status
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}