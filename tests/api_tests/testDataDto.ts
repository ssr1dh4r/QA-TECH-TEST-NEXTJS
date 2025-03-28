import { ImageTypeRequest } from "@/components/Helper/ImageConsts";

class TestDataDto{
  //id: string;
  title?: string;
  image?: string;
  keywords?: string[];
  uploadDate?: Date;
  //expectedTitle: string;
  //expectedImageUrl: string;

    constructor(builder: TestDataBuilder){
      this.title = builder.title;
      this.image = builder.image;
      this.keywords = builder.keywords;
      this.uploadDate = builder.uploadDate;
    }

}

export class TestDataBuilder{
  title?: string;
  image?: string;
  keywords?: string[];
  uploadDate?: Date;

  constructor(){
    
  }

  setTitle(title:string){
    this.title = title;
    return this;
  }

  setImage(image: string){
    this.image = image;
    return this;
  }

  setKeywords(keywords: string[]){
    this.keywords = keywords;
    return this;
  }

  setUploadDate(uploadDate: Date){
    this.uploadDate = uploadDate;
    return this;
  }



  build(): TestDataDto {
    return new TestDataDto(this)
  }


}