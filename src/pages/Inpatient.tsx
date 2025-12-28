import { useState, useMemo } from 'react';
import { Search, Plus, Minus, Calculator, Trash2, FileText, Printer, Calendar, User, Bed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import Layout from '@/components/Layout';

interface MedicalItem {
  id: string;
  name: string;
  price: number;
  category: string;
  isDaily?: boolean;
}

interface BillItem extends MedicalItem {
  billId: string;
  quantity: number;
}

interface PatientInfo {
  name: string;
  admissionDate: string;
  dischargeDate: string;
}

const INPATIENT_CATEGORIES = [
  'Room & Board',
  'Professional Fees',
  'Laboratory',
  'Radiology',
  'Pharmacy',
  'Operating Room',
  'Recovery Room',
  'ICU/CCU',
  'Emergency Room',
  'Medical Supplies',
  'Nursing Care',
  'Therapy Services',
  'Blood Products',
  'Dialysis',
  'Respiratory Therapy',
  'Anesthesia',
  'Special Procedures',
  'Dietary Services',
  'Other Services'
];

// Sample inpatient items
const SAMPLE_ITEMS: MedicalItem[] = [
  // Room & Board
  { id: 'room1', name: 'Private Room', price: 3500, category: 'Room & Board', isDaily: true },
  { id: 'room2', name: 'Semi-Private Room', price: 2500, category: 'Room & Board', isDaily: true },
  { id: 'room3', name: 'Ward Bed', price: 1500, category: 'Room & Board', isDaily: true },
  { id: 'room4', name: 'Suite Room', price: 6000, category: 'Room & Board', isDaily: true },
  
  // Professional Fees
  { id: 'pf1', name: 'Attending Physician Fee', price: 1500, category: 'Professional Fees', isDaily: true },
  { id: 'pf2', name: 'Surgeon Fee', price: 15000, category: 'Professional Fees' },
  { id: 'pf3', name: 'Anesthesiologist Fee', price: 8000, category: 'Professional Fees' },
  { id: 'pf4', name: 'Specialist Consultation', price: 1200, category: 'Professional Fees' },
  
  // Laboratory
  { id: 'lab1', name: 'Complete Blood Count', price: 350, category: 'Laboratory' },
  { id: 'lab2', name: 'Blood Chemistry Panel', price: 850, category: 'Laboratory' },
  { id: 'lab3', name: 'Urinalysis', price: 150, category: 'Laboratory' },
  { id: 'lab4', name: 'Coagulation Studies', price: 650, category: 'Laboratory' },
  
  // Radiology
  { id: 'rad1', name: 'Chest X-Ray', price: 450, category: 'Radiology' },
  { id: 'rad2', name: 'CT Scan', price: 8500, category: 'Radiology' },
  { id: 'rad3', name: 'MRI', price: 15000, category: 'Radiology' },
  { id: 'rad4', name: 'Ultrasound', price: 1200, category: 'Radiology' },
  
  // Pharmacy
  { id: 'pharma1', name: 'IV Fluids (per bag)', price: 250, category: 'Pharmacy' },
  { id: 'pharma2', name: 'Antibiotics (per dose)', price: 500, category: 'Pharmacy' },
  { id: 'pharma3', name: 'Pain Medication (per dose)', price: 200, category: 'Pharmacy' },
  { id: 'pharma4', name: 'Cardiac Medications', price: 350, category: 'Pharmacy' },
  
  // Operating Room
  { id: 'or1', name: 'OR Use (per hour)', price: 5000, category: 'Operating Room' },
  { id: 'or2', name: 'Minor Surgery OR', price: 8000, category: 'Operating Room' },
  { id: 'or3', name: 'Major Surgery OR', price: 15000, category: 'Operating Room' },
  
  // ICU/CCU
  { id: 'icu1', name: 'ICU Room', price: 8000, category: 'ICU/CCU', isDaily: true },
  { id: 'icu2', name: 'CCU Room', price: 7500, category: 'ICU/CCU', isDaily: true },
  { id: 'icu3', name: 'NICU Room', price: 9000, category: 'ICU/CCU', isDaily: true },
  
  // Medical Supplies
  { id: 'sup1', name: 'IV Set', price: 150, category: 'Medical Supplies' },
  { id: 'sup2', name: 'Catheter Kit', price: 350, category: 'Medical Supplies' },
  { id: 'sup3', name: 'Surgical Kit', price: 2500, category: 'Medical Supplies' },
  { id: 'sup4', name: 'Wound Care Set', price: 500, category: 'Medical Supplies' },
  
  // Nursing Care
  { id: 'nur1', name: 'Nursing Service Fee', price: 800, category: 'Nursing Care', isDaily: true },
  { id: 'nur2', name: 'Special Nursing Care', price: 1500, category: 'Nursing Care', isDaily: true },
  
  // Other Services
  { id: 'oth1', name: 'Oxygen Therapy', price: 500, category: 'Other Services', isDaily: true },
  { id: 'oth2', name: 'ECG Monitoring', price: 300, category: 'Other Services', isDaily: true },
  { id: 'oth3', name: 'Nebulization', price: 200, category: 'Other Services' },
];

const Inpatient = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: '',
    admissionDate: '',
    dischargeDate: ''
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const calculateDays = useMemo(() => {
    if (!patientInfo.admissionDate || !patientInfo.dischargeDate) return 1;
    const admission = new Date(patientInfo.admissionDate);
    const discharge = new Date(patientInfo.dischargeDate);
    const diffTime = Math.abs(discharge.getTime() - admission.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(diffDays, 1);
  }, [patientInfo.admissionDate, patientInfo.dischargeDate]);

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
    return billItems.reduce((sum, item) => {
      const multiplier = item.isDaily ? calculateDays * item.quantity : item.quantity;
      return sum + (item.price * multiplier);
    }, 0);
  }, [billItems, calculateDays]);

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
            <h1 className="text-3xl font-bold text-foreground mb-2">Inpatient Calculator</h1>
            <p className="text-muted-foreground">
              Calculate bills for admitted patients with daily rates and comprehensive services.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Panel - Item Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Patient Information */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientName">Patient Name</Label>
                      <Input
                        id="patientName"
                        placeholder="Enter patient name"
                        value={patientInfo.name}
                        onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admissionDate">Admission Date</Label>
                      <Input
                        id="admissionDate"
                        type="date"
                        value={patientInfo.admissionDate}
                        onChange={(e) => setPatientInfo({ ...patientInfo, admissionDate: e.target.value })}
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dischargeDate">Discharge Date</Label>
                      <Input
                        id="dischargeDate"
                        type="date"
                        value={patientInfo.dischargeDate}
                        onChange={(e) => setPatientInfo({ ...patientInfo, dischargeDate: e.target.value })}
                        className="bg-input border-border"
                      />
                    </div>
                  </div>
                  {patientInfo.admissionDate && patientInfo.dischargeDate && (
                    <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="flex items-center gap-2">
                        <Bed className="h-4 w-4 text-primary" />
                        <span className="text-sm text-foreground">
                          Length of Stay: <strong className="text-primary">{calculateDays} day(s)</strong>
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

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
                {INPATIENT_CATEGORIES.map(category => (
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
                ))}
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
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-foreground text-sm">{item.name}</h3>
                            {item.isDaily && (
                              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                                Daily
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">{formatCurrency(item.price)}</p>
                          {item.isDaily && (
                            <p className="text-xs text-muted-foreground">per day</p>
                          )}
                          <Button size="sm" variant="ghost" className="mt-1 h-7 px-2">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                  {patientInfo.name && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Patient: <span className="text-foreground font-medium">{patientInfo.name}</span>
                    </p>
                  )}
                </CardHeader>
                <CardContent className="pt-4 max-h-[60vh] overflow-y-auto">
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
                                    {item.isDaily && ` × ${calculateDays} days`}
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

export default Inpatient;
