import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, Users, Leaf, TrendingUp, Activity, Clock } from 'lucide-react';

interface StatData {
  id: string;
  label: string;
  value: number;
  target: number;
  icon: React.ComponentType<any>;
  unit: string;
  color: string;
  bgColor: string;
  description: string;
}

const InteractiveStats: React.FC = () => {
  const [stats, setStats] = useState<StatData[]>([
    {
      id: 'districts',
      label: 'Districts Covered',
      value: 0,
      target: 30,
      icon: MapPin,
      unit: '',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'Across all of Odisha',
    },
    {
      id: 'farmers',
      label: 'Active Farmers',
      value: 0,
      target: 1247,
      icon: Users,
      unit: '',
      color: 'text-success',
      bgColor: 'bg-success/10',
      description: 'Registered & verified',
    },
    {
      id: 'products',
      label: 'Products Tracked',
      value: 0,
      target: 5843,
      icon: Leaf,
      unit: '',
      color: 'text-earth-orange',
      bgColor: 'bg-earth-orange/10',
      description: 'End-to-end visibility',
    },
    {
      id: 'trust',
      label: 'Avg Trust Score',
      value: 0,
      target: 87,
      icon: TrendingUp,
      unit: '%',
      color: 'text-trust-high',
      bgColor: 'bg-trust-high/10',
      description: 'AI-calculated reliability',
    },
  ]);

  const [liveMetrics, setLiveMetrics] = useState({
    activeTransactions: 0,
    newVerifications: 0,
    lastUpdate: new Date(),
  });

  useEffect(() => {
    // Animate counters
    const animateCounters = () => {
      setStats(prevStats =>
        prevStats.map(stat => ({
          ...stat,
          value: Math.min(stat.value + Math.ceil(stat.target / 60), stat.target),
        }))
      );
    };

    const counterInterval = setInterval(animateCounters, 50);

    // Simulate live metrics
    const metricsInterval = setInterval(() => {
      setLiveMetrics(prev => ({
        activeTransactions: Math.floor(Math.random() * 15) + 5,
        newVerifications: Math.floor(Math.random() * 8) + 2,
        lastUpdate: new Date(),
      }));
    }, 2000);

    return () => {
      clearInterval(counterInterval);
      clearInterval(metricsInterval);
    };
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const progress = (stat.value / stat.target) * 100;
          
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  
                  <motion.div
                    className={`text-2xl lg:text-3xl font-bold ${stat.color} mb-1`}
                    key={stat.value}
                    initial={{ scale: 1.2, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    {formatNumber(stat.value)}{stat.unit}
                  </motion.div>
                  
                  <div className="text-sm font-medium text-foreground mb-2">
                    {stat.label}
                  </div>
                  
                  <div className="text-xs text-muted-foreground mb-2">
                    {stat.description}
                  </div>
                  
                  <Progress 
                    value={progress} 
                    className="h-1.5"
                  />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Live Activity Bar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex items-center justify-center space-x-6 p-4 bg-muted/30 rounded-lg border border-border/30"
      >
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-success"
          />
          <span className="text-sm text-muted-foreground">Live:</span>
          <Badge variant="outline" className="text-success border-success/50">
            <Activity className="h-3 w-3 mr-1" />
            {liveMetrics.activeTransactions} Active Txns
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-primary border-primary/50">
            <Clock className="h-3 w-3 mr-1" />
            {liveMetrics.newVerifications} New Verifications
          </Badge>
        </div>

        <div className="text-xs text-muted-foreground">
          Last updated: {liveMetrics.lastUpdate.toLocaleTimeString()}
        </div>
      </motion.div>
    </div>
  );
};

export default InteractiveStats;