import { Unit } from "./unit-class.model";

export class UserClass extends Unit{

    email: string | undefined;
    password: string | undefined;
    constructor()
    {
        super()
    }
}