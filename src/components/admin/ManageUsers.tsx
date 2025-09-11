import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, Edit2, Trash2, Plus, UserPlus } from 'lucide-react';
import { useDemoStore } from '@/state/demoStore';
import { UserProfile, UserRole } from '@/types';
import { format } from 'date-fns';

export default function ManageUsers() {
  const { state, dispatch } = useDemoStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'farmer':
        return <Badge className="bg-success text-success-foreground">Farmer</Badge>;
      case 'transporter':
        return <Badge className="bg-blockchain text-white">Transporter</Badge>;
      case 'retailer':
        return <Badge className="bg-earth-orange text-white">Retailer</Badge>;
      case 'admin':
        return <Badge className="bg-accent text-accent-foreground">Admin</Badge>;
      case 'consumer':
        return <Badge variant="secondary">Consumer</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getTrustScoreBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-success text-success-foreground">Excellent</Badge>;
    if (score >= 80) return <Badge className="bg-blockchain text-white">Good</Badge>;
    if (score >= 70) return <Badge variant="secondary">Fair</Badge>;
    return <Badge variant="destructive">Poor</Badge>;
  };

  const filteredUsers = state.users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleUpdateUser = (userId: string, updates: Partial<UserProfile>) => {
    dispatch({
      type: 'UPDATE_USER',
      payload: { id: userId, updates }
    });
    setEditingUser(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Monitor and manage platform users</p>
          </div>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, district, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="farmer">Farmers</SelectItem>
                  <SelectItem value="transporter">Transporters</SelectItem>
                  <SelectItem value="retailer">Retailers</SelectItem>
                  <SelectItem value="consumer">Consumers</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              {editingUser === user.id ? (
                <EditUserForm
                  user={user}
                  onSave={(updates) => handleUpdateUser(user.id, updates)}
                  onCancel={() => setEditingUser(null)}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold">{user.name}</h3>
                      {getRoleBadge(user.role)}
                      {getTrustScoreBadge(user.trustScore)}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">District:</span>
                        <p>{user.district}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Phone:</span>
                        <p>{user.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Trust Score:</span>
                        <p>{user.trustScore}%</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Joined:</span>
                        <p>{format(new Date(user.createdAt), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">Total Transactions:</span>
                        <p>{user.totalTransactions}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Successful Deliveries:</span>
                        <p>{user.successfulDeliveries}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setEditingUser(user.id)}
                    >
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

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No users found matching your criteria</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* User Statistics */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>User Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-success">
                {state.users.filter(u => u.role === 'farmer').length}
              </p>
              <p className="text-sm text-muted-foreground">Farmers</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-blockchain">
                {state.users.filter(u => u.role === 'transporter').length}
              </p>
              <p className="text-sm text-muted-foreground">Transporters</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-earth-orange">
                {state.users.filter(u => u.role === 'retailer').length}
              </p>
              <p className="text-sm text-muted-foreground">Retailers</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">
                {state.users.filter(u => u.role === 'consumer').length}
              </p>
              <p className="text-sm text-muted-foreground">Consumers</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-primary">
                {Math.round(state.users.reduce((sum, u) => sum + u.trustScore, 0) / state.users.length)}%
              </p>
              <p className="text-sm text-muted-foreground">Avg Trust Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {showAddForm && (
        <AddUserForm
          onAdd={(user) => {
            dispatch({ type: 'ADD_USER', payload: user });
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}

function EditUserForm({ 
  user, 
  onSave, 
  onCancel 
}: { 
  user: UserProfile; 
  onSave: (updates: Partial<UserProfile>) => void; 
  onCancel: () => void; 
}) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '');
  const [trustScore, setTrustScore] = useState(user.trustScore.toString());

  const handleSave = () => {
    onSave({
      name,
      phone: phone || undefined,
      trustScore: parseInt(trustScore)
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Phone</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Trust Score</label>
          <Input 
            value={trustScore} 
            onChange={(e) => setTrustScore(e.target.value)}
            type="number"
            min="0"
            max="100"
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

function AddUserForm({ 
  onAdd, 
  onCancel 
}: { 
  onAdd: (user: UserProfile) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState({
    name: '',
    role: 'farmer' as UserRole,
    district: '',
    phone: ''
  });

  const handleSubmit = () => {
    const user: UserProfile = {
      id: `user-${Date.now()}`,
      name: formData.name,
      role: formData.role,
      district: formData.district,
      phone: formData.phone || undefined,
      trustScore: 75, // Default trust score
      createdAt: Date.now(),
      totalTransactions: 0,
      successfulDeliveries: 0
    };
    onAdd(user);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Add New User</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Role</label>
            <Select 
              value={formData.role} 
              onValueChange={(value: UserRole) => setFormData({...formData, role: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="farmer">Farmer</SelectItem>
                <SelectItem value="transporter">Transporter</SelectItem>
                <SelectItem value="retailer">Retailer</SelectItem>
                <SelectItem value="consumer">Consumer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">District</label>
            <Input
              value={formData.district}
              onChange={(e) => setFormData({...formData, district: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSubmit}>Add User</Button>
        </div>
      </CardContent>
    </Card>
  );
}