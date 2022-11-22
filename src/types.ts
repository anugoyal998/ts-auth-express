export type IPayload = {
    name: string;
    profilePhotoURL: string,
    username: string
}

export type IFindOneUser = {
    username: string;
    providers: [IProvider];
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

export type IProvider = {
    provider: string;
    name: string;
    profilePhotoURL: string;
    isEmailPassword: boolean;
    password?: string;
}