import Mailgen, { Content } from "mailgen";
import transporter from "../config/nodemailer.config";

interface SendEmailPayLoad {
    mailgenContent: Content;
    email: string;
    subject: string;
}
const sendEmail = async (options: SendEmailPayLoad) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Authentication Demo",
            link: "https://authentication.demp",
        },
    });


    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);

    // Generate an HTML email with the provided contents
    const emailHtml = mailGenerator.generate(options.mailgenContent);

    const mail = {
        from: "mail.authentication@gmail.com", // We can name this anything. The mail will go to your Mailtrap inbox
        to: options.email, // receiver's mail
        subject: options.subject, // mail subject
        text: emailTextual, // mailgen content textual variant
        html: emailHtml, // mailgen content html variant
    };

    try {
        await transporter.sendMail(mail);
    } catch (error) {
        console.log(
            "Email service failed silently. Make sure you have provided your MAILTRAP credentials in the .env file"
        );
    }
};

const emailVerificationMailgenContent = (fullname: string, verificationUrl: string) => {
    return {
        body: {
            name: fullname,
            intro: "Welcome to our app! We're very excited to have you on board.",
            action: {
                instructions:
                    "To verify your email please click on the following button:",
                button: {
                    color: "#22BC66", // Optional action button color
                    text: "Verify your email",
                    link: verificationUrl,
                },
            },
            outro:
                "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};

const forgotPasswordMailgenContent = (fullname: string, passwordResetUrl: string) => {
    return {
        body: {
            name: fullname,
            intro: "We got a request to reset the password of our account",
            action: {
                instructions:
                    "To reset your password click on the following button or link:",
                button: {
                    color: "#22BC66", // Optional action button color
                    text: "Reset password",
                    link: passwordResetUrl,
                },
            },
            outro:
                "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};
export {
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent, sendEmail
};
