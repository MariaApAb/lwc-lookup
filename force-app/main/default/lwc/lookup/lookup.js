import { LightningElement, api, wire, track } from 'lwc';
import findSObjects from '@salesforce/apex/LookupController.findSObjects';

const DELAY = 300;

export default class Lookup extends LightningElement {
	@api recordApiName;
    @api titleApiName;
    @api subtitleApiName;
    @api iconName;
    @api sobjects = [];
    isOpen = true;
    _error;

    handleOnClick() {

    }

    search(e) {
        //alert(e.target.value);
        /*window.clearTimeout(this.delayTimeout);
        const searchKey = e.target.value;
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
            if (this.searchKey == null || this.searchKey == "") this.sobjects = [];
        }, DELAY);*/
        console.log({ searchKey : e.target.value});
        if (e.target.value != null && e.target.value != ''){
            findSObjects({ searchKey : e.target.value})
                .then(result => {
                    console.log(this.isOpen);
                    this.sobjects = result;
                    this.isOpen = true;
                    console.log(this.sobjects);
                    console.log(this.isOpen);
                })
                .catch(error => {
                    this._error = error;
                    console.log(this._error);
                });
        } else {
            this.sobjects = [];
        }
    }
}