import { Page, Locator } from '@playwright/test'
export class HomePage{
    
    private page: Page;
    
    constructor(page: Page){
        this.page = page;      
    }


    async launchHomePage(url: string){
        await this.page.goto(url, {waitUntil: 'load'});
        await this.page.waitForLoadState('load');
        await this.page.waitForSelector("//div[@id='__next']//div/ul//div[contains(@class,'MuiImageListItemBar-title') and (text()='Book')]", { state : 'visible'});
    }

    async enterSearchText(data: string){
        await this.page.getByPlaceholder("Search").fill(data);
    }

    async clickAddImage(){
        await this.waitForPageLoadBasedOnSelector("//button[contains(text(), 'Add Image')]");
        await this.page.locator("//button[contains(text(), 'Add Image')]").click();
    }

    async enterImageDetailsAndSubmit(title: string, imageUrl: string, keywords: string, dateValue: string){
       await this.enterTitle(title);
       await this.addImageUrl(imageUrl);
       await this.enterKeywords(keywords);
       await this.enterUploadDate(dateValue);
       await this.submitImage(); 
       await this.waitForPageLoadBasedOnSelector(`//div[@id='__next']//div/ul//div[contains(@class,'MuiImageListItemBar-title') and contains(text(),'${title}')]/../../..`)
    }

    async enterTitle(title: string){
        await this.page.locator("//div/h2[contains(text(),'Submit an Image')]/following-sibling::div//input[@id='Title']").fill(title);
    }

    async addImageUrl(imageUrl: string){
        await this.page.locator("//div/h2[contains(text(),'Submit an Image')]/following-sibling::div//input[@id='Url']").fill(imageUrl);
    }

    async enterKeywords(keywords: string){
        await this.page.getByLabel("Keywords").fill(keywords);
    }

    async enterUploadDate(dateValue: string){
        const dateSelector = "//div/h2[contains(text(),'Submit an Image')]/following-sibling::div//input[@placeholder='MM/DD/YYYY']";
        const inputDate = this.page.locator(dateSelector);
        await inputDate.click();
        await this.page.press(dateSelector, 'Control+A')
        await this.page.press(dateSelector, 'Control+A')
        await inputDate.fill(dateValue);
    }

    async cancelImageSubmission(){
        await this.page.getByRole('button', {name : 'Cancel'}).click();
    }

    async submitImage(){
        await this.page.getByRole('button', {name : 'Submit'}).click();
    }

    getImageBasedOnTitle(title: string) : Locator {
        const imageBasedTitle = this.page.locator(`//div[@id='__next']//div/ul//div[contains(@class,'MuiImageListItemBar-title') and contains(text(),'${title}')]/../../..`);
        return imageBasedTitle;
    }  
    
    getImageBasedOnKeywords(keyword: string) : Locator {
        const imageBasedTitle = this.page.locator(`//div[@id='__next']//div/ul//div[contains(@class,'MuiImageListItemBar-subtitle') and contains(text(),'${keyword}')]/../../..`);
        return imageBasedTitle;
    }

    getImagesDisplayed() : Locator{
        return this.page.locator("//div[@id='__next']//div/ul//li");
    }

    async selectFilterValue(value: string[]){
        const filterDropDown = this.page.locator("//h6[contains(text(),'Filter')]/following-sibling::div/div");
        await filterDropDown.click();

        for(const filterValue of value){
            const selectFilterValue = this.page.locator(`//div/ul[contains(@class,'MuiMenu-list')]/li[@data-value='${filterValue.toLowerCase()}']`);
            await selectFilterValue.click();
        }       
    }

    async waitForPageLoadBasedOnSelector(selector: string){
        await this.page.waitForSelector(selector, {state: 'visible', timeout: 20000});
    }

    async addStartDate(dateValue : string){
        const startDateFieldSelector = "//div/label[contains(text(),'Start Date')]/following-sibling::div/input";
        const startDateFiled = this.page.locator(startDateFieldSelector);
        await startDateFiled.click();
        await this.page.press(startDateFieldSelector, 'Control+A');
        await startDateFiled.fill(dateValue)
    }

    async addEndDate(dateValue : string){
        const startDateFieldSelector = "//div/label[contains(text(),'Start Date')]/following-sibling::div/input";
        const startDateFiled = this.page.locator(startDateFieldSelector);
        await startDateFiled.click();
        await this.page.press(startDateFieldSelector, 'Control+A');
        await startDateFiled.fill(dateValue)
    }

}