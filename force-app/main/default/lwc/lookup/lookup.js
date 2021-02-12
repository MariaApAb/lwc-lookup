import { LightningElement, api, track } from "lwc";
import findSObjects from "@salesforce/apex/LookupController.findSObjects";

export default class Lookup extends LightningElement {
  @api sobjectApiName;
  @api titleApiName;
  @api subtitleApiName;
  @api iconName;
  @api labelHidden;
  @api label;
  @api defaultSelectedRecord;

  @track selectedObj;
  @track sobjects = [];
  @track selected = false;
  @track isOpen = false;
  @track searchKey;
  placeholder;
  _error;
  _container;

  renderedCallback() {
    this._container = this.template.querySelector("[data-id=combobox]");
    this.placeholder = "Search " + this.sobjectApiName + "...";
  }

  connectedCallback() {
    this.selectedObj = this.defaultSelectedRecord;
  }

  handleOnClick(e) {
    this.selectedObj = this.sobjects[parseInt(e.currentTarget.dataset.index)];
    this.selected = true;
    this.dispatchEvent(new CustomEvent("select", { detail: this.selectedObj }));
  }

  removeSelected() {
    this.selectedObj = null;
    this.selected = false;
    this.dispatchEvent(new CustomEvent("select", { detail: null }));
  }

  search(e) {
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
  }

  displayList() {
    this.isOpen = this.searchKey != null && this.searchKey != "";
    if (this.isOpen) this._container.classList.add("slds-is-open");
    else this._container.classList.remove("slds-is-open");
  }

  openModal() {
    alert("soy un modal feo");
  }
}
