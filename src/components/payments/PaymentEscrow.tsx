import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, Wallet, Clock, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { useDemoStore } from '@/state/demoStore';
import { Payment, PaymentState } from '@/types';
import { format } from 'date-fns';

interface PaymentEscrowProps {
  userRole?: 'farmer' | 'retailer' | 'admin';
  userId?: string;
}

export default function PaymentEscrow({ userRole, userId }: PaymentEscrowProps) {
  const { state } = useDemoStore();

  const getRelevantPayments = () => {
    if (!userRole || !userId) return state.payments;
    
    switch (userRole) {
      case 'farmer':
        return state.payments.filter(payment => payment.payeeId === userId);
      case 'retailer':
        return state.payments.filter(payment => payment.payerId === userId);
      default:
        return state.payments;
    }
  };

  const getPaymentStatusBadge = (paymentState: PaymentState) => {
    switch (paymentState) {
      case 'escrowed':
        return <Badge className="bg-earth-orange text-white">Escrowed</Badge>;
      case 'released':
        return <Badge className="bg-success text-success-foreground">Released</Badge>;
      case 'disputed':
        return <Badge className="bg-destructive text-destructive-foreground">Disputed</Badge>;
      case 'refunded':
        return <Badge className="bg-warning text-warning-foreground">Refunded</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPaymentProgress = (payment: Payment) => {
    switch (payment.state) {
      case 'escrowed': return 50;
      case 'released': return 100;
      case 'refunded': return 25;
      case 'disputed': return 75;
      default: return 0;
    }
  };

  const getPaymentIcon = (paymentState: PaymentState) => {
    switch (paymentState) {
      case 'escrowed':
        return <Shield className="h-5 w-5 text-earth-orange" />;
      case 'released':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'disputed':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'refunded':
        return <Clock className="h-5 w-5 text-warning" />;
      default:
        return <Wallet className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getUserName = (userId: string) => {
    return state.users.find(u => u.id === userId)?.name || 'Unknown User';
  };

  const getProductName = (productId?: string) => {
    if (!productId) return 'Unknown Product';
    return state.products.find(p => p.id === productId)?.name || 'Unknown Product';
  };

  const payments = getRelevantPayments();
  const totalEscrowed = payments
    .filter(p => p.state === 'escrowed')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalReleased = payments
    .filter(p => p.state === 'released')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Escrowed</p>
                <h3 className="text-2xl font-bold text-earth-orange">₹{totalEscrowed.toLocaleString()}</h3>
              </div>
              <Shield className="h-8 w-8 text-earth-orange" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Funds held in secure escrow
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Released</p>
                <h3 className="text-2xl font-bold text-success">₹{totalReleased.toLocaleString()}</h3>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Successfully completed payments
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Escrows</p>
                <h3 className="text-2xl font-bold text-primary">
                  {payments.filter(p => p.state === 'escrowed').length}
                </h3>
              </div>
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Awaiting release conditions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Smart Payment Escrow System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getPaymentIcon(payment.state)}
                    <div>
                      <h4 className="font-medium">{getProductName(payment.productId)}</h4>
                      <div className="text-sm text-muted-foreground">
                        {userRole === 'farmer' ? 'From' : 'To'}: {
                          userRole === 'farmer' 
                            ? getUserName(payment.payerId)
                            : getUserName(payment.payeeId)
                        }
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">₹{payment.amount.toLocaleString()}</div>
                    {getPaymentStatusBadge(payment.state)}
                  </div>
                </div>

                {/* Payment Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Payment Progress</span>
                    <span>{getPaymentProgress(payment)}%</span>
                  </div>
                  <Progress value={getPaymentProgress(payment)} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Created</span>
                    <span>Escrowed</span>
                    <span>Released</span>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Created:</span>
                    <div className="text-muted-foreground">
                      {format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Release Condition:</span>
                    <div className="text-muted-foreground capitalize">
                      {payment.escrowReleaseCondition.replace('_', ' ')}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <div className="text-muted-foreground capitalize">
                      {payment.state}
                    </div>
                  </div>
                </div>

                {payment.releasedAt && (
                  <div className="text-sm">
                    <span className="font-medium">Released:</span>
                    <span className="text-muted-foreground ml-2">
                      {format(new Date(payment.releasedAt), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View on Blockchain
                  </Button>
                  {payment.state === 'escrowed' && userRole === 'admin' && (
                    <Button variant="outline" size="sm">
                      Release Funds
                    </Button>
                  )}
                  {payment.state === 'escrowed' && (
                    <Button variant="outline" size="sm">
                      Track Delivery
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {payments.length === 0 && (
              <div className="text-center py-12">
                <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No payment records found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}