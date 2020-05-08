import { LightningElement, api, wire, track } from 'lwc';
import findSObjects from '@salesforce/apex/LookupController.findSObjects';

const DELAY = 300;

export default class Lookup extends LightningElement {
	@api recordApiName;
    @api titleApiName;
    @api subtitleApiName;
    @api iconName;
    @api sobjects;
    error;

    searchKey = '';
    
    @wire(findSObjects, { searchKey: "$searchKey" })
    wiredSObjects({ error, data }) {
        if (data) {
            this.sobjects = data;
            this.error = undefined;
            console.log(this.sobjects);
        } else if (error) {
            this.error = error;
            this.sobjects = undefined;
        }
    }

    search(e) {
        //alert(e.target.value);
        window.clearTimeout(this.delayTimeout);
        const searchKey = e.target.value;
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
            if (this.searchKey == null || this.searchKey == "") this.sobjects = [];
        }, DELAY);
    }
}