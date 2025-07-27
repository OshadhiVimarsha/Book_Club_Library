import type { Readers } from "../types/Readers.ts";
import apiClient, {BASE_URL} from "./apiClient.ts";

const READER_API_URL = `${BASE_URL}/reader`;

export const getAllReaders = async (): Promise<Readers[]> => {
    const response = await apiClient.get(READER_API_URL);
    return response.data;
};

export const addReaders = async (readersData: Omit<Readers, "_id">): Promise<Readers> => {
    const response = await apiClient.post(READER_API_URL, readersData)
    return response.data;
};

export const updateReaders = async (_id: string, readersData: Omit<Readers, "_id">): Promise<Readers> => {
    const response = await apiClient.put(`${READER_API_URL}/${_id}`, readersData)
    return response.data;
};

export const removeReaders = async (_id: string): Promise<void> => {
    await apiClient.delete(`${READER_API_URL}/${_id}`)
};
