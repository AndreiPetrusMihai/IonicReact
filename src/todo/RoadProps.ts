export interface RoadProps {
  id?: string;
  name: string;
  lanes?: number;
  isOperational?: boolean;
  lastMaintained?: Date;
  version?: number;
}
