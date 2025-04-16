
// Disaster Management System Types

export type DisasterType = 
  | 'flood'
  | 'fire'
  | 'earthquake'
  | 'hurricane'
  | 'tsunami'
  | 'landslide'
  | 'chemical'
  | 'biological'
  | 'nuclear'
  | 'other';

export type ReportStatus = 
  | 'pending' 
  | 'assigned' 
  | 'dispatched' 
  | 'in-progress' 
  | 'resolved';

export type AssignedTo = 
  | 'unassigned' 
  | 'volunteer' 
  | 'ndrf';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'volunteer' | 'ndrf';
  phone?: string;
  profileImageUrl?: string;
  createdAt?: Date;
  lastLogin?: Date;
  location?: string;
  specialization?: string;
  certifications?: string[];
}

export interface DisasterReport {
  id: string;
  disasterType: DisasterType;
  location: string;
  description: string;
  imageUrls: string[];
  status: ReportStatus;
  assignedTo: AssignedTo;
  assignedUserId?: string;
  createdAt: Date;
  updatedAt: Date;
  notes?: string[];
  responseImages?: string[];
  severity?: 'low' | 'medium' | 'high' | 'critical';
  affectedArea?: string;
  estimatedPeopleAffected?: number;
  resourcesNeeded?: string[];
  contactInfo?: string;
  latitude?: number;
  longitude?: number;
}

export interface ResponseNote {
  id: string;
  reportId: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
  imageUrl?: string;
  actionTaken?: string;
  status?: ReportStatus;
}

export interface ResourceRequest {
  id: string;
  reportId: string;
  resourceType: string;
  quantity: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'dispatched' | 'delivered';
  requestedBy: string;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  organization: string;
  role: string;
  location: string;
  isActive: boolean;
}

export interface DisasterStatistics {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  disastersByType: Record<DisasterType, number>;
  disastersByStatus: Record<ReportStatus, number>;
  averageResolutionTime: number; // in hours
  activeResponders: number;
}
