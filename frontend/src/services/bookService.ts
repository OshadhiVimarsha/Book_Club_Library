import type { Book } from "../types/Book.ts";
import apiClient, {BASE_URL} from "./apiClient.ts";

const BOOK_API_URL = `${BASE_URL}/book`;

export const getAllBooks = async (): Promise<Book[]> => {
    const response = await apiClient.get(BOOK_API_URL);
    return response.data;
};

export const addBook = async (bookData: Omit<Book, "_id">): Promise<Book> => {
    const response = await apiClient.post(BOOK_API_URL, bookData)
    return response.data;
};

export const updateBook = async (_id: string, bookData: Omit<Book, "_id">): Promise<Book> => {
    const response = await apiClient.put(`${BOOK_API_URL}/${_id}`, bookData)
    return response.data;
};

export const removeBooks = async (_id: string): Promise<void> => {
    await apiClient.delete(`${BOOK_API_URL}/${_id}`)
};
