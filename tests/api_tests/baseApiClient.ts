import { APIRequestContext, request } from "@playwright/test";

export class BaseApiClient {
    private requestContext!: APIRequestContext;

    async init(baseURL: string){
        this.requestContext = await request.newContext({baseURL});
    }

    async getCall(endpoint: string, headers:Record<string, string> = {}){
        const response = await this.requestContext.get(endpoint, headers);
        return response;
    }

    async postCall(endpoint: string, body: string, header: Record<string, string>){
       const response = await this.requestContext.post(endpoint, 
         {
            data: body,
            headers: header,
         });
         return response;
    }

    async deleteCall(endpoint: string, headers: Record<string, string> = {}){
        const response = await this.requestContext.delete(endpoint, headers);
        return response;
    }

    
}