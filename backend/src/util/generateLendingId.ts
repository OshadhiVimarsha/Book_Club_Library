import { LendingModel } from "../models/Lending"; // adjust path as needed

export const generateLendingId = async (): Promise<string> => {
    const lastLending = await LendingModel
        .findOne({})
        .sort({ lendingId: -1 })
        .lean();

    let nextNumber = 1;

    if (lastLending?.lendingId) {
        const lastNumber = parseInt(lastLending.lendingId.replace("LENDB", ""));
        if (!isNaN(lastNumber)) {
            nextNumber = lastNumber + 1;
        }
    }

    return `LENDB${String(nextNumber).padStart(3, "0")}`;
};
