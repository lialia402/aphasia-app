export class Unit{
    public static toObject(unit:any){
        return JSON.parse(JSON.stringify(unit));
    }
}