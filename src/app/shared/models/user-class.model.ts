import { Unit } from "./unit-class.model";


export class UserClass extends Unit{

    email: string | undefined;
    password: string | undefined;
    constructor()
    {
        super()
    }

    public get getEmail()
    {
        return this.email;
    }


    SetEmail(new_email:string)
    {
        this.email = new_email
    }

    
    SetPassword(new_password:string)
    {
        this.password = new_password
    }

    public override toString()
    {
        return this.email;
    }
}