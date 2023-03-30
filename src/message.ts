import { getPostRequestInit, getRequestInit } from "./helper";
import { ApiResult, StatusResponse } from "./response";

export interface InboxMessagesData {
    Messages: string[];
}

export interface IMessage {
    send(recepient: number, subject: string, body: string): Promise<StatusResponse>;
    getInboxMessages(
        page: number,
        pageSize: number,
        filter: number,
        sortOrder: boolean): Promise<ApiResult<InboxMessagesData>>;
    getSentMessages(
        page: number,
        pageSize: number,
        filter: number,
        sortOrder: boolean): Promise<ApiResult<InboxMessagesData>>;
    getMessage(id: number): Promise<ApiResult<InboxMessagesData>>;
}

export class Message implements IMessage {
    constructor(public host: string) {
    }
    public async send(recepient: number, subject: string, body: string): Promise<StatusResponse> {
        const data = { recepient, subject };
        const response = await fetch(this.host + `/api/messages`, getPostRequestInit(data));
        const jsonData = await response.json() as StatusResponse;
        return jsonData;
    }
    public async getInboxMessages(page: number, pageSize: number, filter: number, sortOrder: boolean) {
        const response = await fetch(
            this.host + `/api/messages/inbox?page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}&filter=${filter}`,
            getRequestInit());
        const jsonData = await response.json() as ApiResult<InboxMessagesData>;
        return jsonData;
    }
    public async getSentMessages(page: number, pageSize: number, filter: number, sortOrder: boolean) {
        const response = await fetch(
            this.host + `/api/messages/sent?page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}&filter=${filter}`,
            getRequestInit());
        const jsonData = await response.json() as ApiResult<InboxMessagesData>;
        return jsonData;
    }
    public async getMessage(id: number) {
        const data = { id };
        const response = await fetch(this.host + `/api/message/${id}`, getRequestInit());
        const jsonData = await response.json() as ApiResult<InboxMessagesData>;
        return jsonData;
    }
}
