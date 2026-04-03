import { Booking, FloorPlanItem, SpaceItem, FloorPlanZone } from './types';

export const SPACE_COLOR: Record<string, string> = {
  Conference: 'from-sky-400 to-indigo-500',
  Huddle: 'from-emerald-400 to-teal-500',
  Training: 'from-fuchsia-400 to-purple-500',
  Focus: 'from-indigo-400 to-emerald-500'
};

export const floorPlanLevel1Zones: FloorPlanZone[] = [
  { id: 'leadership', name: 'Senior Leadership', color: '#818CF8', bgColor: 'rgba(99, 102, 241, 0.13)', x: 20, y: 20, w: 330, h: 210 },
  { id: 'neutral', name: 'Reception & Meeting Pods', color: '#CBD5E1', bgColor: 'rgba(203, 213, 225, 0.28)', x: 370, y: 20, w: 590, h: 210 },
  { id: 'sales', name: 'Hot Desk Zone', color: '#93C5FD', bgColor: 'rgba(147, 197, 253, 0.17)', x: 20, y: 280, w: 285, h: 300 },
  { id: 'engineering', name: 'Dedicated Desk Zone', color: '#86EFAC', bgColor: 'rgba(134, 239, 172, 0.16)', x: 347, y: 280, w: 285, h: 300 },
  { id: 'marketing', name: 'Private Office Zone', color: '#FDBA74', bgColor: 'rgba(253, 186, 116, 0.16)', x: 674, y: 280, w: 285, h: 300 },
];

export const floorPlanLevel1Items: FloorPlanItem[] = [
  // Senior Leadership zone
  { id: 'r1', name: 'Board Room', type: 'room', capacity: 12, status: 'available', x: 42, y: 50, w: 286, h: 156, zone: 'leadership' },

  // Entry & meetings
  { id: 'r4', name: 'Reception', type: 'room', capacity: 4, status: 'available', x: 392, y: 86, w: 126, h: 84, zone: 'neutral' },
  { id: 'r2', name: 'Meeting 01', type: 'room', capacity: 8, status: 'occupied', x: 540, y: 52, w: 160, h: 114, zone: 'neutral' },
  { id: 'r3', name: 'Meeting 02', type: 'room', capacity: 6, status: 'pending', x: 716, y: 52, w: 146, h: 114, zone: 'neutral' },
  { id: 'r5', name: 'Huddle Pod', type: 'room', capacity: 4, status: 'available', x: 876, y: 52, w: 70, h: 114, zone: 'neutral' },

  // Hot Desk cluster around 2 physical desks
  { id: 'tbl1a', name: 'Team Table HD-A', type: 'open-area', capacity: 4, status: 'available', x: 70, y: 324, w: 88, h: 52, zone: 'sales' },
  { id: 'tbl1b', name: 'Team Table HD-B', type: 'open-area', capacity: 4, status: 'available', x: 182, y: 324, w: 88, h: 52, zone: 'sales' },
  { id: 'd1', name: 'Desk HD-01', type: 'desk', capacity: 1, status: 'available', x: 66, y: 288, w: 45, h: 45, label: 'HD1', zone: 'sales' },
  { id: 'd2', name: 'Desk HD-02', type: 'desk', capacity: 1, status: 'occupied', x: 122, y: 288, w: 45, h: 45, label: 'HD2', zone: 'sales' },
  { id: 'd3', name: 'Desk HD-03', type: 'desk', capacity: 1, status: 'available', x: 66, y: 384, w: 45, h: 45, label: 'HD3', zone: 'sales' },
  { id: 'd4', name: 'Desk HD-04', type: 'desk', capacity: 1, status: 'pending', x: 122, y: 384, w: 45, h: 45, label: 'HD4', zone: 'sales' },
  { id: 'd5', name: 'Desk HD-05', type: 'desk', capacity: 1, status: 'available', x: 178, y: 288, w: 45, h: 45, label: 'HD5', zone: 'sales' },
  { id: 'd6', name: 'Desk HD-06', type: 'desk', capacity: 1, status: 'occupied', x: 234, y: 288, w: 45, h: 45, label: 'HD6', zone: 'sales' },
  { id: 'd7', name: 'Desk HD-07', type: 'desk', capacity: 1, status: 'available', x: 178, y: 384, w: 45, h: 45, label: 'HD7', zone: 'sales' },
  { id: 'd8', name: 'Desk HD-08', type: 'desk', capacity: 1, status: 'occupied', x: 234, y: 384, w: 45, h: 45, label: 'HD8', zone: 'sales' },
  { id: 'sl', name: 'Hot Desk Lounge', type: 'open-area', capacity: 12, status: 'available', x: 38, y: 468, w: 250, h: 96, zone: 'sales' },

  // Dedicated desk cluster around 2 physical desks
  { id: 'tbl2a', name: 'Team Table DD-A', type: 'open-area', capacity: 4, status: 'available', x: 397, y: 324, w: 88, h: 52, zone: 'engineering' },
  { id: 'tbl2b', name: 'Team Table DD-B', type: 'open-area', capacity: 4, status: 'available', x: 509, y: 324, w: 88, h: 52, zone: 'engineering' },
  { id: 'sd1', name: 'Desk DD-01', type: 'desk', capacity: 1, status: 'available', x: 393, y: 288, w: 45, h: 45, label: 'DD1', zone: 'engineering' },
  { id: 'sd2', name: 'Desk DD-02', type: 'desk', capacity: 1, status: 'occupied', x: 449, y: 288, w: 45, h: 45, label: 'DD2', zone: 'engineering' },
  { id: 'sd3', name: 'Desk DD-03', type: 'desk', capacity: 1, status: 'available', x: 393, y: 384, w: 45, h: 45, label: 'DD3', zone: 'engineering' },
  { id: 'sd4', name: 'Desk DD-04', type: 'desk', capacity: 1, status: 'pending', x: 449, y: 384, w: 45, h: 45, label: 'DD4', zone: 'engineering' },
  { id: 'sd5', name: 'Desk DD-05', type: 'desk', capacity: 1, status: 'available', x: 505, y: 288, w: 45, h: 45, label: 'DD5', zone: 'engineering' },
  { id: 'sd6', name: 'Desk DD-06', type: 'desk', capacity: 1, status: 'occupied', x: 561, y: 288, w: 45, h: 45, label: 'DD6', zone: 'engineering' },
  { id: 'sd7', name: 'Desk DD-07', type: 'desk', capacity: 1, status: 'available', x: 505, y: 384, w: 45, h: 45, label: 'DD7', zone: 'engineering' },
  { id: 'sd8', name: 'Desk DD-08', type: 'desk', capacity: 1, status: 'occupied', x: 561, y: 384, w: 45, h: 45, label: 'DD8', zone: 'engineering' },
  { id: 'eng', name: 'Dedicated Desk Lounge', type: 'open-area', capacity: 10, status: 'available', x: 365, y: 468, w: 250, h: 96, zone: 'engineering' },

  // Private office cluster around 2 physical desks
  { id: 'tbl3a', name: 'Team Table PO-A', type: 'open-area', capacity: 4, status: 'available', x: 716, y: 320, w: 84, h: 52, zone: 'marketing' },
  { id: 'tbl3b', name: 'Team Table PO-B', type: 'open-area', capacity: 4, status: 'available', x: 828, y: 320, w: 84, h: 52, zone: 'marketing' },
  { id: 'mk1', name: 'Desk PO-01', type: 'desk', capacity: 1, status: 'available', x: 712, y: 284, w: 45, h: 45, label: 'PO1', zone: 'marketing' },
  { id: 'mk2', name: 'Desk PO-02', type: 'desk', capacity: 1, status: 'occupied', x: 768, y: 284, w: 45, h: 45, label: 'PO2', zone: 'marketing' },
  { id: 'mk3', name: 'Desk PO-03', type: 'desk', capacity: 1, status: 'available', x: 712, y: 380, w: 45, h: 45, label: 'PO3', zone: 'marketing' },
  { id: 'mk4', name: 'Desk PO-04', type: 'desk', capacity: 1, status: 'pending', x: 768, y: 380, w: 45, h: 45, label: 'PO4', zone: 'marketing' },
  { id: 'mk5', name: 'Desk PO-05', type: 'desk', capacity: 1, status: 'available', x: 824, y: 284, w: 45, h: 45, label: 'PO5', zone: 'marketing' },
  { id: 'mk6', name: 'Desk PO-06', type: 'desk', capacity: 1, status: 'occupied', x: 880, y: 284, w: 45, h: 45, label: 'PO6', zone: 'marketing' },
  { id: 'mk7', name: 'Desk PO-07', type: 'desk', capacity: 1, status: 'available', x: 824, y: 380, w: 45, h: 45, label: 'PO7', zone: 'marketing' },
  { id: 'mk8', name: 'Desk PO-08', type: 'desk', capacity: 1, status: 'occupied', x: 880, y: 380, w: 45, h: 45, label: 'PO8', zone: 'marketing' },
  { id: 'ml', name: 'Private Office Lounge', type: 'open-area', capacity: 8, status: 'available', x: 692, y: 458, w: 250, h: 106, zone: 'marketing' },
];

export const floorPlanLevel2Zones: FloorPlanZone[] = [
  { id: 'pods', name: 'Quiet Pods', color: '#818CF8', bgColor: 'rgba(99, 102, 241, 0.12)', x: 20, y: 20, w: 300, h: 180 },
  { id: 'studio', name: 'Event Studio', color: '#A5B4FC', bgColor: 'rgba(165, 180, 252, 0.13)', x: 340, y: 20, w: 620, h: 180 },
  { id: 'startup', name: 'Startup Cluster', color: '#93C5FD', bgColor: 'rgba(147, 197, 253, 0.16)', x: 20, y: 230, w: 460, h: 360 },
  { id: 'design', name: 'Design Wing', color: '#86EFAC', bgColor: 'rgba(134, 239, 172, 0.15)', x: 500, y: 230, w: 460, h: 360 },
];

export const floorPlanLevel2Items: FloorPlanItem[] = [
  { id: 'l2-r1', name: 'Podcast Pod 1', type: 'room', capacity: 2, status: 'available', x: 38, y: 52, w: 84, h: 104, zone: 'pods' },
  { id: 'l2-r2', name: 'Podcast Pod 2', type: 'room', capacity: 2, status: 'occupied', x: 132, y: 52, w: 84, h: 104, zone: 'pods' },
  { id: 'l2-r3', name: 'Focus Pod', type: 'room', capacity: 4, status: 'pending', x: 226, y: 52, w: 84, h: 104, zone: 'pods' },

  { id: 'l2-r4', name: 'Event Studio', type: 'room', capacity: 28, status: 'available', x: 360, y: 50, w: 582, h: 130, zone: 'studio' },

  { id: 'l2-s1', name: 'Startup Desk 1', type: 'desk', capacity: 1, status: 'available', x: 56, y: 290, w: 44, h: 44, label: 'A1', zone: 'startup' },
  { id: 'l2-s2', name: 'Startup Desk 2', type: 'desk', capacity: 1, status: 'available', x: 112, y: 290, w: 44, h: 44, label: 'A2', zone: 'startup' },
  { id: 'l2-s3', name: 'Startup Desk 3', type: 'desk', capacity: 1, status: 'occupied', x: 168, y: 290, w: 44, h: 44, label: 'A3', zone: 'startup' },
  { id: 'l2-s4', name: 'Startup Desk 4', type: 'desk', capacity: 1, status: 'available', x: 224, y: 290, w: 44, h: 44, label: 'A4', zone: 'startup' },
  { id: 'l2-s5', name: 'Startup Desk 5', type: 'desk', capacity: 1, status: 'pending', x: 280, y: 290, w: 44, h: 44, label: 'A5', zone: 'startup' },
  { id: 'l2-s6', name: 'Startup Desk 6', type: 'desk', capacity: 1, status: 'available', x: 336, y: 290, w: 44, h: 44, label: 'A6', zone: 'startup' },

  { id: 'l2-s7', name: 'Startup Desk 7', type: 'desk', capacity: 1, status: 'available', x: 56, y: 356, w: 44, h: 44, label: 'A7', zone: 'startup' },
  { id: 'l2-s8', name: 'Startup Desk 8', type: 'desk', capacity: 1, status: 'occupied', x: 112, y: 356, w: 44, h: 44, label: 'A8', zone: 'startup' },
  { id: 'l2-s9', name: 'Startup Desk 9', type: 'desk', capacity: 1, status: 'available', x: 168, y: 356, w: 44, h: 44, label: 'A9', zone: 'startup' },
  { id: 'l2-s10', name: 'Startup Desk 10', type: 'desk', capacity: 1, status: 'available', x: 224, y: 356, w: 44, h: 44, label: 'A10', zone: 'startup' },
  { id: 'l2-s11', name: 'Startup Desk 11', type: 'desk', capacity: 1, status: 'pending', x: 280, y: 356, w: 44, h: 44, label: 'A11', zone: 'startup' },
  { id: 'l2-s12', name: 'Startup Desk 12', type: 'desk', capacity: 1, status: 'available', x: 336, y: 356, w: 44, h: 44, label: 'A12', zone: 'startup' },
  { id: 'l2-oa1', name: 'Startup Lounge', type: 'open-area', capacity: 20, status: 'available', x: 56, y: 442, w: 372, h: 132, zone: 'startup' },

  { id: 'l2-d1', name: 'Design Desk 1', type: 'desk', capacity: 1, status: 'available', x: 540, y: 290, w: 44, h: 44, label: 'D1', zone: 'design' },
  { id: 'l2-d2', name: 'Design Desk 2', type: 'desk', capacity: 1, status: 'occupied', x: 596, y: 290, w: 44, h: 44, label: 'D2', zone: 'design' },
  { id: 'l2-d3', name: 'Design Desk 3', type: 'desk', capacity: 1, status: 'available', x: 652, y: 290, w: 44, h: 44, label: 'D3', zone: 'design' },
  { id: 'l2-d4', name: 'Design Desk 4', type: 'desk', capacity: 1, status: 'available', x: 708, y: 290, w: 44, h: 44, label: 'D4', zone: 'design' },
  { id: 'l2-d5', name: 'Design Desk 5', type: 'desk', capacity: 1, status: 'pending', x: 764, y: 290, w: 44, h: 44, label: 'D5', zone: 'design' },
  { id: 'l2-d6', name: 'Design Desk 6', type: 'desk', capacity: 1, status: 'available', x: 820, y: 290, w: 44, h: 44, label: 'D6', zone: 'design' },
  { id: 'l2-r5', name: 'Critique Room', type: 'room', capacity: 10, status: 'available', x: 540, y: 360, w: 324, h: 112, zone: 'design' },
  { id: 'l2-oa2', name: 'Design Commons', type: 'open-area', capacity: 14, status: 'available', x: 540, y: 486, w: 392, h: 88, zone: 'design' },
];

export const floorPlanLevel3Zones: FloorPlanZone[] = [
  { id: 'exec', name: 'Executive Suites', color: '#818CF8', bgColor: 'rgba(99, 102, 241, 0.13)', x: 20, y: 20, w: 420, h: 220 },
  { id: 'training', name: 'Training Wing', color: '#93C5FD', bgColor: 'rgba(147, 197, 253, 0.16)', x: 460, y: 20, w: 500, h: 220 },
  { id: 'hybrid', name: 'Hybrid Office', color: '#86EFAC', bgColor: 'rgba(134, 239, 172, 0.16)', x: 20, y: 260, w: 940, h: 340 },
];

export const floorPlanLevel3Items: FloorPlanItem[] = [
  { id: 'l3-r1', name: 'Executive Board', type: 'room', capacity: 14, status: 'available', x: 44, y: 56, w: 248, h: 148, zone: 'exec' },
  { id: 'l3-r2', name: 'Suite Alpha', type: 'room', capacity: 6, status: 'occupied', x: 306, y: 56, w: 118, h: 72, zone: 'exec' },
  { id: 'l3-r3', name: 'Suite Beta', type: 'room', capacity: 6, status: 'pending', x: 306, y: 138, w: 118, h: 66, zone: 'exec' },

  { id: 'l3-r4', name: 'Training Hall', type: 'room', capacity: 24, status: 'available', x: 486, y: 54, w: 318, h: 152, zone: 'training' },
  { id: 'l3-r5', name: 'Workshop Lab', type: 'room', capacity: 16, status: 'available', x: 818, y: 54, w: 124, h: 152, zone: 'training' },

  { id: 'l3-h1', name: 'Hybrid Desk 1', type: 'desk', capacity: 1, status: 'available', x: 60, y: 306, w: 42, h: 42, label: 'H1', zone: 'hybrid' },
  { id: 'l3-h2', name: 'Hybrid Desk 2', type: 'desk', capacity: 1, status: 'available', x: 114, y: 306, w: 42, h: 42, label: 'H2', zone: 'hybrid' },
  { id: 'l3-h3', name: 'Hybrid Desk 3', type: 'desk', capacity: 1, status: 'occupied', x: 168, y: 306, w: 42, h: 42, label: 'H3', zone: 'hybrid' },
  { id: 'l3-h4', name: 'Hybrid Desk 4', type: 'desk', capacity: 1, status: 'available', x: 222, y: 306, w: 42, h: 42, label: 'H4', zone: 'hybrid' },

  { id: 'l3-h5', name: 'Hybrid Desk 5', type: 'desk', capacity: 1, status: 'available', x: 360, y: 306, w: 42, h: 42, label: 'H5', zone: 'hybrid' },
  { id: 'l3-h6', name: 'Hybrid Desk 6', type: 'desk', capacity: 1, status: 'pending', x: 414, y: 306, w: 42, h: 42, label: 'H6', zone: 'hybrid' },
  { id: 'l3-h7', name: 'Hybrid Desk 7', type: 'desk', capacity: 1, status: 'available', x: 468, y: 306, w: 42, h: 42, label: 'H7', zone: 'hybrid' },
  { id: 'l3-h8', name: 'Hybrid Desk 8', type: 'desk', capacity: 1, status: 'occupied', x: 522, y: 306, w: 42, h: 42, label: 'H8', zone: 'hybrid' },

  { id: 'l3-h9', name: 'Hybrid Desk 9', type: 'desk', capacity: 1, status: 'available', x: 660, y: 306, w: 42, h: 42, label: 'H9', zone: 'hybrid' },
  { id: 'l3-h10', name: 'Hybrid Desk 10', type: 'desk', capacity: 1, status: 'available', x: 714, y: 306, w: 42, h: 42, label: 'H10', zone: 'hybrid' },
  { id: 'l3-h11', name: 'Hybrid Desk 11', type: 'desk', capacity: 1, status: 'pending', x: 768, y: 306, w: 42, h: 42, label: 'H11', zone: 'hybrid' },
  { id: 'l3-h12', name: 'Hybrid Desk 12', type: 'desk', capacity: 1, status: 'available', x: 822, y: 306, w: 42, h: 42, label: 'H12', zone: 'hybrid' },

  { id: 'l3-r6', name: 'Client Lounge', type: 'room', capacity: 10, status: 'available', x: 60, y: 386, w: 224, h: 120, zone: 'hybrid' },
  { id: 'l3-r7', name: 'War Room', type: 'room', capacity: 12, status: 'occupied', x: 306, y: 386, w: 256, h: 120, zone: 'hybrid' },
  { id: 'l3-r8', name: 'Phone Booth Lane', type: 'room', capacity: 6, status: 'pending', x: 584, y: 386, w: 182, h: 120, zone: 'hybrid' },
  { id: 'l3-oa1', name: 'Open Collaboration', type: 'open-area', capacity: 24, status: 'available', x: 778, y: 386, w: 162, h: 190, zone: 'hybrid' },
];

export const floorPlanLevels = ["Level 1", "Level 2", "Level 3"] as const;

export const floorPlanByLevel: Record<(typeof floorPlanLevels)[number], { zones: FloorPlanZone[]; items: FloorPlanItem[] }> = {
  "Level 1": { zones: floorPlanLevel1Zones, items: floorPlanLevel1Items },
  "Level 2": { zones: floorPlanLevel2Zones, items: floorPlanLevel2Items },
  "Level 3": { zones: floorPlanLevel3Zones, items: floorPlanLevel3Items },
};

export const getFloorPlanByLevel = (level: string) => {
  if (level in floorPlanByLevel) {
    return floorPlanByLevel[level as keyof typeof floorPlanByLevel];
  }
  return floorPlanByLevel["Level 1"];
};

// Backward-compatible exports
export const floorPlanZones = floorPlanLevel1Zones;
export const floorPlanItems = floorPlanLevel1Items;

export const rooms = floorPlanItems;

export const spaces: SpaceItem[] = [
  { id: 's1', name: 'Cedar Room', type: 'meeting', capacity: 10, status: 'available', x: 60, y: 60, w: 220, h: 120 },
  { id: 's2', name: 'Spruce Booth', type: 'meeting', capacity: 6, status: 'occupied', x: 320, y: 60, w: 180, h: 100 },
  { id: 's3', name: 'Elm Hall', type: 'lounge', capacity: 20, status: 'pending', x: 60, y: 220, w: 400, h: 120 },
  { id: 's4', name: 'Bamboo Suite', type: 'desk', capacity: 4, status: 'available', x: 500, y: 220, w: 180, h: 100 }
];

export const bookings: Booking[] = [
  {
    id: 'bk1',
    room: 'Cedar Room',
    type: 'Conference',
    start: '2026-04-02T09:00:00',
    end: '2026-04-02T10:30:00',
    owner: 'Linh Nguyen',
    title: 'Product sync',
    status: 'confirmed'
  },
  {
    id: 'bk2',
    room: 'Spruce Booth',
    type: 'Huddle',
    start: '2026-04-02T11:00:00',
    end: '2026-04-02T12:00:00',
    owner: 'Anh Tran',
    title: 'UX review',
    status: 'confirmed'
  },
  {
    id: 'bk3',
    room: 'Elm Hall',
    type: 'Training',
    start: '2026-04-03T14:00:00',
    end: '2026-04-03T16:00:00',
    owner: 'Duy Le',
    title: 'Engineering onboarding',
    status: 'tentative'
  },
  {
    id: 'bk4',
    room: 'Bamboo Suite',
    type: 'Focus',
    start: '2026-04-02T15:30:00',
    end: '2026-04-02T17:00:00',
    owner: 'Hoai Pham',
    title: 'Strategy deep dive',
    status: 'confirmed'
  }
];
