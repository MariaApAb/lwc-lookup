import { LightningElement, api, wire, track } from 'lwc';
import findSObjects from '@salesforce/apex/LookupController.findSObjects';

const DELAY = 300;

export default class Lookup extends LightningElement {
    //TODO: busca los elementos pero no se ven, hay que poner una altula min al div o al ul de los items
    //TODO: bajar el z-index al div o ul
	@api recordApiName;
    @api titleApiName;
    @api subtitleApiName;
    @api iconName;
    @api sobjects = [];
    isOpen = false;
    _error;

    handleOnClick(e) {

    }

    search(e) {
        if (e.target.value != null && e.target.value != ''){
            findSObjects({ searchKey : e.target.value, recordApiName : this.recordApiName, titleApiName : this.titleApiName, subtitleApiName : this.subtitleApiName})
                .then(result => {
                    console.log(this.isOpen);
                    this.sobjects = result;
                    this.isOpen = true;
                    console.log(this.sobjects);
                })
                .catch(error => {
                    this._error = error;
                    console.log(this._error);
                });
        } else {
            this.sobjects = [];
            this.isOpen = false;
        }
    }
}