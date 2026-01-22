// Device entity type
interface IEntity {
  entityType: string;
  id: string;
}

// Additional info interface
interface IAdditionalInfo {
  gateway: boolean;
  overwriteActivityTime: boolean;
  description: string;
}

// Device interface
interface IDevice {
  id: IEntity;
  createdTime: number;
  additionalInfo: IAdditionalInfo;
  tenantId: IEntity;
  customerId: IEntity;
  name: string;
  type: string;
  label: string;
  subType: string;
  deviceProfileId: string | null;
  deviceData: string | null;
  firmwareId: string | null;
  softwareId: string | null;
  externalId: string | null;
  ownerId: IEntity;
}

// Response interface
export interface IResponseDevices {
  data: IDevice[];
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
}
