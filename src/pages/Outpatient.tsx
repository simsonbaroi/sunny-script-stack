import { useState, useMemo } from 'react';
import { Search, Plus, Minus, Calculator, Trash2, FileText, Printer } from 'lucide-react';
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

const OUTPATIENT_CATEGORIES = [
  'Laboratory',
  'X-Ray',
  'Ultrasound',
  'ECG/EEG',
  'Consultation',
  'Minor Procedures',
  'Injections',
  'Medications',
  'Medical Supplies',
  'Other Services'
];

// Sample medical items data
const SAMPLE_ITEMS: MedicalItem[] = [
  // Laboratory
  { id: 'lab1', name: 'Complete Blood Count (CBC)', price: 350, category: 'Laboratory' },
  { id: 'lab2', name: 'Urinalysis', price: 150, category: 'Laboratory' },
  { id: 'lab3', name: 'Blood Chemistry Panel', price: 850, category: 'Laboratory' },
  { id: 'lab4', name: 'Lipid Profile', price: 550, category: 'Laboratory' },
  { id: 'lab5', name: 'Liver Function Test', price: 650, category: 'Laboratory' },
  { id: 'lab6', name: 'Kidney Function Test', price: 600, category: 'Laboratory' },
  { id: 'lab7', name: 'Thyroid Function Test', price: 750, category: 'Laboratory' },
  { id: 'lab8', name: 'Blood Sugar (FBS)', price: 200, category: 'Laboratory' },
  
  // X-Ray
  { id: 'xray1', name: 'Chest X-Ray (PA)', price: 450, category: 'X-Ray' },
  { id: 'xray2', name: 'Chest X-Ray (AP/Lat)', price: 650, category: 'X-Ray' },
  { id: 'xray3', name: 'Abdominal X-Ray', price: 500, category: 'X-Ray' },
  { id: 'xray4', name: 'Spine X-Ray', price: 550, category: 'X-Ray' },
  { id: 'xray5', name: 'Extremity X-Ray', price: 400, category: 'X-Ray' },
  
  // Ultrasound
  { id: 'us1', name: 'Abdominal Ultrasound', price: 1200, category: 'Ultrasound' },
  { id: 'us2', name: 'Pelvic Ultrasound', price: 1000, category: 'Ultrasound' },
  { id: 'us3', name: 'Thyroid Ultrasound', price: 900, category: 'Ultrasound' },
  { id: 'us4', name: 'Breast Ultrasound', price: 1100, category: 'Ultrasound' },
  
  // ECG/EEG
  { id: 'ecg1', name: 'ECG (12 Lead)', price: 400, category: 'ECG/EEG' },
  { id: 'ecg2', name: 'Holter Monitor (24hr)', price: 2500, category: 'ECG/EEG' },
  { id: 'eeg1', name: 'EEG', price: 1800, category: 'ECG/EEG' },
  
  // Consultation
  { id: 'con1', name: 'General Consultation', price: 500, category: 'Consultation' },
  { id: 'con2', name: 'Specialist Consultation', price: 800, category: 'Consultation' },
  { id: 'con3', name: 'Emergency Consultation', price: 1000, category: 'Consultation' },
  
  // Minor Procedures
  { id: 'proc1', name: 'Wound Dressing', price: 300, category: 'Minor Procedures' },
  { id: 'proc2', name: 'Suturing (Simple)', price: 500, category: 'Minor Procedures' },
  { id: 'proc3', name: 'Suturing (Complex)', price: 1000, category: 'Minor Procedures' },
  { id: 'proc4', name: 'Incision & Drainage', price: 800, category: 'Minor Procedures' },
  { id: 'proc5', name: 'Nebulization', price: 200, category: 'Minor Procedures' },
  
  // Injections
  { id: 'inj1', name: 'IV Injection', price: 150, category: 'Injections' },
  { id: 'inj2', name: 'IM Injection', price: 100, category: 'Injections' },
  { id: 'inj3', name: 'IV Fluid Administration', price: 350, category: 'Injections' },
  
  // Medications
  { id: 'med1', name: 'Paracetamol 500mg', price: 5, category: 'Medications' },
  { id: 'med2', name: 'Amoxicillin 500mg', price: 15, category: 'Medications' },
  { id: 'med3', name: 'Omeprazole 20mg', price: 12, category: 'Medications' },
  { id: 'med4', name: 'Metformin 500mg', price: 8, category: 'Medications' },
  
  // Medical Supplies
  { id: 'sup1', name: 'Surgical Gloves (pair)', price: 25, category: 'Medical Supplies' },
  { id: 'sup2', name: 'Syringe 5ml', price: 15, category: 'Medical Supplies' },
  { id: 'sup3', name: 'Gauze Pad', price: 10, category: 'Medical Supplies' },
  { id: 'sup4', name: 'Bandage Roll', price: 30, category: 'Medical Supplies' },
  
  // Other Services
  { id: 'oth1', name: 'Medical Certificate', price: 200, category: 'Other Services' },
  { id: 'oth2', name: 'Fit to Work Certificate', price: 300, category: 'Other Services' },
  { id: 'oth3', name: 'Medical Abstract', price: 250, category: 'Other Services' },
];

const Outpatient = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [billItems, setBillItems] = useState<BillItem[]>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

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

  return (
    <Layout>
      <div className="min-h-screen bg-background py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Outpatient Calculator</h1>
            <p className="text-muted-foreground">
              Calculate bills for outpatient services including laboratory, diagnostics, and procedures.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Panel - Item Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search and Filter */}
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-input border-border"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCategory === '' ? 'default' : 'outline'}
                  className={`cursor-pointer category-pill px-3 py-1.5 text-sm ${
                    selectedCategory === '' ? 'active bg-primary text-primary-foreground' : 'hover:bg-secondary'
                  }`}
                  onClick={() => setSelectedCategory('')}
                >
                  All Categories
                </Badge>
                {OUTPATIENT_CATEGORIES.map(category => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    className={`cursor-pointer category-pill px-3 py-1.5 text-sm ${
                      selectedCategory === category ? 'active bg-primary text-primary-foreground' : 'hover:bg-secondary'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))
                }
              </div>

              {/* Items Grid */}
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
                ))
                }
              </div>

              {filteredItems.length === 0 && (
                <Card className="glass-card">
                  <CardContent className="py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No items found matching your criteria</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Panel - Bill Summary */}
            <div className="lg:col-span-1">
              <Card className="glass-card sticky top-32">
                <CardHeader className="border-b border-border">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
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
                            ))
                            }
                          </div>
                        </div>
                      ))
                      }

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
