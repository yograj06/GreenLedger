// GreenLedger Odisha - Enhanced Agricultural Blockchain Landing Page

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useDemoStore } from '@/state/demoStore';
import FloatingParticles from '@/components/hero/FloatingParticles';
import BlockchainVisualization from '@/components/hero/BlockchainVisualization';
import InteractiveStats from '@/components/hero/InteractiveStats';
import SupplyChainJourney from '@/components/hero/SupplyChainJourney';
import { 
  Sprout, 
  Truck, 
  Store, 
  QrCode, 
  Shield, 
  TrendingUp, 
  MapPin,
  Leaf,
  Award,
  Banknote,
  Users,
  Activity,
  Zap
} from 'lucide-react';

const MotionCard = motion(Card);

const features = [
  {
    icon: Sprout,
    title: 'Farmer Registration',
    description: 'Register crops with blockchain verification and QR codes',
    color: 'text-success',
    bgColor: 'bg-success/10',
    link: '/farmer'
  },
  {
    icon: Truck,
    title: 'Transport Tracking',
    description: 'Real-time shipment tracking across Odisha districts',
    color: 'text-blockchain',
    bgColor: 'bg-blockchain/10',
    link: '/transporter'
  },
  {
    icon: Store,
    title: 'Retail Verification',
    description: 'Verify product authenticity and manage inventory',
    color: 'text-earth-orange',
    bgColor: 'bg-earth-orange/10',
    link: '/retailer'
  },
  {
    icon: QrCode,
    title: 'Consumer Verify',
    description: 'Scan QR codes to view complete product journey',
    color: 'text-accent-foreground',
    bgColor: 'bg-accent/10',
    link: '/verify/demo'
  },
  {
    icon: Award,
    title: 'Trust Scoring',
    description: 'AI-powered trust scores for all supply chain participants',
    color: 'text-trust-high',
    bgColor: 'bg-trust-high/10',
    link: '#'
  },
  {
    icon: Banknote,
    title: 'Smart Payments',
    description: 'Automated escrow and payment release system',
    color: 'text-neon-green',
    bgColor: 'bg-neon-green/10',
    link: '/payments'
  }
];

const stats = [
  { label: 'Districts Covered', value: '30', icon: MapPin },
  { label: 'Active Farmers', value: '1,200+', icon: Users },
  { label: 'Products Tracked', value: '5,800+', icon: Leaf },
  { label: 'Trust Score Avg', value: '87%', icon: TrendingUp }
];

const Index = () => {
  const { state } = useDemoStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-background to-accent/5" />
        <FloatingParticles />
        
        {/* Hero Content */}
        <div className="container relative px-4 z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <Badge className="mb-4 px-4 py-2 text-sm neon-glow animate-blockchain-pulse">
                <Activity className="mr-2 h-4 w-4" />
                🌾 Live Blockchain Network
              </Badge>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-4xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              <span className="hero-glow">GreenLedger</span>
              <br />
              <span className="text-2xl lg:text-4xl text-muted-foreground font-normal">
                Next-Gen Agricultural Supply Chain
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Experience the future of farming with AI-powered blockchain transparency, 
              real-time tracking, and smart contracts across all 30 districts of Odisha.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              {!state.currentUser ? (
                <Button size="lg" className="neon-glow animate-pulse-glow hover-glow cursor-trail">
                  <Sprout className="mr-2 h-5 w-5" />
                  Join the Revolution
                </Button>
              ) : (
                <Button asChild size="lg" className="neon-glow hover-glow">
                  <Link to={`/${state.currentUser.role}`}>
                    <Zap className="mr-2 h-5 w-5" />
                    Go to {state.currentUser.role} Hub
                  </Link>
                </Button>
              )}
              
              <Button asChild variant="outline" size="lg" className="hover-glow">
                <Link to="/verify/demo">
                  <QrCode className="mr-2 h-5 w-5" />
                  Try Live Verification
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Blockchain Visualization */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.8 }}
            className="mb-16"
          >
            <BlockchainVisualization />
          </motion.div>
        </div>
      </section>

      {/* Enhanced Interactive Stats Section */}
      <section className="py-20 bg-gradient-to-b from-muted/20 via-background to-muted/20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.05)_0%,transparent_70%)]" />
        <div className="container px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Real-Time Agricultural Intelligence
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Watch our AI-powered blockchain network grow in real-time across Odisha's agricultural landscape.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <InteractiveStats />
          </motion.div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Complete Supply Chain Solution
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of agricultural supply chain management with 
              our comprehensive platform designed specifically for Odisha.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <MotionCard
                  key={index}
                  variants={itemVariants}
                  className="interactive-card cursor-pointer group hover-glow border-border/50 bg-card/50 backdrop-blur-sm"
                  whileHover={{ scale: 1.03, rotateY: 5 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => feature.link !== '#' && (window.location.href = feature.link)}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <CardHeader>
                    <motion.div 
                      className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:animate-blockchain-pulse`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </motion.div>
                    <CardTitle className="group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base group-hover:text-foreground transition-colors duration-300">
                      {feature.description}
                    </CardDescription>
                    
                    {/* Interactive glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(var(--primary) / 0.1) 0%, transparent 50%)',
                      }}
                    />
                  </CardContent>
                </MotionCard>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Current User Dashboard Highlight */}
      {state.currentUser && (
        <section className="py-16 bg-primary/5">
          <div className="container px-4">
            <motion.div 
              className="text-center max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                Welcome back, {state.currentUser.name}!
              </h3>
              <p className="text-muted-foreground mb-6">
                You're currently using GreenLedger as a <span className="font-semibold capitalize">{state.currentUser.role}</span> 
                {' '}from <span className="font-semibold capitalize">{state.currentUser.district.replace('_', ' ')}</span>.
                Your trust score is <span className="font-bold text-trust-high">{state.currentUser.trustScore}%</span>.
              </p>
              <Button asChild size="lg" className="neon-glow">
                <Link to={`/${state.currentUser.role}`}>
                  <Shield className="mr-2 h-5 w-5" />
                  Go to Your Dashboard
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
