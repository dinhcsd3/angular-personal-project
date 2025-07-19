export interface AuthApiResponseModel {
    success: boolean;
    message: string;
    token?: string; // Optional, only present on successful login
    user?: {
        id: string;
        username: string;
        email: string;
        roles: string[];
    }; // Optional, only present on successful login or registration
    errors?: string[]; // Optional, used to return validation errors
}