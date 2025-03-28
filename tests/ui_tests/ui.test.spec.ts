import { test, expect } from '@playwright/test'
import { HomePage } from './page_models/homePage';
import { generateTitle} from '../utils/generateRamdomTitle';
import { convertToISO } from '../utils/convertDate';
import { GetAllImages } from '@/components/Helper/Api';

test.describe('UI Test', () => {
    const pageUrl = "http://localhost:3000/";
    let homePage : HomePage;

    test.beforeEach(async ({ page }) => {
       homePage = new HomePage(page);
       await homePage.launchHomePage(pageUrl);
        console.log(page.url());
        expect(page.url()).toBe(pageUrl);
       
    });


    test('Submit an image and validate image is displayed', async() => {
        const newTitle = generateTitle();
        await homePage.clickAddImage();
        await homePage.enterImageDetailsAndSubmit(newTitle, 
                                      "https://fastly.picsum.photos/id/17/2500/1667.jpg?hmac=HD-JrnNUZjFiP2UZQvWcKrgLoC_pc_ouUSWv8kHsJJY",
                                    "tree, grass, path", '03/22/2025');                                                                 

        const newImage = homePage.getImageBasedOnTitle(newTitle);                            
        await expect(newImage).toBeVisible();
    });

    test('Search feature', async( { page} ) => {

        //test data
        let searchText = ['Coffee', 'Book', 'Mount']
        for(const text of searchText){
            await homePage.enterSearchText(text);
            await expect(homePage.getImageBasedOnTitle(text)).toBeVisible();
        }
    });

    test('Filter feature using keywords for an image', async() => {
        
        //test data
        let values : string[] = ['snow','cold','mountains']

        //select values in the filter dropdown
        await homePage.selectFilterValue(values);
        
        for(const value of values){
            expect(homePage.getImageBasedOnKeywords(value)).toBeVisible();
        }
    });

    test('Filter feature with different keywords', async() => {
        
        //test data
        let values : string[] = ['snow','book']

        //select values in filter dropdown
        await homePage.selectFilterValue(values);
     
        for(const value of values){
            expect(homePage.getImageBasedOnKeywords(value)).not.toBeVisible();
        }
    });

    test('Validation of date range to filter images', async() => {
        
        //Use existing Api call to get all available images
        const imageList = await GetAllImages();

        //test data
        let startDate = '02/22/2025';
        let endDate = '03/29/2025';

        //convert to ISO format using the utility function
        const startDateISO = convertToISO(startDate);
        const endDataISO = convertToISO(endDate);

        //Input the value in the UI
        await homePage.addStartDate(startDate);
        await homePage.addEndDate(endDate);

        //iterate through the images returned via the API call and confirm only the images with upload date within the test dat range is/are displayed
        for(const image of imageList){
            if(image.UploadDate >= startDateISO && image.UploadDate <= endDataISO){
               expect(homePage.getImageBasedOnTitle(image.Title)).toBeVisible();
            } else {
                expect(homePage.getImageBasedOnTitle(image.Title)).not.toBeVisible();
            }
        }

    });



});