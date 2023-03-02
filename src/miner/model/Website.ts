import Root = cheerio.Root;
import {AxiosResponse} from "axios";
import cheerio from "cheerio";

export class Website {
    private url: string;
    private readonly cheerioData: Root;
    private readonly host: string;
    private _title: string;
    private _favicon: string;
    private _imageUrls: string[];
    private _stylesheetUrls: string[];
    private _metaDataDescriptions: string[];
    constructor(httpResponse:AxiosResponse){
        const cheerioData = cheerio.load(httpResponse.data);
        const host = httpResponse.request.host;

        this.cheerioData = cheerioData;
        this.host = host;
    }

    setUrl(url: string){
        this.url = url;

        return this;
    }

    setTitle(){
        this._title = this.cheerioData("title").text();

        return this;
    }

    setFavIconUrl(){
        this._favicon = this.host + this.cheerioData('link[rel="icon"]').attr('href') || this.cheerioData('link[rel="shortcut icon"]').attr('href');

        return this;
    }

    setImageUrls(){
        const imageUrls = [];
        this.cheerioData('img').map((index, img) => {
            imageUrls.push(this.host + this.cheerioData(img).attr('src'));
        });
        this._imageUrls = imageUrls;

        return this;
    }

    setStylesheetUrls(){
        const stylesheetUrls = [];
        this.cheerioData('link[rel="stylesheet"]').map((index,link)=>{
            stylesheetUrls.push(this.host + this.cheerioData(link).attr('href'));
        });
        this._stylesheetUrls = stylesheetUrls;

        return this;
    }

    setMetadataDescription(){
        const metaDataDescription = [];

        this.cheerioData('meta').map((index,meta) => {
            if (this.cheerioData(meta).attr('name')){
                metaDataDescription.push(this.cheerioData(meta).attr('name'));
            }
        });
        this._metaDataDescriptions = metaDataDescription;

        return this;
    }


    get title(): string {
        return this._title;
    }

    get favicon(): string {
        return this._favicon;
    }

    get imageUrls(): string[] {
        return this._imageUrls;
    }

    get stylesheetUrls(): string[] {
        return this._stylesheetUrls;
    }

    get metaDataDescriptions(): string[] {
        return this._metaDataDescriptions;
    }

    get websiteUrl():string{
        return this.url;
    }
}
