import firebase from "firebase/app";
import "firebase/firestore"
import { EmailTemplates } from "./email.service";

export class AppConfig {
    constructor(){}

    randomInt(min:number, max:number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getFormattedAmount(_currency: string, value: number) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: _currency,
            minimumFractionDigits: 2
        })
        return formatter.format(value)
    }

    async sendGeneralEmail(email: string, subject: string, content: string) {
        const email_template = new EmailTemplates().getGeneralEmailTemplate(subject, content)

        await firebase.firestore().collection("mail").add({
            to: email,
            message: {
                subject: subject,
                html: email_template,
            },
        });
    }

    formatNumber(number: string) {
        const re = /\ /gi
        const n = number.toString().replace(re, '')
        if (n.startsWith('234')) {
            return n.replace(re, '')
        } else if (n.startsWith('+234')) {
            return n.substring(1).replace(re, '')
        } else if (n.startsWith('0')) {
            return `234${n.substring(1).replace(re, '')}`
        } else if (n.startsWith('7') || n.startsWith('8') || n.startsWith('9')) {
            return `234${n.replace(re, '')}`
        }
        return n.replace(re, '')
    }
}