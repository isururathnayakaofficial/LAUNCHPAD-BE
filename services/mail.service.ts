import nodemailer from "nodemailer";
import dotenv from "dotenv"; 
dotenv.config();
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASSWORD!
    }
});


export const sendTaskEmail = async (
    email:string,
    taskTitle:string,
    taskLink:string
) => {

    try {

        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: email,

            subject: `New Task Assigned - ${taskTitle}`,

            html: `
                <h2>You have been assigned a new task</h2>

                <p>Task: ${taskTitle}</p>

                <p>Click below to view your task:</p>

                <a href="${taskLink}">
                    Join Task
                </a>
            `
        });


        console.log("Email sent successfully");

    } catch(error){

        console.log("Email sending failed", error);

    }

};