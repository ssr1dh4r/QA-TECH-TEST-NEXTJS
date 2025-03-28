import * as fs  from 'fs';
import { ImageType } from "../../src/components/Helper/ImageConsts";

export function addJsonData(filePath: string, newJsonData: any){
    let jsonArray: any[] = [];

    if(fs.existsSync(filePath)){
        const fileContent = fs.readFileSync(filePath, "utf-8");
        if(fileContent.trim()){
            jsonArray = JSON.parse(fileContent);
        }
    }
    jsonArray.push(newJsonData);
    fs.writeFileSync(filePath, JSON.stringify(jsonArray, null, 2), "utf-8");
}

export function removeJsonData(filePath: string, idToDelete: string){
    let jsonArray: ImageType[] = [];

    const fileContent = fs.readFileSync(filePath, "utf-8");
    jsonArray = JSON.parse(fileContent);
    const updatedArray = jsonArray.filter(data => data.Id !== idToDelete);

    fs.writeFileSync(filePath, JSON.stringify(updatedArray, null, 2), "utf-8");
}

