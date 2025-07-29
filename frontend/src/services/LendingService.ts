import apiClient from "./apiClient"
import type { Lending } from "../types/Lending.ts"

const BASE_URL = "/lending"

export const lendBooks = async (data: {
    readerId: string
    bookIds: string[]
}): Promise<{ message: string; lending?: Lending }> => {
    const responses: { message: string; lending?: Lending }[] = []

    for (const bookId of data.bookIds) {
        const res = await apiClient.post(`${BASE_URL}/lend`, {
            readerId: data.readerId,
            bookId,
        })
        responses.push(res.data)
    }

    return {
        message: "Books lent successfully",
        lending: responses[0].lending, // optionally return first lending
    }
}

export const returnBook = async (lendingId: string): Promise<{ message: string; lending: Lending }> => {
    const res = await apiClient.put(`${BASE_URL}/return/${lendingId}`)
    return res.data
}

export const getLendingHistory = async (
    params?: { readerId?: string; bookId?: string }
): Promise<Lending[]> => {
    const res = await apiClient.get(`${BASE_URL}/history`, { params })
    return res.data
}

export const getOverdueBooks = async (): Promise<Lending[]> => {
    const res = await apiClient.get(`${BASE_URL}/overdue`)
    return res.data
}

export const notifyOverdueBooks = async (): Promise<{
    message: string
    results: any[]
}> => {
    const res = await apiClient.post(`${BASE_URL}/notify`)
    return res.data
}

