export type RepositoryType = 'mongodb'

export type userCredentials = {
    email: string
    password: string
}

export type otpCredentials = {
    email?: string
    phone?: string
    otp: string
}

export type userProfile ={
    id: string
    email: string
    phone?: string
    createdAt: Date
    updatedAt: Date
}

export type tasklist = {
    id: string
    title: string
    description?: string
    userId: string
    createdAt: Date
    updatedAt: Date
    customField?: string
}