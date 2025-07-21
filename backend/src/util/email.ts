import sgMail from '@sendgrid/mail';
import { LendingModel } from '../models/Lending';
import {APIError} from "../error/APIError";

/**
 * Send email notification to a reader about overdue books
 * @param reader - Reader object with name and email
 * @param lendings - Array of overdue lending records
 */
export const sendOverdueEmail = async (reader: { name: string; email: string }, lendings: any[]) => {
    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

        // Prepare book details for email
        const bookDetails = lendings
            .map((lending) => `Title: ${lending.bookId.title}, Due Date: ${new Date(lending.dueDate).toLocaleDateString()}`)
            .join('\n');

        const msg = {
            to: reader.email,
            from: 'oshivimarsha1221@gmail.com',
            subject: 'Overdue Book Reminder - Book Club Library',
            text: `Dear ${reader.name},\n\nYou have the following overdue books:\n${bookDetails}\n\nPlease return them as soon as possible.\n\nThank you,\nBook Club Library`,
            html: `
        <p>Dear ${reader.name},</p>
        <p>You have the following overdue books:</p>
        <ul>
          ${lendings.map((lending) => `<li>${lending.bookId.title} (Due: ${new Date(lending.dueDate).toLocaleDateString()})</li>`).join('')}
        </ul>
        <p>Please return them as soon as possible.</p>
        <p>Thank you,<br>Book Club Library</p>
      `,
        };

        await sgMail.send(msg);
        return { success: true, message: `Email sent to ${reader.email}` };
    } catch (error) {
        throw new APIError(500, `Failed to send email to ${reader.email}: ${error}`);
    }
};