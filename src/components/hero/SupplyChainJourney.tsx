import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sprout, 
  Truck, 
  Package, 
  Store, 
  QrCode, 
  MapPin, 
  Clock,
  ThermometerSun,
  Droplets,
  CheckCircle
} from 'lucide-react';

interface JourneyStep {
  id: string;
  title: string;
  location: string;
  icon: React.ComponentType<any>;
  status: 'completed' | 'active' | 'pending';
  timestamp?: string;
  details: {
    temperature?: string;
    humidity?: string;
    duration?: string;
    verification?: string;
  };
  coordinates: { x: number; y: number };
}

const SupplyChainJourney: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);
  const [pathProgress, setPathProgress] = useState(0);

  const [journeySteps, setJourneySteps] = useState<JourneyStep[]>([
    {
      id: 'farm',
      title: 'Farm Origin',
      location: 'Cuttack District, Odisha',
      icon: Sprout,
      status: 'completed',
      timestamp: '2024-01-15 06:30 AM',
      details: {
        temperature: '28°C',
        humidity: '65%',
        verification: 'Organic Certified',
      },
      coordinates: { x: 20, y: 80 },
    },
    {
      id: 'collection',
      title: 'Collection Center',
      location: 'Regional Hub, Cuttack',
      icon: Package,
      status: 'completed',
      timestamp: '2024-01-15 10:45 AM',
      details: {
        temperature: '25°C',
        humidity: '60%',
        duration: '2.5 hours',
      },
      coordinates: { x: 35, y: 60 },
    },
    {
      id: 'transport',
      title: 'In Transit',
      location: 'Highway to Bhubaneswar',
      icon: Truck,
      status: 'active',
      timestamp: '2024-01-15 02:15 PM',
      details: {
        temperature: '22°C',
        humidity: '58%',
        duration: 'Est. 1.2 hours',
      },
      coordinates: { x: 55, y: 45 },
    },
    {
      id: 'retail',
      title: 'Retail Store',
      location: 'Puri Market, Odisha',
      icon: Store,
      status: 'pending',
      details: {
        verification: 'Pending QR Scan',
      },
      coordinates: { x: 75, y: 35 },
    },
    {
      id: 'consumer',
      title: 'Consumer',
      location: 'Final Delivery',
      icon: QrCode,
      status: 'pending',
      details: {
        verification: 'Awaiting Purchase',
      },
      coordinates: { x: 90, y: 20 },
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev + 1) % journeySteps.length;
        setPathProgress(((next + 1) / journeySteps.length) * 100);
        
        setJourneySteps((prevSteps) =>
          prevSteps.map((step, index) => ({
            ...step,
            status: index < next ? 'completed' : index === next ? 'active' : 'pending',
            timestamp: index === next && !step.timestamp 
              ? new Date().toLocaleString() 
              : step.timestamp,
          }))
        );
        
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [journeySteps.length]);

  const getStatusColor = (status: JourneyStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10 border-success/50';
      case 'active':
        return 'text-primary bg-primary/10 border-primary/50';
      default:
        return 'text-muted-foreground bg-muted/30 border-border';
    }
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h3 className="text-2xl font-bold mb-2">Live Supply Chain Journey</h3>
        <p className="text-muted-foreground">Track your product from farm to table in real-time</p>
      </motion.div>

      <div className="relative">
        {/* Journey Map Background */}
        <div className="relative h-80 bg-gradient-to-br from-primary-light/20 to-accent/10 rounded-xl border border-border/30 overflow-hidden">
          {/* Animated Path */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--success))" />
                <stop offset="50%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
            
            <motion.path
              d={`M ${journeySteps[0].coordinates.x} ${journeySteps[0].coordinates.y} 
                  Q ${journeySteps[1].coordinates.x} ${journeySteps[1].coordinates.y - 10} ${journeySteps[1].coordinates.x} ${journeySteps[1].coordinates.y}
                  Q ${journeySteps[2].coordinates.x} ${journeySteps[2].coordinates.y - 5} ${journeySteps[2].coordinates.x} ${journeySteps[2].coordinates.y}
                  Q ${journeySteps[3].coordinates.x} ${journeySteps[3].coordinates.y + 5} ${journeySteps[3].coordinates.x} ${journeySteps[3].coordinates.y}
                  L ${journeySteps[4].coordinates.x} ${journeySteps[4].coordinates.y}`}
              stroke="url(#pathGradient)"
              strokeWidth="0.5"
              fill="none"
              strokeDasharray="2,2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: pathProgress / 100 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          </svg>

          {/* Journey Steps */}
          {journeySteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.status === 'active';
            const isCompleted = step.status === 'completed';

            return (
              <motion.div
                key={step.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ 
                  left: `${step.coordinates.x}%`, 
                  top: `${step.coordinates.y}%` 
                }}
                onMouseEnter={() => setHoveredStep(step.id)}
                onMouseLeave={() => setHoveredStep(null)}
                whileHover={{ scale: 1.1 }}
                animate={isActive ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 360, 0],
                } : {}}
                transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
              >
                <div 
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-lg ${getStatusColor(step.status)}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Status indicator */}
                {isCompleted && (
                  <motion.div
                    className="absolute -top-1 -right-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <CheckCircle className="h-4 w-4 text-success fill-current" />
                  </motion.div>
                )}

                {/* Hover Card */}
                <AnimatePresence>
                  {hoveredStep === step.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      className="absolute top-14 left-1/2 transform -translate-x-1/2 z-10"
                    >
                      <Card className="w-64 shadow-lg border border-border/50 bg-card/95 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <span>{step.title}</span>
                          </CardTitle>
                          <div className="text-xs text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {step.location}
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {step.timestamp && (
                            <div className="flex items-center text-xs text-muted-foreground mb-2">
                              <Clock className="h-3 w-3 mr-1" />
                              {step.timestamp}
                            </div>
                          )}
                          
                          <div className="space-y-1 text-xs">
                            {step.details.temperature && (
                              <div className="flex items-center justify-between">
                                <span className="flex items-center">
                                  <ThermometerSun className="h-3 w-3 mr-1" />
                                  Temperature
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {step.details.temperature}
                                </Badge>
                              </div>
                            )}
                            
                            {step.details.humidity && (
                              <div className="flex items-center justify-between">
                                <span className="flex items-center">
                                  <Droplets className="h-3 w-3 mr-1" />
                                  Humidity
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {step.details.humidity}
                                </Badge>
                              </div>
                            )}
                            
                            {step.details.verification && (
                              <Badge 
                                className={`text-xs ${
                                  step.status === 'completed' ? 'bg-success text-success-foreground' : ''
                                }`}
                              >
                                {step.details.verification}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <motion.div
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Journey Progress</span>
            <span>{Math.round(pathProgress)}% Complete</span>
          </div>
          <Progress value={pathProgress} className="h-2" />
        </motion.div>
      </div>
    </div>
  );
};

export default SupplyChainJourney;