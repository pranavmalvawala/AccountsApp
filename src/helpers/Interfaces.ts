export * from "../appBase/interfaces";

export interface PaymentGatewaysInterface { id?: string, churchId?: string, provider?: string, publicKey?: string, privateKey?: string }
export interface SettingInterface { id?: string, churchId?: string, homePageUrl?: string, logoUrl?: string, primaryColor?: string, contrastColor?: string, registrationDate?: Date }
