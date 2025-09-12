// Main layout component with navigation

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useDemoStore } from '@/state/demoStore';
import { Home, Sprout, Truck, Store, Shield, QrCode, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { state } = useDemoStore();

  const getNavItems = () => {
    const baseItems = [
      { to: '/', icon: Home, label: 'Home', roles: ['farmer', 'transporter', 'retailer', 'consumer', 'admin'] }
    ];

    if (state.currentUser) {
      switch (state.currentUser.role) {
        case 'farmer':
          baseItems.push(
            { to: '/farmer', icon: Sprout, label: 'Farmer Hub', roles: ['farmer'] }
          );
          break;
        case 'transporter':
          baseItems.push(
            { to: '/transporter', icon: Truck, label: 'Transport Hub', roles: ['transporter'] }
          );
          break;
        case 'retailer':
          baseItems.push(
            { to: '/retailer', icon: Store, label: 'Retailer Hub', roles: ['retailer'] }
          );
          break;
        case 'admin':
          baseItems.push(
            { to: '/admin', icon: Shield, label: 'Admin Dashboard', roles: ['admin'] },
            { to: '/payments', icon: CreditCard, label: 'Payments', roles: ['admin'] }
          );
          break;
      }
    }

    baseItems.push(
      { to: '/verify/demo', icon: QrCode, label: 'Verify Product', roles: ['farmer', 'transporter', 'retailer', 'consumer', 'admin'] }
    );

    return baseItems.filter(item => 
      !state.currentUser || item.roles.includes(state.currentUser.role)
    );
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <motion.span 
              className="hero-glow"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              🌿 GreenLedger
            </motion.span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              
              return (
                <Button
                  key={item.to}
                  asChild
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Link to={item.to}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <RoleSwitcher />
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation */}
      <div className="md:hidden border-b bg-background">
        <div className="container px-4 py-2">
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              
              return (
                <Button
                  key={item.to}
                  asChild
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className="gap-2 whitespace-nowrap"
                >
                  <Link to={item.to}>
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{item.label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.main 
        className="flex-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                © 2024 GreenLedger - Agricultural Supply Chain Demo
              </span>
              <Badge variant="secondary" className="blockchain-badge text-xs">
                Blockchain Simulated
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {state.currentUser && (
                <>
                  <span>Logged in as: {state.currentUser.name}</span>
                  <Badge className="trust-badge">
                    Trust: {state.currentUser.trustScore}%
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}