export interface User {
    id: string;
    completed: boolean;
    verified: boolean;
    name: string;
    surname: string;
    age: number;
    description: string;
    instagram: string;
    telegram: string;
    phone: string;
    locationAndTime: string;
    city: string;
    faculty: string;
    profileImageURL: string;
    accepted: string[];
    rejected: string[];
    requests: {};
    matched: {};
    accepted_groups: string[];
    rejected_groups: string[];
}
