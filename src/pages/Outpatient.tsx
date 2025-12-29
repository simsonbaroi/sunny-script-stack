import { useState, useMemo } from 'react';
import { Search, Plus, Minus, Calculator, Trash2, FileText, Printer, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';

interface MedicalItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface BillItem extends MedicalItem {
  billId: string;
  quantity: number;
}

// Original categories from the GitHub project
const OUTPATIENT_CATEGORIES = [
  { name: 'Registration Fees', interface: 'toggle' },
  { name: 'Dr. Fees', interface: 'toggle' },
  { name: 'Medic Fee', interface: 'toggle' },
  { name: 'Laboratory', interface: 'search' },
  { name: 'X-Ray', interface: 'search' },
  { name: 'Medicine', interface: 'search' },
  { name: 'Physical Therapy', interface: 'manual' },
  { name: 'Limb and Brace', interface: 'manual' },
];

// Sample medical items data with Taka pricing
const SAMPLE_ITEMS: MedicalItem[] = [
  // Registration Fees (toggle items)
  { id: 'reg1', name: 'Registration Fee', price: 100, category: 'Registration Fees' },
  { id: 'reg2', name: 'Emergency Registration', price: 200, category: 'Registration Fees' },
  
  // Dr. Fees (toggle items)
  { id: 'dr1', name: 'Consultation Fee', price: 500, category: 'Dr. Fees' },
  { id: 'dr2', name: 'Specialist Consultation', price: 800, category: 'Dr. Fees' },
  { id: 'dr3', name: 'Follow-up Visit', price: 300, category: 'Dr. Fees' },
  
  // Medic Fee (toggle items)
  { id: 'med1', name: 'Nursing Service', price: 200, category: 'Medic Fee' },
  { id: 'med2', name: 'Dressing', price: 150, category: 'Medic Fee' },
  { id: 'med3', name: 'Injection', price: 100, category: 'Medic Fee' },
  
  // Laboratory
  { id: 'lab1', name: 'Complete Blood Count (CBC)', price: 350, category: 'Laboratory' },
  { id: 'lab2', name: 'Urinalysis', price: 150, category: 'Laboratory' },
  { id: 'lab3', name: 'Blood Chemistry Panel', price: 850, category: 'Laboratory' },
  { id: 'lab4', name: 'Lipid Profile', price: 550, category: 'Laboratory' },
  { id: 'lab5', name: 'Liver Function Test', price: 650, category: 'Laboratory' },
  { id: 'lab6', name: 'Kidney Function Test', price: 600, category: 'Laboratory' },
  { id: 'lab7', name: 'Thyroid Function Test', price: 750, category: 'Laboratory' },
  { id: 'lab8', name: 'Blood Sugar (FBS)', price: 200, category: 'Laboratory' },
  { id: 'lab9', name: 'HbA1c', price: 450, category: 'Laboratory' },
  { id: 'lab10', name: 'Serum Creatinine', price: 250, category: 'Laboratory' },
  
  // X-Ray
  { id: 'xray1', name: 'Chest X-Ray (PA)', price: 450, category: 'X-Ray' },
  { id: 'xray2', name: 'Chest X-Ray (AP/Lat)', price: 650, category: 'X-Ray' },
  { id: 'xray3', name: 'Abdominal X-Ray', price: 500, category: 'X-Ray' },
  { id: 'xray4', name: 'Spine X-Ray', price: 550, category: 'X-Ray' },
  { id: 'xray5', name: 'Extremity X-Ray', price: 400, category: 'X-Ray' },
  { id: 'xray6', name: 'Skull X-Ray', price: 500, category: 'X-Ray' },
  { id: 'xray7', name: 'Pelvis X-Ray', price: 550, category: 'X-Ray' },
  
  // Medicine
  { id: 'medicine1', name: 'Paracetamol 500mg', price: 5, category: 'Medicine' },
  { id: 'medicine2', name: 'Amoxicillin 500mg', price: 15, category: 'Medicine' },
  { id: 'medicine3', name: 'Omeprazole 20mg', price: 12, category: 'Medicine' },
  { id: 'medicine4', name: 'Metformin 500mg', price: 8, category: 'Medicine' },
  { id: 'medicine5', name: 'Ciprofloxacin 500mg', price: 18, category: 'Medicine' },
  { id: 'medicine6', name: 'Metronidazole 400mg', price: 10, category: 'Medicine' },
  { id: 'medicine7', name: 'Pantoprazole 40mg', price: 15, category: 'Medicine' },
  { id: 'medicine8', name: 'Azithromycin 500mg', price: 25, category: 'Medicine' },
  
  // Physical Therapy
  { id: 'pt1', name: 'Physiotherapy Session', price: 500, category: 'Physical Therapy' },
  { id: 'pt2', name: 'Ultrasound Therapy', price: 300, category: 'Physical Therapy' },
  { id: 'pt3', name: 'TENS', price: 250, category: 'Physical Therapy' },
  
  // Limb and Brace
  { id: 'lb1', name: 'Knee Brace', price: 1500, category: 'Limb and Brace' },
  { id: 'lb2', name: 'Ankle Support', price: 800, category: 'Limb and Brace' },
  { id: 'lb3', name: 'Cervical Collar', price: 600, category: 'Limb and Brace' },
  { id: 'lb4', name: 'Arm Sling', price: 400, category: 'Limb and Brace' },
];

const Outpatient = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [manualServiceName, setManualServiceName] = useState('');
  const [manualServicePrice, setManualServicePrice] = useState('');

  // Format as Taka (BDT)
  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString('en-BD')}`;
  };

  const currentCategoryConfig = OUTPATIENT_CATEGORIES.find(c => c.name === selectedCategory);

  const filteredItems = useMemo(() => {
    return SAMPLE_ITEMS.filter(item => {
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const addToBill = (item: MedicalItem) => {
    const existingItem = billItems.find(bi => bi.id === item.id);
    if (existingItem) {
      setBillItems(billItems.map(bi => 
        bi.id === item.id ? { ...bi, quantity: bi.quantity + 1 } : bi
      ));
    } else {
      setBillItems([...billItems, { 
        ...item, 
        billId: `${item.id}-${Date.now()}`,
        quantity: 1 
      }]);
    }
  };

  const toggleBillItem = (item: MedicalItem) => {
    const existingItem = billItems.find(bi => bi.id === item.id);
    if (existingItem) {
      setBillItems(billItems.filter(bi => bi.id !== item.id));
    } else {
      setBillItems([...billItems, { 
        ...item, 
        billId: `${item.id}-${Date.now()}`,
        quantity: 1 
      }]);
    }
  };

  const isItemInBill = (itemId: string) => {
    return billItems.some(bi => bi.id === itemId);
  };

  const updateQuantity = (billId: string, delta: number) => {
    setBillItems(billItems.map(item => {
      if (item.billId === billId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromBill = (billId: string) => {
    setBillItems(billItems.filter(item => item.billId !== billId));
  };

  const clearBill = () => {
    setBillItems([]);
  };

  const addManualEntry = () => {
    if (manualServiceName && manualServicePrice && selectedCategory) {
      const newItem: BillItem = {
        id: `manual-${Date.now()}`,
        billId: `manual-${Date.now()}`,
        name: manualServiceName,
        price: parseFloat(manualServicePrice),
        category: selectedCategory,
        quantity: 1
      };
      setBillItems([...billItems, newItem]);
      setManualServiceName('');
      setManualServicePrice('');
    }
  };

  const totalAmount = useMemo(() => {
    return billItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [billItems]);

  const groupedBillItems = useMemo(() => {
    const grouped: Record<string, BillItem[]> = {};
    billItems.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [billItems]);

  const renderCategoryInterface = () => {
    if (!selectedCategory) {
      return (
        <div className="grid sm:grid-cols-2 gap-3">
          {filteredItems.map(item => (
            <Card 
              key={item.id} 
              className="medicine-item-card cursor-pointer hover:scale-[1.02] transition-transform"
              onClick={() => addToBill(item)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground text-sm">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{formatCurrency(item.price)}</p>
                    <Button size="sm" variant="ghost" className="mt-1 h-7 px-2">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (currentCategoryConfig?.interface === 'toggle') {
      // Toggle interface - click to add/remove
      return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredItems.map(item => {
            const isSelected = isItemInBill(item.id);
            return (
              <Card 
                key={item.id} 
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'bg-primary/20 border-primary/50 ring-2 ring-primary/30' 
                    : 'medicine-item-card hover:scale-[1.02]'
                }`}
                onClick={() => toggleBillItem(item)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground text-sm">{item.name}</h3>
                      <p className="font-semibold text-primary mt-1">{formatCurrency(item.price)}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'bg-primary border-primary' 
                        : 'border-muted-foreground/30'
                    }`}>
                      {isSelected && <Check className="h-4 w-4 text-primary-foreground" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      );
    }

    if (currentCategoryConfig?.interface === 'manual') {
      // Manual entry interface
      return (
        <div className="space-y-4">
          <Card className="glass-card">
            <CardContent className="p-4">
              <h3 className="font-medium text-foreground mb-4">Add Custom Entry</h3>
              <div className="space-y-3">
                <Input
                  placeholder="Service name..."
                  value={manualServiceName}
                  onChange={(e) => setManualServiceName(e.target.value)}
                  className="bg-input border-border"
                />
                <Input
                  type="number"
                  placeholder="Price in Taka..."
                  value={manualServicePrice}
                  onChange={(e) => setManualServicePrice(e.target.value)}
                  className="bg-input border-border"
                />
                <Button 
                  variant="medical" 
                  className="w-full"
                  onClick={addManualEntry}
                  disabled={!manualServiceName || !manualServicePrice}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Bill
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Show preset items if any */}
          {filteredItems.length > 0 && (
            <>
              <h4 className="text-sm font-medium text-muted-foreground">Or select from presets:</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {filteredItems.map(item => (
                  <Card 
                    key={item.id} 
                    className="medicine-item-card cursor-pointer hover:scale-[1.02] transition-transform"
                    onClick={() => addToBill(item)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground text-sm">{item.name}</h3>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">{formatCurrency(item.price)}</p>
                          <Button size="sm" variant="ghost" className="mt-1 h-7 px-2">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      );
    }

    // Default search interface (Laboratory, X-Ray, Medicine)
    return (
      <div className="grid sm:grid-cols-2 gap-3">
        {filteredItems.map(item => (
          <Card 
            key={item.id} 
            className="medicine-item-card cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => addToBill(item)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground text-sm">{item.name}</h3>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">{formatCurrency(item.price)}</p>
                  <Button size="sm" variant="ghost" className="mt-1 h-7 px-2">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Outpatient Calculator</h1>
            <p className="text-muted-foreground text-sm">
              Calculate bills for outpatient services
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Panel - Item Selection */}
            <div className="lg:col-span-2 space-y-4">
              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCategory === '' ? 'default' : 'outline'}
                  className={`cursor-pointer category-pill px-3 py-1.5 text-sm ${
                    selectedCategory === '' ? 'active bg-primary text-primary-foreground' : 'hover:bg-secondary'
                  }`}
                  onClick={() => setSelectedCategory('')}
                >
                  All
                </Badge>
                {OUTPATIENT_CATEGORIES.map(category => (
                  <Badge
                    key={category.name}
                    variant={selectedCategory === category.name ? 'default' : 'outline'}
                    className={`cursor-pointer category-pill px-3 py-1.5 text-sm ${
                      selectedCategory === category.name ? 'active bg-primary text-primary-foreground' : 'hover:bg-secondary'
                    }`}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>

              {/* Search (only for search interface categories or all) */}
              {(!currentCategoryConfig || currentCategoryConfig.interface === 'search') && (
                <Card className="glass-card">
                  <CardContent className="pt-4 pb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-input border-border"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Category-specific interface */}
              {renderCategoryInterface()}

              {filteredItems.length === 0 && !currentCategoryConfig?.interface?.includes('manual') && (
                <Card className="glass-card">
                  <CardContent className="py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No items found</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Panel - Bill Summary */}
            <div className="lg:col-span-1">
              <Card className="glass-card sticky top-32">
                <CardHeader className="border-b border-border py-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calculator className="h-5 w-5 text-primary" />
                      Bill Summary
                    </CardTitle>
                    {billItems.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearBill} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {billItems.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No items in bill</p>
                      <p className="text-sm text-muted-foreground mt-1">Click on items to add them</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(groupedBillItems).map(([category, items]) => (
                        <div key={category}>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            {category}
                          </h4>
                          <div className="space-y-2">
                            {items.map(item => (
                              <div key={item.billId} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 bill-item-enter">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatCurrency(item.price)} × {item.quantity}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 ml-2">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6"
                                    onClick={() => updateQuantity(item.billId, -1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6"
                                    onClick={() => updateQuantity(item.billId, 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 text-destructive hover:text-destructive"
                                    onClick={() => removeFromBill(item.billId)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Total */}
                      <div className="border-t border-border pt-4 mt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-foreground">Total</span>
                          <span className="text-2xl font-bold text-primary pulse-total px-3 py-1 rounded-lg">
                            {formatCurrency(totalAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2 pt-4">
                        <Button variant="medical" className="w-full">
                          <Printer className="h-4 w-4 mr-2" />
                          Print Bill
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Outpatient;