import { getPostRequestInit } from "./helper";
import { ApiResult, StatusResponse } from "./response";

export interface IChat {
    send(tableId: number, message: string): Promise<StatusResponse>;
}

export class Chat implements IChat {
    constructor(public host: string) {
    }

    public async send(tableId: number, message: string): Promise<StatusResponse> {
        const data = { message };
        const response = await fetch(this.host + `/api/table/${tableId}/chat`, getPostRequestInit(data));
        const jsonData = await response.json() as ApiResult<StatusResponse>;
        return jsonData;
    }
}
