import { Injectable } from "@angular/core";
import { v4 as uuidv4 } from "uuid"

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    getUniqueId() {
        return uuidv4();
    }

    getUniqueIdNumber() {
        const currentTime = new Date();
        return currentTime.getTime();
    }
}