// Product verification page for QR code scanning

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useDemoStore, storeUtils } from '@/state/demoStore';
import { motion } from 'framer-motion';
import { 
  QrCode, 
  CheckCircle, 
  AlertCircle, 
  MapPin, 
  Calendar, 
  User, 
  Truck, 
  Store,
  ExternalLink,
  Star,
  Thermometer,
  Droplets
} from 'lucide-react';
import { Product, Event, UserProfile } from '@/types';
import QRCodeService from '@/services/qr';
import GeoService from '@/services/geo';
import QRScanner from '@/components/QRScanner';

const sampleCodes = ['gl-prod001', 'gl-prod002', 'gl-prod003'];

const eventIcons = {
  registration: User,
  pickup_scheduled: Calendar,
  picked_up: Truck,
  status_update: MapPin,
  temperature_log: Thermometer,
  delivered: CheckCircle,
  verified: CheckCircle
};

export default function Verify() {
  const { code } = useParams<{ code: string }>();
  const { state } = useDemoStore();
  const { toast } = useToast();
  
  const [inputCode, setInputCode] = useState(code || '');
  const [verifiedProduct, setVerifiedProduct] = useState<Product | null>(null);
  const [productEvents, setProductEvents] = useState<Event[]>([]);
  const [farmer, setFarmer] = useState<UserProfile | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (!inputCode.trim()) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid QR code",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      // Validate code format
      if (!QRCodeService.validateCode(inputCode)) {
        throw new Error('Invalid code format');
      }

      // Find product by QR code ID
      const product = state.products.find(p => p.qrCodeId === inputCode);
      if (!product) {
        throw new Error('Product not found');
      }

      // Get farmer details
      const farmerDetails = state.users.find(u => u.id === product.farmerId);
      
      // Get product events
      const events = storeUtils.getEventsForProduct(product.id, state);

      setVerifiedProduct(product);
      setProductEvents(events);
      setFarmer(farmerDetails || null);

      toast({
        title: "Product Verified! ✅",
        description: `${product.name} from ${farmerDetails?.name || 'Unknown farmer'}`
      });

    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Product not found or invalid code",
        variant: "destructive"
      });
      setVerifiedProduct(null);
      setProductEvents([]);
      setFarmer(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSampleCode = (sampleCode: string) => {
    setInputCode(sampleCode);
  };

  const handleScanResult = (scannedCode: string) => {
    // Extract code from URL if it's a full verify URL
    const urlMatch = scannedCode.match(/\/verify\/([^?]+)/);
    const code = urlMatch ? urlMatch[1] : scannedCode;
    
    setInputCode(code);
    // Auto-verify after scan
    setTimeout(() => {
      handleVerify();
    }, 100);
  };

  const handleScanError = (error: string) => {
    toast({
      title: "Scan Error",
      description: "Unable to scan QR code. Please try again or enter manually.",
      variant: "destructive"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'verified':
        return 'text-success';
      case 'in_transit':
        return 'text-blockchain';
      case 'registered':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getDistrictName = (districtId: string) => {
    const district = GeoService.getDistrictById(districtId);
    return district ? district.name : districtId.replace('_', ' ');
  };

  // Auto-verify if code is provided in URL
  useEffect(() => {
    if (code && code !== 'demo') {
      setInputCode(code);
      handleVerify();
    }
  }, [code]);

  return (
    <div className="container py-8 px-4 max-w-4xl">
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <QrCode className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Product Verification</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Scan or enter a QR code to verify product authenticity and trace its complete journey 
          through the Odisha supply chain.
        </p>
      </motion.div>

      {/* Verification Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter QR Code</CardTitle>
            <CardDescription>
              Type the code from the QR or use one of the sample codes below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="code" className="sr-only">QR Code</Label>
                <Input
                  id="code"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="gl-xxxxxxxx"
                  className="font-mono"
                />
              </div>
              <Button 
                onClick={handleVerify} 
                disabled={isVerifying}
                className="neon-glow"
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <QRScanner 
                    onScan={handleScanResult}
                    onError={handleScanError}
                  />
                </div>
                <div className="text-muted-foreground text-sm">or</div>
                <div className="text-sm text-muted-foreground">enter manually</div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Try these sample codes:</p>
                <div className="flex flex-wrap gap-2">
                  {sampleCodes.map(sampleCode => (
                    <Badge 
                      key={sampleCode}
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => handleSampleCode(sampleCode)}
                    >
                      {sampleCode}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Verification Results */}
      {verifiedProduct && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Product Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Verified Product
                </CardTitle>
                <Badge variant="outline" className="blockchain-badge">
                  🔗 Blockchain Verified
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold">{verifiedProduct.name}</h3>
                    <p className="text-muted-foreground capitalize">
                      {verifiedProduct.category.replace('_', ' ')} • {verifiedProduct.quantity} {verifiedProduct.unit}
                    </p>
                  </div>

                  {verifiedProduct.variety && (
                    <div>
                      <Label className="text-sm font-medium">Variety</Label>
                      <p className="text-sm">{verifiedProduct.variety}</p>
                    </div>
                  )}

                  {verifiedProduct.description && (
                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-sm">{verifiedProduct.description}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    {verifiedProduct.organicCertified && (
                      <Badge className="bg-success text-success-foreground">
                        🌱 Organic Certified
                      </Badge>
                    )}
                    {verifiedProduct.pricePerUnit && (
                      <span className="text-sm text-muted-foreground">
                        ₹{verifiedProduct.pricePerUnit}/{verifiedProduct.unit}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Harvest Date</Label>
                      <p className="text-sm flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(verifiedProduct.harvestDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Expiry Date</Label>
                      <p className="text-sm flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(verifiedProduct.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Origin</Label>
                    <p className="text-sm flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {getDistrictName(verifiedProduct.district)}, Odisha
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Current Status</Label>
                    <Badge className={`${getStatusColor(verifiedProduct.status)} bg-background border`}>
                      {verifiedProduct.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              {verifiedProduct.blockchainTx && (
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Blockchain Transaction</Label>
                      <p className="text-sm font-mono text-muted-foreground">
                        {verifiedProduct.blockchainTx.slice(0, 20)}...
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View on Polygonscan
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Farmer Info */}
          {farmer && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Farmer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-success text-success-foreground text-lg">
                      {farmer.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{farmer.name}</h3>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {getDistrictName(farmer.district)}, Odisha
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge className="trust-badge">
                        Trust Score: {farmer.trustScore}%
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {farmer.totalTransactions} total transactions
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Supply Chain Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Supply Chain Journey
              </CardTitle>
              <CardDescription>
                Complete traceability from farm to consumer
              </CardDescription>
            </CardHeader>
            <CardContent>
              {productEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tracking events available yet</p>
                  <p className="text-sm">Events will appear as the product moves through the supply chain</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {productEvents.map((event, index) => {
                    const Icon = eventIcons[event.type] || MapPin;
                    return (
                      <div key={event.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          {index < productEvents.length - 1 && (
                            <div className="w-px h-12 bg-border mt-2" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium capitalize">
                              {event.type.replace('_', ' ')}
                            </h4>
                            <span className="text-sm text-muted-foreground">
                              {new Date(event.timestamp).toLocaleString()}
                            </span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            by {event.actorRole} {event.location && `• ${event.location}`}
                          </p>
                          
                          {(event.temperature || event.humidity) && (
                            <div className="flex gap-4 text-sm">
                              {event.temperature && (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Thermometer className="h-3 w-3" />
                                  {event.temperature}°C
                                </span>
                              )}
                              {event.humidity && (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Droplets className="h-3 w-3" />
                                  {event.humidity}% RH
                                </span>
                              )}
                            </div>
                          )}
                          
                          {event.notes && (
                            <p className="text-sm text-muted-foreground italic mt-1">
                              "{event.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}