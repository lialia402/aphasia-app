import { Unit } from "./unit-class.model";

export class CategoryClass extends Unit{
    public name: string; //the hebrew name of the category
    public id: string; //the ID of the category on the DB
    public imageURL: string; //the image url of the category
    public userEmail: string; //the email of the user that have this category
    public parentCategoryID: string; //tdl
    public views: number; //the number of the times the user clicked the category
    public isFav: boolean;//favorite category - not implemented yet
    public order: number;//order by - not implemented yet
    public visibility: boolean;//TRUE if the category is visible to the user
    public viewPerDate:Date[]; //date array of views

    constructor(
        name: string, 
        id: string, 
        imageURL: string, 
        userEmail: string,
        parentCategoryID: string, 
        views: number, 
        isFav: boolean, 
        order: number,
        visibility: boolean) {
        super();
        this.name = name;
        this.id = id;
        this.imageURL = imageURL;
        this.userEmail = userEmail;
        this.parentCategoryID = parentCategoryID;
        this.views = views;
        this.isFav = isFav;
        this.order = order;
        this.visibility = visibility;
        this.viewPerDate=[];
    }
}
