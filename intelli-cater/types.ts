export interface DemographicProfile {
  male: number;
  female: number;
  child: number;
}

export interface EventDetails {
  id: string;
  name: string;
  date: string;
  location: string;
  type: 'Wedding' | 'Corporate' | 'Industrial';
  demographics: DemographicProfile;
  settings: {
    isUrban: boolean;
    spiceIndex: 'Low' | 'Medium' | 'High';
    fatIndex: boolean;
  };
  status: 'Planning' | 'Active' | 'Completed';
}

export interface Batch {
  id: number;
  name: string;
  percentage: number;
  status: 'Pending' | 'Cooking' | 'Ready' | 'Served';
  time: string;
  items: string[];
}

export enum UserRole {
  PLANNER = 'Planner',
  KITCHEN = 'Kitchen',
  ADMIN = 'Admin'
}
