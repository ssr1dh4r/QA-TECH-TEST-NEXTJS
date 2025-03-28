import {expect, test} from '@playwright/test';
import { ImageApiCalls } from './imageApiCalls';
import { promises as fs}  from 'fs';
import { TestDataBuilder } from '../api_tests/testDataDto';
import { join } from 'path';
import exp from 'constants';
import { addJsonData, removeJsonData } from '../utils/jsonDataToFile';
import { generateTitle} from '../utils/generateRamdomTitle';
import { ImageType } from "../../src/components/Helper/ImageConsts";





test.describe.parallel('API Tests', () => {
    const baseURL = "http://localhost:3000";
    let testData! : ImageType[];
    
    let api: ImageApiCalls;

    test.beforeEach(async() => {
        api = new ImageApiCalls();
        await api.init(baseURL);
        const filePath = join(__dirname, '../test_data/api_data.json');
        const data = await fs.readFile(filePath,'utf-8');
        testData = JSON.parse(data);
    });


    //Validate if images are returned
    test('Test for get all image call', async() => {
        const getImageData = await api.getAllImages();
        const imageList : ImageType[] = await getImageData.json();
        expect(imageList.length).toBeGreaterThan(0);       
    });



    //Validation of GET call to retrieve images using one or multiple keyword(s)
    test('Test to get image using multiple keywords', async() => {
        for(const data of testData){
                const response = await api.getImageUsingKeyword(data.Keywords);
                expect(response.status()).toBe(200);
                const getImages : ImageType[]  = await response.json();
 
                //Filter images returned based on unique id in case images have overlapping keywords
                const assertImageData = getImages.filter((image) => image.Id == data.Id);

                //Assert the values in the filtered data
                for(const assertData of assertImageData){
                    expect(assertData.Title).toEqual(data.Title);
                    expect(assertData.Image).toMatch(data.Image);

                    data.Keywords.forEach(expectedKeyword => {
                        expect(assertData.Keywords).toContain(expectedKeyword);
                    });
                }
            }
    });

    //Validate if new images are added using POST
    test('Test to add image using POST', async() => {
        const newTitle = generateTitle();
        const imageData = new TestDataBuilder()
                                .setTitle(newTitle)
                                .setImage("https://fastly.picsum.photos/id/5/5000/3334.jpg?hmac=R_jZuyT1jbcfBlpKFxAb0Q3lof9oJ0kREaxsYV3MgCc")
                                .setKeywords(["laptop", "phone", "book"])
                                .setUploadDate(new Date("2024-04-20"))
                                .build();

        const body = JSON.stringify(imageData);           
        const reponse = await api.addImageUsingPOST(body);    
        expect(reponse.status()).toBe(201);

        //checking if the image is in list using the title
        const getImageData = await api.getAllImages();
        const imageList : ImageType[] = await getImageData.json();
        const addedImage = imageList.find((image) => image.Title == imageData.title);

       //Image details added to a json file that can be used for delete test
        const addFilePath = join(__dirname, '../test_data/addImageData.json');
        addJsonData(addFilePath, addedImage);

        expect(addedImage?.Image).toBe(imageData.image);
        expect(addedImage?.Keywords).toEqual(imageData.keywords);
        expect(addedImage?.UploadDate).toContain(imageData.uploadDate?.toISOString());

    });



    //Validate image is deleted using DELETE call
    test('Test to delete an image using DELETE', async() => {
        const deleteFilePath = join(__dirname, '../test_data/addImageData.json');
        const dataToDelete = await fs.readFile(deleteFilePath,'utf-8');
        const deleteData : ImageType[] = JSON.parse(dataToDelete);

        if(testData.length > 0){
            for(const data of deleteData){
                const response = await api.deleteImage(data.Id);
                expect(response.status()).toBe(200);
                
                //remove the image details from the json file where the images added were recorded
                removeJsonData(deleteFilePath, data.Id);

                //Check of the image is not returned in the list
                const getImageData = await api.getAllImages();
                const imageList : ImageType[] = await getImageData.json();
                const assertDelete = imageList.find(image => image.Id == data.Id);
                expect(assertDelete).toBeUndefined();

            }
        }
    });


    //Validation of GET call to retrieve images using invalid keyword
    test('Test to get image using invalid keywords', async() => {
            const testKeyword : any = '&&&';
            const response = await api.getImageUsingInvalidKeyword(testKeyword);
            expect(response.status()).toBe(400);
    });

    test('Test to add image with missing title', async() => {
        const newTitle = generateTitle();
        const imageData  = new TestDataBuilder()
                           .setImage("https://fastly.picsum.photos/id/5/5000/3334.jpg?hmac=R_jZuyT1jbcfBlpKFxAb0Q3lof9oJ0kREaxsYV3MgCc")
                           .setKeywords(["laptop", "phone", "book"])
                           .setUploadDate(new Date("2022-03-11"))
                           .build();

        const body = JSON.stringify(imageData);           
        const reponse = await api.addImageUsingPOST(body); 
        expect(reponse.status()).toBe(400);
    });

    test('Test to add image with missing image', async() => {
        const newTitle = generateTitle();
        const imageData  = new TestDataBuilder()
                           .setTitle(newTitle)
                           .setKeywords(["laptop", "phone", "book"])
                           .setUploadDate(new Date("2021-09-09"))
                           .build();

        const body = JSON.stringify(imageData);           
        const reponse = await api.addImageUsingPOST(body); 
        expect(reponse.status()).toBe(400);
    });

    test('Test to add image with missing keyword', async() => {
        const newTitle = generateTitle();
        const imageData  = new TestDataBuilder()
                           .setTitle(newTitle)
                           .setImage("https://fastly.picsum.photos/id/5/5000/3334.jpg?hmac=R_jZuyT1jbcfBlpKFxAb0Q3lof9oJ0kREaxsYV3MgCc")
                           .setUploadDate(new Date("2021-09-09"))
                           .build();

        const body = JSON.stringify(imageData);           
        const reponse = await api.addImageUsingPOST(body); 
        expect(reponse.status()).toBe(400);
    });


    test('Test to add image with missing uploadDate', async() => {
        const newTitle = generateTitle();
        const imageData  = new TestDataBuilder()
                           .setTitle(newTitle)
                           .setImage("https://fastly.picsum.photos/id/5/5000/3334.jpg?hmac=R_jZuyT1jbcfBlpKFxAb0Q3lof9oJ0kREaxsYV3MgCc")
                           .setKeywords(["laptop", "phone", "book"])
                           .build();

        const body = JSON.stringify(imageData);           
        const reponse = await api.addImageUsingPOST(body); 
        expect(reponse.status()).toBe(400);
    });

    test('Test to delete using an invalid image id', async() => {     
                const response = await api.deleteImage("testImageId");
                expect(response.status()).toBe(404);
    });
});




       

    
        
       
      
