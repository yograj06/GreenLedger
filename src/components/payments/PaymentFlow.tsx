import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, Truck, CheckCircle, Clock, User, Store } from 'lucide-react';
import { Payment } from '@/types';

interface PaymentFlowProps {
  payment: Payment;
}

export default function PaymentFlow({ payment }: PaymentFlowProps) {
  const getFlowSteps = () => [
    {
      id: 'created',
      title: 'Payment Created',
      description: 'Retailer initiates payment for product order',
      icon: User,
      status: 'completed',
      timestamp: payment.createdAt
    },
    {
      id: 'escrowed',
      title: 'Funds Escrowed',
      description: 'Payment secured in smart contract escrow',
      icon: Shield,
      status: payment.state === 'escrowed' || payment.state === 'released' ? 'completed' : 'pending',
      timestamp: payment.createdAt
    },
    {
      id: 'delivery',
      title: 'Delivery Confirmation',
      description: 'Transporter confirms successful delivery',
      icon: Truck,
      status: payment.escrowReleaseCondition === 'delivery_confirmed' && payment.state === 'released' ? 'completed' : 'pending',
      timestamp: payment.releasedAt
    },
    {
      id: 'released',
      title: 'Funds Released',
      description: 'Payment automatically released to farmer',
      icon: CheckCircle,
      status: payment.state === 'released' ? 'completed' : 'pending',
      timestamp: payment.releasedAt
    }
  ];

  const steps = getFlowSteps();

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'active':
        return 'text-earth-orange';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStepBg = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 border-success/20';
      case 'active':
        return 'bg-earth-orange/10 border-earth-orange/20';
      default:
        return 'bg-muted border-border';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Payment Flow Visualization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Flow Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;
              
              return (
                <div key={step.id} className="relative flex items-start gap-4">
                  {/* Connection Line */}
                  {!isLast && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-border" />
                  )}
                  
                  {/* Step Icon */}
                  <div className={`
                    relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2
                    ${getStepBg(step.status)}
                  `}>
                    <Icon className={`h-5 w-5 ${getStepColor(step.status)}`} />
                  </div>
                  
                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{step.title}</h4>
                      <Badge 
                        variant={step.status === 'completed' ? 'default' : 'secondary'}
                        className={step.status === 'completed' ? 'bg-success text-success-foreground' : ''}
                      >
                        {step.status === 'completed' ? 'Completed' : 'Pending'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {step.description}
                    </p>
                    {step.timestamp && step.status === 'completed' && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(step.timestamp).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Smart Contract Info */}
          <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Smart Contract Escrow</span>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div>• Funds are held securely in blockchain escrow</div>
              <div>• Automatic release based on delivery confirmation</div>
              <div>• Transparent and immutable transaction record</div>
              <div>• Multi-signature protection for disputes</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}