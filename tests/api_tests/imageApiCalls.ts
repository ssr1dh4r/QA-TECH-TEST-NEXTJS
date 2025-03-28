import { BaseApiClient } from "./baseApiClient";
import { ImageTypeDto } from "@/lib/data";
import { ImageType } from "../../src/components/Helper/ImageConsts";

export class ImageApiCalls extends BaseApiClient{

    endpoint: string = "/api/images";
    header: Record<string, string> = { "Content-type" : "application/json" }
    
    async getAllImages(){
        const response = await this.getCall(this.endpoint, this.header);
        return response;
    //     const getImagesDetails: ImageTypeDto[] = await response.json();
    //     const result: ImageType[] = getImagesDetails.map((image: ImageTypeDto) => {
    //         const deserializeImage: ImageType = {
    //           Id: image.id,
    //           Title: image.title,
    //           Image: image.image,
    //           Keywords: image.keywords,
    //           UploadDate: image.uploadDate,
    //         };
    //         return deserializeImage;
    //       });
    //       return result;
    //    // return getImagesDetails;
    }

    async getImageUsingKeyword(keyword: string[]){

        //if the array contains just one keyword then adding to url is easy
        var param : string = keyword[0];

        //if the keyword array contains more than 1 item then aggregate the keywords separating with &
        if(keyword.length > 1){
            for(let i = 1; i < keyword.length; i++){
                param = param + "&" + keyword[i];
            }
        }
            
        const response = await this.getCall(this.endpoint + `?keyword=${param}` , this.header);
        return response;
    }

    async addImageUsingPOST(body: string){
        const response = await this.postCall(this.endpoint, body, this.header);
        return response;
    }

    async deleteImage(id: string){
        const response = await this.deleteCall(this.endpoint + `?id=${id}`, this.header);
        return response;
    }

    async getImageUsingInvalidKeyword(keyword: any){
        const response = await this.getCall(this.endpoint + `/keyword/${keyword}` , this.header);
        return response;
    }
}