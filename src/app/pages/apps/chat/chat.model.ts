export interface ChatUser {
    image?: string;
    name: string;
    message: string;
    time: string;
    color: string;
}

export interface ChatMessage {
    align?: string;
    name?: any;
    message: string;
    time: string;
    profile?: string;
}