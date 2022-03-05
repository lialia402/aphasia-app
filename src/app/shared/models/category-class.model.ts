import { Unit } from "./unit-class.model";

export class CategoryClass extends Unit{
    public name: string; //the hebrew name of the category
    public id: string; //the ID of the category on the DB
    public imageURL: string; //the image url of the category
    public userEmail: string; //the email of the user that have this category
    public parentCategoryID: string; //if not NULL, the ID of the parent category of this sub category
    public views: number; //the number of the times the user clicked the category
    public isFav: boolean;// TRUE if this category is one of the user selected favorite categories. else, FALSE.
    public order: number;//the # of the category in the list
    public visibility: boolean;//TRUE if the category is visible to the user

    constructor(name: string, id: string, imageURL: string, userEmail: string,
        parentCategoryID: string, views: number, isFav: boolean, order: number,
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
    }


    //GETTERS
    public getName() {
        return this.name;
    }
    public getID(): string {
        return this.id;
    }
    public getImage() {
        return this.imageURL;
    }
    public getUserEmail() {
        return this.userEmail;
    }
    public getParentCategoryID() {
        return this.parentCategoryID;
    }
    public getViews() {
        return this.views;
    }
    public getIsFav(): boolean {
        return this.isFav;
    }

    public getParentCategoryId() {
        return this.parentCategoryID;
    }

    public getVisibility(): boolean{
        return this.visibility;
    }

    public getOrder(){
        return this.order;
    }


    public override toString(): string {
        return "category: \n" +
            "name: " + this.getName + "\n" +
            "id: " + this.getID + "\n" +
            "imageURL: " + this.imageURL + "\n" +
            "userEmail: " + this.getUserEmail + "\n" +
            "parentCategoryID: " + this.getParentCategoryId + "\n" +
            "views: " + this.getViews + "\n" +
            "isFav: " + this.getIsFav + "\n" +
            "order: " + this.order + "\n" +
            "visible: " + this.getVisibility + "\n";
    }
}
