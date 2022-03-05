import { Unit } from "./unit-class.model";
// export class Unit{
//     public static toObject(unit:any){
//         return JSON.parse(JSON.stringify(unit));
//     }
// }
export class WordClass extends Unit{
    public id: string; //the ID of the phrase in the DB
    public name: string; //the hebrew name of the phrase
    public categoryID: string; //the ID of the category of the phrase in the DB
    public views: number; //the number of the times that the user clicked on the phrase
    public imageURL: string; //the url of the image of the phrase
    public audio: string;//a url link to the audio file in the storage
    public isFav: boolean// TRUE if this phrase is one of the user selected favorite phrases. else, FALSE.
    public order: number//the # of the phrase in the category
    public visibility: boolean;//TRUE if the phrase is visible to the user

    constructor(id: string, name: string, imageURL: string,
        categoryID: string, views: number, audio: string, isFav: boolean, order: number, visibility: boolean) {
        super();

        this.id = id;
        this.imageURL = imageURL;
        this.name = name;
        this.categoryID = categoryID;
        this.views = views;
        this.audio = audio;
        this.isFav = isFav;
        this.order = order;
        this.visibility = visibility;
    }

    //GETTERS
    public getID() {
        return this.id;
    }
    public getName() {
        return this.name;
    }
    public getImageURL() {
        return this.imageURL;
    }
    public getCategoryID() {
        return this.categoryID;
    }
    public getViews() {
        return this.views;
    }
    public getAudio() {
        return this.audio;
    }
    public getIsFav() {
        return this.isFav;
    }
    public getVisibility(){
        return this.visibility;
    }
}
