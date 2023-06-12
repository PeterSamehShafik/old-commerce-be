
import nodeoutlook from 'nodejs-nodemailer-outlook';

export const myEmail = (reciever, subject, hhtmlContent) => {
    nodeoutlook.sendEmail({
        auth: {
            user: process.env.senderEmail,
            pass: process.env.senderEmailPassword
        },
        from: process.env.senderEmail,
        to: reciever,
        subject,
        html: hhtmlContent,
        text: 'This is text version!',
        replyTo: 'receiverXXX@gmail.com',
        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i)
    }
    );
}