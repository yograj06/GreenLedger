// Role switcher component for changing user context

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useDemoStore, storeUtils } from '@/state/demoStore';
import { UserRole, UserProfile } from '@/types';
import { User, Truck, Store, Users, Shield } from 'lucide-react';

const roleIcons: Record<UserRole, React.ReactNode> = {
  farmer: <User className="h-5 w-5" />,
  transporter: <Truck className="h-5 w-5" />,
  retailer: <Store className="h-5 w-5" />,
  consumer: <Users className="h-5 w-5" />,
  admin: <Shield className="h-5 w-5" />
};

const roleColors: Record<UserRole, string> = {
  farmer: 'bg-success text-success-foreground',
  transporter: 'bg-blockchain text-white',
  retailer: 'bg-earth-orange text-white',
  consumer: 'bg-accent text-accent-foreground',
  admin: 'bg-primary text-primary-foreground'
};

const roleDescriptions: Record<UserRole, string> = {
  farmer: 'Register crops, manage products, track deliveries',
  transporter: 'Accept jobs, update shipment status, earn trust',
  retailer: 'Receive deliveries, verify products, manage inventory',
  consumer: 'Verify product authenticity, rate experiences',
  admin: 'Monitor system, view analytics, generate reports'
};

export function RoleSwitcher() {
  const { state, dispatch } = useDemoStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleUserSelect = (user: UserProfile) => {
    dispatch({ type: 'SET_CURRENT_USER', payload: user });
    setIsOpen(false);
  };

  const usersByRole = React.useMemo(() => {
    const grouped: Record<UserRole, UserProfile[]> = {
      farmer: [],
      transporter: [],
      retailer: [],
      consumer: [],
      admin: []
    };

    state.users.forEach(user => {
      grouped[user.role].push(user);
    });

    return grouped;
  }, [state.users]);

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return 'text-trust-high';
    if (score >= 70) return 'text-trust-medium';
    return 'text-trust-low';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          {state.currentUser ? (
            <>
              {roleIcons[state.currentUser.role]}
              <span className="hidden sm:inline">{state.currentUser.name}</span>
              <span className="sm:hidden capitalize">{state.currentUser.role}</span>
            </>
          ) : (
            <>
              <User className="h-4 w-4" />
              Select Role
            </>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            🌿 Switch Role - GreenLedger Odisha
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {Object.entries(usersByRole).map(([role, users]) => {
            if (users.length === 0) return null;
            
            return (
              <div key={role} className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className={roleColors[role as UserRole]} variant="secondary">
                    {roleIcons[role as UserRole]}
                    <span className="ml-2 capitalize font-semibold">{role}</span>
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {roleDescriptions[role as UserRole]}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {users.map(user => (
                    <Card 
                      key={user.id} 
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md card-hover ${
                        state.currentUser?.id === user.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleUserSelect(user)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className={roleColors[user.role]}>
                              {user.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold truncate">{user.name}</h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {user.district.replace('_', ' ')}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <div className={`text-sm font-medium ${getTrustScoreColor(user.trustScore)}`}>
                              {user.trustScore}% Trust
                            </div>
                            {user.totalTransactions > 0 && (
                              <div className="text-xs text-muted-foreground">
                                {user.totalTransactions} transactions
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground text-center">
            Select a role to experience GreenLedger from different perspectives
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}