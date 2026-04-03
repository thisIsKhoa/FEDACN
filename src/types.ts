export type ViewMode = 'day' | 'week' | 'month' | 'grid';

export type SpaceType = 'Conference' | 'Huddle' | 'Training' | 'Focus';

export type FloorPlanNodeType = 'desk' | 'room' | 'open-area';

export type FloorPlanStatus = 'available' | 'occupied' | 'pending';

export interface Booking {
  id: string;
  room: string;
  type: SpaceType;
  start: string; // ISO timestamp
  end: string;
  owner: string;
  title: string;
  status: 'confirmed' | 'tentative' | 'cancelled' | 'pending';
}

export interface SpaceItem {
  id: string;
  name: string;
  type: 'desk' | 'meeting' | 'lounge';
  capacity: number;
  status: 'available' | 'occupied' | 'pending';
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FloorPlanItem {
  id: string;
  name: string;
  type: FloorPlanNodeType;
  capacity: number;
  status: FloorPlanStatus;
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  zone?: string;
}

export interface FloorPlanZone {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface BookingRequest {
  roomId: string;
  roomName: string;
  time: string;
  attendees: number;
  notes: string;
}
