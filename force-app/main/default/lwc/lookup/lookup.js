import { LightningElement, api, track } from "lwc";
import findSObjects from "@salesforce/apex/LookupController.findSObjects";
import findSObjects2 from "@salesforce/apex/LookupController.findSObjects2";

export default class Lookup extends LightningElement {
    @api sobjectApiName;
    @api titleApiName;
    @api subtitleApiName;
    @api iconName;
    @api labelHidden;
    @api label;
    @api defaultSelectedRecord;
    @api searchKey;
    @api tableFields;
    @api lookupModal = false;

    @track selectedObj;
    @track sobjects = [];
    @track selected = false;
    @track isOpen = false;
    @track displayModal = false;
    @track fields = [];
    @track results = [];

    placeholder;
    _error;
    _container;

    renderedCallback() {
        this._container = this.template.querySelector("[data-id=combobox]");
        this.placeholder = "Search " + this.sobjectApiName + "...";
    }

    connectedCallback() {
        this.selectedObj = this.defaultSelectedRecord;
        this.fields = [this.titleApiName, this.subtitleApiName];
        if (this.tableFields != null) {
            this.fields.push(...this.tableFields.split(","));
        }
        console.log(JSON.stringify(this.fields, null, 2));
    }

    handleItemClick(e) {
        this.selectedObj = e.detail; //this.sobjects[parseInt(e.currentTarget.dataset.index)];
        this.selected = true;
        this.dispatchEvent(new CustomEvent("select", { detail: this.selectedObj }));
    }

    removeSelected() {
        this.selectedObj = null;
        this.selected = false;
        this.dispatchEvent(new CustomEvent("select", { detail: null }));
    }

    /*search(e) {
        this.searchKey = e.target.value;
        if (this.searchKey != null && this.searchKey != "") {
            findSObjects({
                searchKey: this.searchKey,
                sobjectApiName: this.sobjectApiName,
                titleApiName: this.titleApiName,
                subtitleApiName: this.subtitleApiName
            })
                .then((result) => {
                    this.sobjects = result;
                })
                .catch((error) => {
                    this._error = error;
                });
        } else {
            this.sobjects = [];
        }
        this.displayList();
    }*/

    search(e) {
        this.searchKey = e.target.value;
        console.log(this.returnAllFields);
        if (this.searchKey != null && this.searchKey != "" && this.searchKey.length > 2) {
            findSObjects2({
                searchKey: this.searchKey,
                sobjectApiName: this.sobjectApiName,
                fields: this.fields,
                returnAllFields: this.lookupModal
            })
                .then((result) => {
                    this.sobjects = !this.lookupModal ? result : result.slice(1);
                    if (this.lookupModal) {
                        this.results = result[0].data;
                        console.log(JSON.stringify(this.results, null, 2));
                    }
                })
                .catch((error) => {
                    this._error = error;
                });
        } else {
            this.sobjects = [];
        }
        this.displayList();
    }

    displayList() {
        this.isOpen = this.searchKey != null && this.searchKey != "";
        if (this.isOpen) this._container.classList.add("slds-is-open");
        else this._container.classList.remove("slds-is-open");
    }

    keyPress(e) {
        if (e.which == 13) this.modal();
    }

    modal() {
        if (!this.lookupModal) this.displayModal = !this.displayModal;
        //this.isOpen = this.displayModal ? false : this.isOpen; //NOTE: desplegar resultados al hacer click en el input
    }

    handleModalSubmit() {}

    get modalHeader() {
        return this.label != null ? this.label : this.sobjectApiName;
    }
}
