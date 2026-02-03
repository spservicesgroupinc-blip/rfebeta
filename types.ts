
export enum CalculationMode {
  BUILDING = 'Building',
  WALLS_ONLY = 'Walls Only',
  FLAT_AREA = 'Flat Area',
  CUSTOM = 'Custom'
}

export enum FoamType {
  OPEN_CELL = 'Open Cell',
  CLOSED_CELL = 'Closed Cell'
}

export enum AreaType {
  WALL = 'Wall',
  ROOF = 'Roof'
}

export interface UserSession {
  username: string;
  role: 'admin' | 'crew';
  companyName: string;
  spreadsheetId: string;
  folderId: string;
}

export interface WarehouseItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitCost?: number;
}

export interface EquipmentItem {
  id: string;
  name: string;
  status: string;
  lastSeen?: {
    jobId: string;
    customerName: string;
    date: string;
    crewMember: string;
  };
}

export interface AdditionalArea {
  id: string;
  description: string;
  length: number;
  width: number;
  type: AreaType;
}

export interface CommunicationLogEntry {
  id: string;
  date: string;
  type: string;
  content: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  phone: string;
  notes: string;
  logs?: CommunicationLogEntry[];
  status: 'Active' | 'Archived';
}

export interface JobImage {
  id: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  type: 'site_condition' | 'completion';
}

export interface MaterialUsageLogEntry {
  date: string;
  customerName: string;
  materialName: string;
  quantity: number;
  unit: string;
  loggedBy: string;
}

export interface PurchaseOrder {
  id: string;
  date: string;
  vendorName: string;
  status: string;
  items: {
    description: string;
    quantity: number;
    unitCost: number;
    total: number;
    type: 'open_cell' | 'closed_cell' | 'inventory';
    inventoryId?: string;
  }[];
  totalCost: number;
  notes: string;
}

export interface CalculationResults {
  perimeter: number;
  slopeFactor: number;
  baseWallArea: number;
  gableArea: number;
  totalWallArea: number;
  baseRoofArea: number;
  totalRoofArea: number;
  wallBdFt: number;
  roofBdFt: number;
  totalOpenCellBdFt: number;
  totalClosedCellBdFt: number;
  openCellSets: number;
  closedCellSets: number;
  openCellCost: number;
  closedCellCost: number;
  inventoryCost: number;
  laborCost: number;
  miscExpenses: number;
  materialCost: number;
  totalCost: number;
}

export interface EstimateRecord {
  id: string;
  customerId: string;
  date: string;
  status: 'Draft' | 'Work Order' | 'Invoiced' | 'Paid' | 'Archived';
  customer: CustomerProfile;
  inputs: {
    mode: string;
    length: number;
    width: number;
    wallHeight: number;
    roofPitch: string;
    includeGables: boolean;
    isMetalSurface: boolean;
    additionalAreas: AdditionalArea[];
  };
  results: CalculationResults;
  materials: {
    openCellSets: number;
    closedCellSets: number;
    inventory: WarehouseItem[];
    equipment?: EquipmentItem[];
  };
  totalValue: number;
  wallSettings: { type: FoamType; thickness: number; wastePercentage: number };
  roofSettings: { type: FoamType; thickness: number; wastePercentage: number };
  expenses: any;
  notes?: string;
  pricingMode?: string;
  sqFtRates?: { wall: number; roof: number };
  executionStatus?: 'Not Started' | 'In Progress' | 'Completed';
  actuals?: {
    openCellSets: number;
    closedCellSets: number;
    laborHours: number;
    inventory: any[];
    notes: string;
    completionPhotos: JobImage[];
    completedBy?: string;
    completionDate?: string;
  };
  financials?: {
    revenue: number;
    totalCOGS: number;
    chemicalCost: number;
    laborCost: number;
    netProfit: number;
    margin: number;
  };
  workOrderSheetUrl?: string;
  sitePhotos?: JobImage[];
  scheduledDate?: string;
  invoiceDate?: string;
  invoiceNumber?: string;
  paymentTerms?: string;
}

export interface CalculatorState {
  mode: string;
  length: number;
  width: number;
  wallHeight: number;
  roofPitch: string;
  includeGables: boolean;
  isMetalSurface: boolean;
  wallSettings: { type: FoamType; thickness: number; wastePercentage: number };
  roofSettings: { type: FoamType; thickness: number; wastePercentage: number };
  yields: { openCell: number; closedCell: number };
  costs: { openCell: number; closedCell: number; laborRate: number };
  warehouse: { openCellSets: number; closedCellSets: number; items: WarehouseItem[] };
  equipment: EquipmentItem[];
  showPricing: boolean;
  additionalAreas: AdditionalArea[];
  inventory: WarehouseItem[];
  jobEquipment: EquipmentItem[];
  companyProfile: {
    companyName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
    website: string;
    logoUrl: string;
    crewAccessPin: string;
  };
  customers: CustomerProfile[];
  customerProfile: CustomerProfile;
  pricingMode: string;
  sqFtRates: { wall: number; roof: number };
  expenses: {
    manHours: number;
    tripCharge: number;
    fuelSurcharge: number;
    other: { description: string; amount: number };
    laborRate?: number;
  };
  savedEstimates: EstimateRecord[];
  purchaseOrders: PurchaseOrder[];
  materialLogs: MaterialUsageLogEntry[];
  sitePhotos: JobImage[];
  scheduledDate: string;
  jobNotes: string;
  invoiceDate: string;
  invoiceNumber: string;
  paymentTerms: string;
}
