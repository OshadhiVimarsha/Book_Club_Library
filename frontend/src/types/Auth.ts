export type SignupData = {
    name: string
    email: string
    password: string
}

export type LoginData = {
    email: string
    password: string
}

export type AuthResponse = {
    token: string
    user: {
        _id: string
        name: string
        email: string
    }
}

