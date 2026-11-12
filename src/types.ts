export interface Admin {
  id?: string;
  uid: string;
  name: string;
  email: string;
  mobile: string;
  role: 'super_admin' | 'admin';
  photoURL: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface FeeStructure {
  id?: string;
  feeMonth: string;
  feeYear: string;
  monthlyFee: number;
  securityDeposit: number;
  lateFee: number;
  dueDate: string;
  isActive: boolean;
  description: string;
  createdAt: number;
  updatedAt: number;
}

export interface StudentProfile {
  id?: string;
  uid: string;
  fullName: string;
  fatherName: string;
  mobileNumber: string;
  fatherMobileNumber: string;
  email: string;
  aadhaarNumber: string;
  rollNumberOrApplicationNumber: string;
  course: string;
  year: string;
  roomId: string;
  feePlanId: string;
  address: string;
  photoURL: string;
  profileCompleted: boolean;
  accountStatus: 'Active' | 'Inactive';
  createdAt: number;
  updatedAt: number;
}

export interface PaymentRequest {
  id?: string;
  studentUID: string;
  studentName: string;
  fatherName: string;
  mobileNumber: string;
  course: string;
  year: string;
  roomNumber: string;
  feeMonth: string;
  feeYear: string;
  amount: number;
  transactionId: string;
  paymentDate: string;
  paymentTime: string;
  paymentScreenshotURL: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: number;
  verifiedAt?: number;
  verifiedBy?: string;
}

export interface Payment {
  id?: string;
  studentUID: string;
  studentName: string;
  fatherName: string;
  mobileNumber: string;
  course: string;
  year: string;
  roomNumber: string;
  feeMonth: string;
  feeYear: string;
  amount: number;
  transactionId: string;
  paymentDate: string;
  paymentTime: string;
  verificationDate: number;
  receiptPDFUrl: string;
  createdAt: number;
}

export interface Room {
  id?: string;
  roomNumber: string;
  roomType: string;
  capacity: number;
  occupied: number;
  available: number;
  students: string[];
  monthlyFee: number;
  status: string;
}

export interface Receipt {
  id?: string;
  studentUID: string;
  paymentId: string;
  receiptNumber: string;
  receiptURL: string;
  generatedAt: number;
  downloadCount: number;
}

export interface Notification {
  id?: string;
  title: string;
  message: string;
  targetType: 'student' | 'admin' | 'all';
  targetUID?: string;
  isRead: boolean;
  createdAt: number;
}

export interface ActivityLog {
  id?: string;
  userUID: string;
  role: string;
  action: string;
  resource: string;
  resourceId?: string;
  timestamp: number;
  ipAddress?: string;
}

export interface Settings {
  id?: string;
  hostelName: string;
  hostelAddress: string;
  hostelPhone: string;
  hostelEmail: string;
  hostelLogo: string;
  upiQRCodeURL: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  submittedAt: number;
  status: 'Pending' | 'Read' | 'Replied';
}

