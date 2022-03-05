export class Unit{
    public static toObject(unit:any){
        return JSON.parse(JSON.stringify(unit));
    }
}

export class Punctuation
{
    name: string = "";
    uniCode:string = "";
    hebrewName: string = "";
}