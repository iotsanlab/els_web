export interface IAsset {
    id: {
        entityType: string;
        id: string;
    };
    createdTime: number;
    tenantId: {
        entityType: string;
        id: string;
    };  
    customerId: {
        entityType: string;
        id: string;
    };
    name: string;
    type: string;
    label: string | null;
    assetProfileId: string | null;
    externalId: string | null;
    version: string | null;
    additionalInfo: {
        description: string;
    };
    ownerId: {
        entityType: string;
        id: string;
    };
}

export interface IAssetResponse {
    data: IAsset[];
}