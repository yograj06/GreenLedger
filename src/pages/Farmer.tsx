// Farmer Hub - Register crops and manage products

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useDemoStore, storeUtils } from '@/state/demoStore';
import { motion } from 'framer-motion';
import { Sprout, Plus, QrCode, Package, TrendingUp, MapPin, Calendar, Eye, Wallet } from 'lucide-react';
import PaymentEscrow from '@/components/payments/PaymentEscrow';
import { CropType, Product, ProductStatus } from '@/types';
import GeoService from '@/services/geo';
import QRCodeService from '@/services/qr';
import BlockchainService from '@/services/blockchain';

const cropOptions: { value: CropType; label: string; season: string }[] = [
  { value: 'paddy', label: 'Paddy Rice', season: 'Kharif' },
  { value: 'turmeric', label: 'Turmeric', season: 'Rabi' },
  { value: 'brinjal', label: 'Brinjal', season: 'Year-round' },
  { value: 'chili', label: 'Chili Pepper', season: 'Rabi' },
  { value: 'groundnut', label: 'Groundnut', season: 'Kharif' },
  { value: 'sesame', label: 'Sesame', season: 'Kharif' },
  { value: 'maize', label: 'Maize', season: 'Kharif' },
  { value: 'coconut', label: 'Coconut', season: 'Year-round' },
  { value: 'cashew', label: 'Cashew', season: 'Year-round' }
];

const statusColors: Record<ProductStatus, string> = {
  registered: 'bg-blue-100 text-blue-800',
  pickup_scheduled: 'bg-yellow-100 text-yellow-800',
  in_transit: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  verified: 'bg-emerald-100 text-emerald-800',
  expired: 'bg-red-100 text-red-800'
};

export default function Farmer() {
  const { state, dispatch } = useDemoStore();
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    category: '' as CropType,
    variety: '',
    quantity: '',
    unit: 'kg' as 'kg' | 'quintal' | 'tonnes',
    harvestDate: '',
    expiryDate: '',
    description: '',
    organicCertified: false,
    pricePerUnit: ''
  });

  const currentUser = state.currentUser;
  const userProducts = currentUser ? storeUtils.getProductsByFarmer(currentUser.id, state) : [];
  const districts = GeoService.getDistricts();

  const handleRegisterCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsRegistering(true);
    
    try {
      // Generate unique product ID and QR code
      const productId = `prod-${Date.now().toString(36)}`;
      const qrCodeId = QRCodeService.generateCode(productId);
      
      // Create blockchain transaction
      const blockchainTx = BlockchainService.mintCropRegistration(productId, {
        farmerId: currentUser.id,
        farmerName: currentUser.name,
        district: currentUser.district
      });

      // Create product
      const product: Product = {
        id: productId,
        name: formData.name,
        category: formData.category,
        variety: formData.variety || undefined,
        unit: formData.unit,
        quantity: parseFloat(formData.quantity),
        farmerId: currentUser.id,
        district: currentUser.district,
        harvestDate: new Date(formData.harvestDate).getTime(),
        expiryDate: new Date(formData.expiryDate).getTime(),
        status: 'registered',
        qrCodeId,
        blockchainTx: blockchainTx.hash,
        description: formData.description || undefined,
        organicCertified: formData.organicCertified,
        pricePerUnit: formData.pricePerUnit ? parseFloat(formData.pricePerUnit) : undefined,
        createdAt: Date.now()
      };

      // Add to store
      dispatch({ type: 'ADD_PRODUCT', payload: product });

      // Generate QR code and show modal
      const dataUrl = await QRCodeService.generateDataUrl(qrCodeId);
      setQrDataUrl(dataUrl);
      setSelectedProduct(product);
      setShowQRModal(true);

      // Reset form
      setFormData({
        name: '',
        category: '' as CropType,
        variety: '',
        quantity: '',
        unit: 'kg',
        harvestDate: '',
        expiryDate: '',
        description: '',
        organicCertified: false,
        pricePerUnit: ''
      });

      toast({
        title: "Crop Registered Successfully! 🌾",
        description: `${product.name} has been registered with blockchain verification.`
      });

    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Failed to register crop. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleViewQR = async (product: Product) => {
    try {
      const dataUrl = await QRCodeService.generateDataUrl(product.qrCodeId);
      setQrDataUrl(dataUrl);
      setSelectedProduct(product);
      setShowQRModal(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive"
      });
    }
  };

  if (!currentUser || currentUser.role !== 'farmer') {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground">Please select a farmer role to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Sprout className="h-8 w-8 text-success" />
          <h1 className="text-3xl font-bold">Farmer Hub</h1>
          <Badge className="trust-badge">Trust: {currentUser.trustScore}%</Badge>
        </div>
        <p className="text-muted-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {currentUser.name} • {currentUser.district.replace('_', ' ')} District
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Register New Crop */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Register New Crop
              </CardTitle>
              <CardDescription>
                Add your harvested crops to the blockchain-verified supply chain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegisterCrop} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Organic Turmeric"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Crop Type</Label>
                    <Select value={formData.category} onValueChange={(value: CropType) => 
                      setFormData({ ...formData, category: value })
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent>
                        {cropOptions.map(crop => (
                          <SelectItem key={crop.value} value={crop.value}>
                            {crop.label} ({crop.season})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="100"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Select value={formData.unit} onValueChange={(value: any) => 
                      setFormData({ ...formData, unit: value })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilograms</SelectItem>
                        <SelectItem value="quintal">Quintals</SelectItem>
                        <SelectItem value="tonnes">Tonnes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="price">Price per {formData.unit}</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.pricePerUnit}
                      onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                      placeholder="₹120"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="harvest">Harvest Date</Label>
                    <Input
                      id="harvest"
                      type="date"
                      value={formData.harvestDate}
                      onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="variety">Variety (Optional)</Label>
                  <Input
                    id="variety"
                    value={formData.variety}
                    onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                    placeholder="e.g., Curcuma Longa"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Additional details about your crop..."
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full neon-glow" 
                  disabled={isRegistering || !formData.category}
                >
                  {isRegistering ? "Registering..." : "Register Crop & Generate QR"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Payment Status
              </CardTitle>
              <CardDescription>
                Track your incoming payments and escrow status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentEscrow userRole="farmer" userId={currentUser.id} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="mt-8">
        {/* My Products */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                My Products ({userProducts.length})
              </CardTitle>
              <CardDescription>
                Track your registered crops and their journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {userProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No products registered yet</p>
                  <p className="text-sm">Register your first crop to get started!</p>
                </div>
              ) : (
                userProducts.map((product) => (
                  <Card key={product.id} className="card-hover">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{product.name}</h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {product.quantity} {product.unit} • {product.category.replace('_', ' ')}
                          </p>
                        </div>
                        <Badge className={statusColors[product.status]} variant="secondary">
                          {product.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <Calendar className="h-3 w-3" />
                        Harvest: {new Date(product.harvestDate).toLocaleDateString()}
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleViewQR(product)}
                          className="flex-1"
                        >
                          <QrCode className="h-4 w-4 mr-1" />
                          QR Code
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Track
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* QR Code Modal */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Product QR Code</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg">{selectedProduct.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedProduct.quantity} {selectedProduct.unit} • ID: {selectedProduct.qrCodeId}
                </p>
              </div>
              
              {qrDataUrl && (
                <div className="qr-container text-center">
                  <img 
                    src={qrDataUrl} 
                    alt="Product QR Code" 
                    className="mx-auto mb-4 rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground">
                    Scan to verify product authenticity and track journey
                  </p>
                </div>
              )}
              
              <div className="text-center">
                <Badge variant="outline" className="blockchain-badge">
                  🔗 Blockchain Verified
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}