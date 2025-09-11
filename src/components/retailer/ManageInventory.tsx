import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package2, Plus, Edit2, Trash2 } from 'lucide-react';
import { useDemoStore } from '@/state/demoStore';
import { Product } from '@/types';

export default function ManageInventory() {
  const { state, dispatch } = useDemoStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleEdit = (productId: string) => {
    setEditingId(productId);
  };

  const handleSave = (productId: string, updates: Partial<Product>) => {
    dispatch({
      type: 'UPDATE_PRODUCT',
      payload: { id: productId, updates }
    });
    setEditingId(null);
  };

  const getStatusBadge = (quantity: number, status: string) => {
    if (status === 'delivered' && quantity > 20) {
      return <Badge className="bg-success text-success-foreground">In Stock</Badge>;
    } else if (quantity > 0 && quantity <= 20) {
      return <Badge variant="secondary">Low Stock</Badge>;
    } else {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Package2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Inventory Management</h1>
            <p className="text-muted-foreground">Monitor and update your product inventory</p>
          </div>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="grid gap-4">
        {state.products.filter(p => p.status === 'delivered' || p.status === 'registered').map((product) => (
          <Card key={product.id}>
            <CardContent className="p-6">
              {editingId === product.id ? (
                <EditProductForm
                  product={product}
                  onSave={(updates) => handleSave(product.id, updates)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      {getStatusBadge(product.quantity, product.status)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Quantity:</span> {product.quantity} {product.unit}
                      </div>
                      <div>
                        <span className="font-medium">Category:</span> {product.category}
                      </div>
                      <div>
                        <span className="font-medium">Price:</span> ₹{product.pricePerUnit}/{product.unit}
                      </div>
                      <div>
                        <span className="font-medium">QR Code:</span> {product.qrCodeId}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(product.id)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {showAddForm && (
        <AddProductForm
          onAdd={(product) => {
            dispatch({ type: 'ADD_PRODUCT', payload: product });
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}

function EditProductForm({ 
  product, 
  onSave, 
  onCancel 
}: { 
  product: Product; 
  onSave: (updates: Partial<Product>) => void; 
  onCancel: () => void; 
}) {
  const [quantity, setQuantity] = useState(product.quantity.toString());
  const [price, setPrice] = useState(product.pricePerUnit.toString());

  const handleSave = () => {
    onSave({
      quantity: parseInt(quantity),
      pricePerUnit: parseFloat(price)
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Quantity</label>
          <Input
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            type="number"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Price per {product.unit}</label>
          <Input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            step="0.01"
          />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}

function AddProductForm({ 
  onAdd, 
  onCancel 
}: { 
  onAdd: (product: Product) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    variety: '',
    quantity: '',
    unit: 'kg',
    pricePerUnit: ''
  });

  const handleSubmit = () => {
    const product: Product = {
      id: `prod-${Date.now()}`,
      name: formData.name,
      category: formData.category as any,
      variety: formData.variety,
      unit: formData.unit as any,
      quantity: parseInt(formData.quantity),
      pricePerUnit: parseFloat(formData.pricePerUnit),
      farmerId: 'retailer-1', // Current user
      district: 'bhubaneswar',
      harvestDate: Date.now(),
      expiryDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
      status: 'registered',
      qrCodeId: `gl-prod${Date.now()}`,
      createdAt: Date.now(),
      description: `${formData.name} - ${formData.variety}`
    };
    onAdd(product);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium">Product Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <Input
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
            <label className="text-sm font-medium">Unit</label>
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
            <label className="text-sm font-medium">Quantity</label>
            <Input
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              type="number"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Price per Unit</label>
            <Input
              value={formData.pricePerUnit}
              onChange={(e) => setFormData({...formData, pricePerUnit: e.target.value})}
              type="number"
              step="0.01"
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Product</Button>
        </div>
      </CardContent>
    </Card>
  );
}