import apiClient, { BASE_URL } from "./apiClient.ts";
import type {LoginData, SignupData } from "../types/Auth.ts";

const USER_API_URL = `${BASE_URL}/auth`;

export interface LoginResponse {
    name: string
    accessToken: string // add access token as well
    email: string
    _id: string
}

export interface SignUpResponse {
    name: string
    email: string
    _id: string
}

export interface LogoutResponse {
    message: string
}

export interface RefreshTokenResponse {
    accessToken: string
}

// Sign up a new user
export const signup = async (data: SignupData): Promise<SignUpResponse> => {
    const response = await apiClient.post(`${USER_API_URL}/signup`, data);
    return response.data;
};

// Log in an existing user
export const login = async (data: LoginData): Promise<LoginResponse> => {
    const response = await apiClient.post(`${USER_API_URL}/login`, data);
    return response.data;
};

// Optionally, add a logout function (frontend only)
export const logout = async (): Promise<LogoutResponse> => {
    const response = await apiClient.post(`${USER_API_URL}/logout`)
    return response.data
}

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post("/auth/refresh-token")
    return response.data
}