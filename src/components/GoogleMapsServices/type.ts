export interface ServiceLocation {
    id: string;
    name: string;
    region?: string;
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    country: string;
    mail: string[];
    phone: string[];
    web: string;
}

export const MAP_IDS = [
    "bf51a910020fa25a",
    "49ae42fed52588c3",
    "3fec513989decfcd",
    "7a9e2ebecd32a903",
    "739af084373f96fe"
];

export const MapTypeId = {
    HYBRID: 'hybrid',
    ROADMAP: 'roadmap',
    SATELLITE: 'satellite',
    TERRAIN: 'terrain'
};
