export interface User {
    uid: string;
    firstName?: string;
    lastName?: string;
    userID?: string;
    email: string;
    emailVerified: boolean;
    userType?: string;
    firstTime?:boolean;
    listOfPatients?:string[];
 }

