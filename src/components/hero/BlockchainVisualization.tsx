import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Sprout, Truck, Store, QrCode, Shield } from 'lucide-react';

interface BlockData {
  id: number;
  stage: string;
  icon: React.ComponentType<any>;
  location: string;
  timestamp: string;
  hash: string;
  verified: boolean;
}

const BlockchainVisualization: React.FC = () => {
  const [activeBlock, setActiveBlock] = useState(0);
  const [blocks, setBlocks] = useState<BlockData[]>([
    {
      id: 1,
      stage: 'Farm Origin',
      icon: Sprout,
      location: 'Cuttack District',
      timestamp: new Date().toLocaleTimeString(),
      hash: '0x2f4a...8b1c',
      verified: true,
    },
    {
      id: 2,
      stage: 'Transport',
      icon: Truck,
      location: 'Bhubaneswar Hub',
      timestamp: '',
      hash: '0x9c1e...3f7a',
      verified: false,
    },
    {
      id: 3,
      stage: 'Retail',
      icon: Store,
      location: 'Puri Market',
      timestamp: '',
      hash: '0x5d8a...9e2f',
      verified: false,
    },
    {
      id: 4,
      stage: 'Consumer',
      icon: QrCode,
      location: 'End Customer',
      timestamp: '',
      hash: '0x1b3c...4a9d',
      verified: false,
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBlock((prev) => {
        const next = (prev + 1) % blocks.length;
        setBlocks((prevBlocks) =>
          prevBlocks.map((block, index) => ({
            ...block,
            verified: index <= next,
            timestamp: index === next ? new Date().toLocaleTimeString() : block.timestamp,
          }))
        );
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [blocks.length]);

  return (
    <div className="relative">
      <motion.div 
        className="flex items-center justify-center space-x-4 p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {blocks.map((block, index) => {
          const Icon = block.icon;
          const isActive = index === activeBlock;
          const isCompleted = block.verified;
          
          return (
            <React.Fragment key={block.id}>
              <motion.div
                className={`relative p-4 rounded-lg border-2 transition-all duration-500 ${
                  isActive 
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
                    : isCompleted 
                      ? 'border-success bg-success/10' 
                      : 'border-border bg-muted/30'
                }`}
                whileHover={{ scale: 1.05 }}
                animate={isActive ? { 
                  boxShadow: '0 0 20px hsl(var(--primary) / 0.3)',
                  scale: 1.1 
                } : {}}
              >
                <div className="flex flex-col items-center space-y-2 min-w-[120px]">
                  <motion.div
                    animate={isActive ? { rotate: 360 } : {}}
                    transition={{ duration: 1 }}
                  >
                    <Icon className={`h-8 w-8 ${
                      isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'
                    }`} />
                  </motion.div>
                  
                  <div className="text-center">
                    <div className="font-semibold text-sm">{block.stage}</div>
                    <div className="text-xs text-muted-foreground">{block.location}</div>
                    <AnimatePresence>
                      {block.timestamp && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-muted-foreground mt-1"
                        >
                          {block.timestamp}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Badge 
                    variant={isCompleted ? "default" : "secondary"}
                    className={`text-xs ${isCompleted ? 'bg-success text-success-foreground' : ''}`}
                  >
                    {block.hash}
                  </Badge>

                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2"
                    >
                      <Shield className="h-4 w-4 text-success fill-current" />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {index < blocks.length - 1 && (
                <motion.div
                  className="flex items-center"
                  animate={isCompleted && blocks[index + 1]?.verified ? {
                    background: 'linear-gradient(90deg, hsl(var(--success)), hsl(var(--primary)))'
                  } : {}}
                >
                  <motion.div
                    className={`h-0.5 w-8 transition-all duration-1000 ${
                      isCompleted ? 'bg-success' : 'bg-border'
                    }`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isCompleted ? 1 : 0.3 }}
                    style={{ transformOrigin: 'left' }}
                  />
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary mx-1"
                    animate={isActive ? {
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <motion.div
                    className={`h-0.5 w-8 transition-all duration-1000 ${
                      blocks[index + 1]?.verified ? 'bg-success' : 'bg-border'
                    }`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: blocks[index + 1]?.verified ? 1 : 0.3 }}
                    style={{ transformOrigin: 'right' }}
                  />
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </motion.div>

      <motion.div
        className="flex justify-center mt-4"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Badge className="blockchain-badge text-xs px-3 py-1">
          Live Blockchain Tracking
        </Badge>
      </motion.div>
    </div>
  );
};

export default BlockchainVisualization;