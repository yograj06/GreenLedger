import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, Search, Plus } from 'lucide-react';
import { useDemoStore } from '@/state/demoStore';
import { toast } from 'sonner';

export default function ManualEntry() {
  const { state, dispatch } = useDemoStore();
  const [activeTab, setActiveTab] = useState<'search' | 'add' | 'verify'>('search');
  const [searchId, setSearchId] = useState('');
  const [foundProduct, setFoundProduct] = useState<any>(null);

  const handleSearch = () => {
    const product = state.products.find(p => p.qrCodeId === searchId || p.id === searchId);
    if (product) {
      setFoundProduct(product);
      toast.success('Product found!');
    } else {
      setFoundProduct(null);
      toast.error('Product not found');
    }
  };

  const handleVerify = (productId: string) => {
    const newEvent = {
      id: `event-${Date.now()}`,
      productId,
      type: 'verified' as const,
      actorId: 'retailer-1',
      actorRole: 'retailer' as const,
      timestamp: Date.now(),
      location: 'Bhubaneswar, Odisha',
      notes: 'Manually verified by retailer'
    };

    dispatch({ type: 'ADD_EVENT', payload: newEvent });
    toast.success('Product verified successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Edit className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Manual Entry</h1>
          <p className="text-muted-foreground">Search, add, or verify products manually</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'search' ? 'default' : 'outline'}
          onClick={() => setActiveTab('search')}
        >
          <Search className="h-4 w-4 mr-2" />
          Search Product
        </Button>
        <Button
          variant={activeTab === 'add' ? 'default' : 'outline'}
          onClick={() => setActiveTab('add')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
        <Button
          variant={activeTab === 'verify' ? 'default' : 'outline'}
          onClick={() => setActiveTab('verify')}
        >
          <Save className="h-4 w-4 mr-2" />
          Quick Verify
        </Button>
      </div>

      {/* Search Product Tab */}
      {activeTab === 'search' && (
        <Card>
          <CardHeader>
            <CardTitle>Search Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <Input
                placeholder="Enter QR Code ID or Product ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {foundProduct && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{foundProduct.name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {foundProduct.id}</p>
                      <p className="text-sm text-muted-foreground">QR: {foundProduct.qrCodeId}</p>
                    </div>
                    <Badge variant={foundProduct.status === 'delivered' ? 'default' : 'secondary'}>
                      {foundProduct.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <span className="font-medium">Category:</span>
                      <p>{foundProduct.category}</p>
                    </div>
                    <div>
                      <span className="font-medium">Quantity:</span>
                      <p>{foundProduct.quantity} {foundProduct.unit}</p>
                    </div>
                    <div>
                      <span className="font-medium">Price:</span>
                      <p>₹{foundProduct.pricePerUnit}/{foundProduct.unit}</p>
                    </div>
                    <div>
                      <span className="font-medium">District:</span>
                      <p>{foundProduct.district}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => handleVerify(foundProduct.id)}>
                      Verify Product
                    </Button>
                    <Button variant="outline">View Full Details</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Product Tab */}
      {activeTab === 'add' && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <AddProductForm />
          </CardContent>
        </Card>
      )}

      {/* Quick Verify Tab */}
      {activeTab === 'verify' && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <QuickVerifyForm />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AddProductForm() {
  const { dispatch } = useDemoStore();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    variety: '',
    quantity: '',
    unit: 'kg',
    pricePerUnit: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const product = {
      id: `prod-${Date.now()}`,
      name: formData.name,
      category: formData.category as any,
      variety: formData.variety,
      unit: formData.unit as any,
      quantity: parseInt(formData.quantity),
      pricePerUnit: parseFloat(formData.pricePerUnit),
      farmerId: 'retailer-1',
      district: 'bhubaneswar',
      harvestDate: Date.now(),
      expiryDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
      status: 'registered' as const,
      qrCodeId: `gl-${Date.now()}`,
      createdAt: Date.now(),
      description: formData.description || `${formData.name} - ${formData.variety}`
    };

    dispatch({ type: 'ADD_PRODUCT', payload: product });
    toast.success('Product added successfully!');
    
    // Reset form
    setFormData({
      name: '',
      category: '',
      variety: '',
      quantity: '',
      unit: 'kg',
      pricePerUnit: '',
      description: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Product Name *</label>
          <Input
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Category *</label>
          <Input
            required
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Variety</label>
          <Input
            value={formData.variety}
            onChange={(e) => setFormData({...formData, variety: e.target.value})}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Unit *</label>
          <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">kg</SelectItem>
              <SelectItem value="quintal">quintal</SelectItem>
              <SelectItem value="piece">piece</SelectItem>
              <SelectItem value="dozen">dozen</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Quantity *</label>
          <Input
            required
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Price per Unit *</label>
          <Input
            required
            type="number"
            step="0.01"
            value={formData.pricePerUnit}
            onChange={(e) => setFormData({...formData, pricePerUnit: e.target.value})}
          />
        </div>
      </div>
      
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Optional product description"
        />
      </div>

      <Button type="submit" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Product
      </Button>
    </form>
  );
}

function QuickVerifyForm() {
  const { state, dispatch } = useDemoStore();
  const [qrId, setQrId] = useState('');
  const [notes, setNotes] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    
    const product = state.products.find(p => p.qrCodeId === qrId);
    if (!product) {
      toast.error('Product not found');
      return;
    }

    const newEvent = {
      id: `event-${Date.now()}`,
      productId: product.id,
      type: 'verified' as const,
      actorId: 'retailer-1',
      actorRole: 'retailer' as const,
      timestamp: Date.now(),
      location: 'Bhubaneswar, Odisha',
      notes: notes || 'Quick verification completed'
    };

    dispatch({ type: 'ADD_EVENT', payload: newEvent });
    toast.success(`${product.name} verified successfully!`);
    
    setQrId('');
    setNotes('');
  };

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      <div>
        <label className="text-sm font-medium">QR Code ID *</label>
        <Input
          required
          value={qrId}
          onChange={(e) => setQrId(e.target.value)}
          placeholder="Enter QR code from product"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Verification Notes</label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes about the verification"
        />
      </div>

      <Button type="submit" className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Verify Product
      </Button>
    </form>
  );
}