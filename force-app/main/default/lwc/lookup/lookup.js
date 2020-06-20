import { LightningElement, api, wire, track } from 'lwc';
import findSObjects from '@salesforce/apex/LookupController.findSObjects';

export default class Lookup extends LightningElement {
	@api recordApiName;
    @api titleApiName;
    @api subtitleApiName;
    @api iconName;
    @api labelHidden;
    @api label;
    @api sobjects = [];
    @api selected;
    isOpen = false;
    searchKey;
    _error;
    _container;

    renderedCallback() {
        this._container = this.template.querySelector('[data-id=container]');
    }

    handleOnClick(sobj) {
        return function() {
            console.log(index);
            this.selected = sobj;
            console.log(this.selected);
        }
    }

    search(e) {
        this.searchKey = e.target.value;
        if (this.searchKey != null && this.searchKey != ''){
            findSObjects({ searchKey : this.searchKey, recordApiName : this.recordApiName, titleApiName : this.titleApiName, subtitleApiName : this.subtitleApiName })
                .then(result => {
                    this.sobjects = result;
                })
                .catch(error => {
                    this._error = error;
                });
        } else {
            this.sobjects = [];
        }
        this.displayList();
        this.addOnClickEvent();
    }

    displayList() {
        this.isOpen = this.searchKey != null && this.searchKey != "";
        if (this.isOpen) this._container.classList.add("slds-is-open");
        else this._container.classList.remove("slds-is-open");
    }

    addOnClickEvent() {
        for (let listItem of this.template.querySelectorAll("li.myListItem")){
            listItem.addEventListener("click", this.handleOnClick(this.sobjects[parseInt(listItem.dataset.id)]), true);
        }
    }
}