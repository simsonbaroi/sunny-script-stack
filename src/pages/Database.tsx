import { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, Save, X, Database as DbIcon, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import Layout from '@/components/Layout';
import { toast } from '@/hooks/use-toast';

interface MedicalItem {
  id: string;
  name: string;
  price: number;
  category: string;
  type: 'outpatient' | 'inpatient' | 'both';
  isDaily?: boolean;
}

const ALL_CATEGORIES = [
  'Laboratory',
  'X-Ray',
  'Ultrasound',
  'ECG/EEG',
  'Consultation',
  'Minor Procedures',
  'Injections',
  'Medications',
  'Medical Supplies',
  'Room & Board',
  'Professional Fees',
  'Operating Room',
  'ICU/CCU',
  'Nursing Care',
  'Other Services'
];

// Initial sample data
const INITIAL_ITEMS: MedicalItem[] = [
  { id: '1', name: 'Complete Blood Count (CBC)', price: 350, category: 'Laboratory', type: 'both' },
  { id: '2', name: 'Urinalysis', price: 150, category: 'Laboratory', type: 'both' },
  { id: '3', name: 'Blood Chemistry Panel', price: 850, category: 'Laboratory', type: 'both' },
  { id: '4', name: 'Chest X-Ray (PA)', price: 450, category: 'X-Ray', type: 'both' },
  { id: '5', name: 'Abdominal Ultrasound', price: 1200, category: 'Ultrasound', type: 'both' },
  { id: '6', name: 'ECG (12 Lead)', price: 400, category: 'ECG/EEG', type: 'both' },
  { id: '7', name: 'General Consultation', price: 500, category: 'Consultation', type: 'outpatient' },
  { id: '8', name: 'Wound Dressing', price: 300, category: 'Minor Procedures', type: 'both' },
  { id: '9', name: 'IV Injection', price: 150, category: 'Injections', type: 'both' },
  { id: '10', name: 'Paracetamol 500mg', price: 5, category: 'Medications', type: 'both' },
  { id: '11', name: 'Private Room', price: 3500, category: 'Room & Board', type: 'inpatient', isDaily: true },
  { id: '12', name: 'Semi-Private Room', price: 2500, category: 'Room & Board', type: 'inpatient', isDaily: true },
  { id: '13', name: 'Attending Physician Fee', price: 1500, category: 'Professional Fees', type: 'inpatient', isDaily: true },
  { id: '14', name: 'OR Use (per hour)', price: 5000, category: 'Operating Room', type: 'inpatient' },
  { id: '15', name: 'ICU Room', price: 8000, category: 'ICU/CCU', type: 'inpatient', isDaily: true },
];

const Database = () => {
  const [items, setItems] = useState<MedicalItem[]>(INITIAL_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MedicalItem | null>(null);
  const [formData, setFormData] = useState<Partial<MedicalItem>>({
    name: '',
    price: 0,
    category: '',
    type: 'both',
    isDaily: false
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesType = selectedType === 'all' || item.type === selectedType || item.type === 'both';
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [items, searchQuery, selectedCategory, selectedType]);

  const openAddDialog = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      price: 0,
      category: '',
      type: 'both',
      isDaily: false
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: MedicalItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price,
      category: item.category,
      type: item.type,
      isDaily: item.isDaily || false
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.category || formData.price === undefined) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (editingItem) {
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData } as MedicalItem
          : item
      ));
      toast({
        title: "Item Updated",
        description: `${formData.name} has been updated successfully`
      });
    } else {
      const newItem: MedicalItem = {
        id: Date.now().toString(),
        name: formData.name!,
        price: formData.price!,
        category: formData.category!,
        type: formData.type as 'outpatient' | 'inpatient' | 'both',
        isDaily: formData.isDaily
      };
      setItems([...items, newItem]);
      toast({
        title: "Item Added",
        description: `${formData.name} has been added successfully`
      });
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const item = items.find(i => i.id === id);
    setItems(items.filter(i => i.id !== id));
    toast({
      title: "Item Deleted",
      description: `${item?.name} has been removed`
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Database Management</h1>
              <p className="text-muted-foreground">
                Add, edit, and manage medical items, procedures, and their pricing.
              </p>
            </div>
            <Button variant="medical" onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          </div>

          {/* Filters */}
          <Card className="glass-card mb-6">
            <CardContent className="pt-6">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-input border-border"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {ALL_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="outpatient">Outpatient Only</SelectItem>
                    <SelectItem value="inpatient">Inpatient Only</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{items.length}</p>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">
                    {new Set(items.map(i => i.category)).size}
                  </p>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{filteredItems.length}</p>
                  <p className="text-sm text-muted-foreground">Filtered Results</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Items Table */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DbIcon className="h-5 w-5 text-primary" />
                Medical Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-center">Daily Rate</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map(item => (
                      <TableRow key={item.id} className="border-border hover:bg-secondary/50">
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-secondary/50">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={
                              item.type === 'outpatient' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                              item.type === 'inpatient' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                              'bg-primary/10 text-primary border-primary/30'
                            }
                          >
                            {item.type === 'both' ? 'Both' : item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          {formatCurrency(item.price)}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.isDaily && (
                            <Badge className="bg-primary/20 text-primary">Daily</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEditDialog(item)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <DbIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No items found matching your criteria</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add/Edit Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="glass-card border-border sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Edit Item' : 'Add New Item'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input
                    id="itemName"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter item name"
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Service Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData({ ...formData, type: value as 'outpatient' | 'inpatient' | 'both' })}
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outpatient">Outpatient Only</SelectItem>
                      <SelectItem value="inpatient">Inpatient Only</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (PHP)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter price"
                    className="bg-input border-border"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isDaily">Daily Rate (for inpatient)</Label>
                  <Switch
                    id="isDaily"
                    checked={formData.isDaily}
                    onCheckedChange={(checked) => setFormData({ ...formData, isDaily: checked })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="medical" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  {editingItem ? 'Update' : 'Add'} Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default Database;
