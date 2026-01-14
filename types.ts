
export enum UserRole {
  TRAVELLER = 'TRAVELLER',
  RIDER = 'RIDER',
  ADMIN = 'ADMIN'
}

export enum RideStatus {
  SEARCHING = 'SEARCHING',
  ASSIGNED = 'ASSIGNED',
  LIVE = 'LIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum VehicleType {
  BIKE = 'BIKE',
  AUTO = 'AUTO',
  E_RICKSHAW = 'E_RICKSHAW',
  CAR = 'CAR'
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar: string;
}

export interface RideRequest {
  id: string;
  pickup: string;
  drop: string;
  fare: number;
  eta: string;
  passengerCount: number;
  vehicleType: VehicleType;
  status: RideStatus;
  timestamp: number;
}
