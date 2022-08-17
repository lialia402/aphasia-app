import { Unit } from "./unit-class.model";

export class TestResult extends Unit {
    public id:string;
    public testId:string;
    public userEmail:string;
    public wrongList:string[];
    public rightList:string[];
    public duration: Date;
    public answerDate:Date;

    constructor(id: string, userEmail: string,testId:string, duration:Date, wrongList:string[], rightList:string[]) {
        super();
        this.testId = testId;
        this.duration = duration;
        this.id=id;
        this.userEmail=userEmail;
        this.wrongList=wrongList;
        this.rightList=rightList;
        this.answerDate=new Date();
    }
}
