
// Disaster Management System Types

export type DisasterType = 
  | 'flood'
  | 'fire'
  | 'earthquake'
  | 'hurricane'
  | 'tsunami'
  | 'landslide'
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
}

export interface ResponseNote {
  id: string;
  reportId: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
}
