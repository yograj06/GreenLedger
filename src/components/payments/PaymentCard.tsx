import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, CheckCircle, Clock, AlertTriangle, ExternalLink } from 'lucide-react';
import { Payment, PaymentState } from '@/types';
import { format } from 'date-fns';

interface PaymentCardProps {
  payment: Payment;
  productName?: string;
  userName?: string;
  userRole?: 'farmer' | 'retailer' | 'admin';
  onViewDetails?: () => void;
}

export default function PaymentCard({ 
  payment, 
  productName = 'Unknown Product', 
  userName = 'Unknown User',
  userRole,
  onViewDetails 
}: PaymentCardProps) {
  
  const getStatusBadge = (state: PaymentState) => {
    switch (state) {
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

  const getStatusIcon = (state: PaymentState) => {
    switch (state) {
      case 'escrowed':
        return <Shield className="h-4 w-4 text-earth-orange" />;
      case 'released':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'disputed':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'refunded':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <Shield className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getProgress = (state: PaymentState) => {
    switch (state) {
      case 'escrowed': return 50;
      case 'released': return 100;
      case 'refunded': return 25;
      case 'disputed': return 75;
      default: return 0;
    }
  };

  return (
    <Card className="card-hover">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getStatusIcon(payment.state)}
            <div>
              <h4 className="font-medium text-sm">{productName}</h4>
              <p className="text-xs text-muted-foreground">
                {userRole === 'farmer' ? 'From' : 'To'}: {userName}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-sm">₹{payment.amount.toLocaleString()}</div>
            {getStatusBadge(payment.state)}
          </div>
        </div>

        {/* Payment Progress */}
        <div className="space-y-1 mb-3">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span>{getProgress(payment.state)}%</span>
          </div>
          <Progress value={getProgress(payment.state)} className="h-1" />
        </div>

        {/* Payment Details */}
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
          <div>
            <span className="font-medium">Created:</span>
            <div>{format(new Date(payment.createdAt), 'MMM dd')}</div>
          </div>
          <div>
            <span className="font-medium">Condition:</span>
            <div className="capitalize">
              {payment.escrowReleaseCondition.replace('_', ' ')}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs h-8">
            <ExternalLink className="h-3 w-3 mr-1" />
            Blockchain
          </Button>
          {onViewDetails && (
            <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={onViewDetails}>
              Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}