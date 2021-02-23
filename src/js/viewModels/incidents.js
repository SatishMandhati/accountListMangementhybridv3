/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your incidents ViewModel code goes here
 */

define(['knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils', 'ojs/ojcontext', 'jquery', 'ojs/ojanimation', 'ojs/ojarraydataprovider', 'text!../datacontent/data.json', 'ojs/ojasyncvalidator-regexp', 'ojs/ojknockout', 'ojs/ojinputsearch', 'ojs/ojhighlighttext',
    , 'ojs/ojpopup', 'ojs/ojlistview', 'ojs/ojlistitemlayout', 'ojs/ojradioset', 'ojs/ojbutton',
    'ojs/ojtrain', 'ojs/ojlabel', 'ojs/ojinputtext', 'ojs/ojvalidationgroup',
    'ojs/ojlabelvalue', 'ojs/ojinputtext', 'ojs/ojselectsingle', 'ojs/ojformlayout', 'ojs/ojswitch', 'accountlist-details/loader', 'ojs/ojcore', 'ojs/ojrouter', 'ojs/ojmessages', 'ojs/ojcorerouter', 'ojs/ojmessages', 'ojs/ojprogress-circle'],

    function (ko, app, moduleUtils, accUtils, Context, $, AnimationUtils, ArrayDataProvider, employeeData, AsyncRegExpValidator) {

        function IncidentsViewModel(params) {

            var self = this;
            self.router = params.parentRouter;
            // Wait until header show up to resolve
            var resolve = Context.getPageContext().getBusyContext().addBusyState({ description: "wait for header" });
            // Header Config
            self.headerConfig = ko.observable({ 'view': [], 'viewModel': null });
            moduleUtils.createView({ 'viewPath': 'views/header.html' }).then(function (view) {
                self.headerConfig({ 'view': view, 'viewModel': app.getHeaderModel() });
                resolve();
            })

            // Below are a set of the ViewModel methods invoked by the oj-module component.
            // Please reference the oj-module jsDoc for additional information.

            /**
             * Optional ViewModel method invoked after the View is inserted into the
             * document DOM.  The application can put logic that requires the DOM being
             * attached here.
             * This method might be called multiple times - after the View is created
             * and inserted into the DOM and after the View is reconnected
             * after being disconnected.
             */
            self.connected = function () {
                accUtils.announce('Incidents page loaded.', 'assertive');
                document.title = "Incidents";
                // Implement further logic if needed
                this.value = ko.observable();
                this.rawValue = ko.observable();
                this.searchTerm = ko.observable();
                this.searchItemContext = ko.observable();
                this.previousSearchTerm = ko.observable();
                this.searchTimeStamp = ko.observable();
                var url = "http://demo6785834.mockable.io/accounts";
                var self = this;
                self.activityDataProvider = ko.observable();  //gets data for Activities list
                this.suggestionsDP = new ArrayDataProvider(JSON.parse(employeeData), {
                    keyAttributes: "OrganizationName",
                    textFilterAttributes: [],
                });
                monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];
                clearFilter = document.getElementById('clear-filter');
                clearFilter.style.display = "none";
                //clearFilter="none";
                // self.router = params.parentRouter;

                /*this.suggestionsDP = () => {
                   
                    $.getJSON(url).then(function (data) {
                      new ArrayDataProvider(JSON.parse(data), { keyAttributes: 'OrganizationName',textFilterAttributes: [] });
                    });
                    //this.selectedvaluelength = ko.observable("43");

                };*/
                //serach filter records
                this.handleValueAction = (event) => {
                    var detail = event.detail;
                    var eventTime = this._getCurrentTime();
                    this.searchTerm(detail.value);
                    $.getJSON(url).then(function (data) {
                        var activitiesArray3 = data.filter(element => element.OrganizationName == detail.value)
                        var result3 = JSON.stringify(activitiesArray3);
                        var obj3 = JSON.parse(result3, function (key, value) {
                            if (key == "LastVisit" || key == "NextVisit") {
                                var formateddate = monthShortNames[new Date(value).getMonth()] + ' ' + new Date(value).getDate() + '  ' + new Date(value).getFullYear();
                                return formateddate;
                            } else {
                                return value;
                            }
                        });
                        self.activityDataProvider(new ArrayDataProvider(obj3, { keyAttributes: 'SyncLocalId' }));
                    });
                    this.searchItemContext(this._trimItemContext(detail.itemContext));
                    this.previousSearchTerm(detail.previousValue);
                    this.searchTimeStamp(eventTime);
                };
                this._trimItemContext = (itemContext) => {
                    var searchItemContext = null;
                    if (itemContext) {
                        searchItemContext = {
                            key: itemContext.key,
                            data: itemContext.data,
                        };
                        if (itemContext.metadata) {
                            searchItemContext.metadata = {
                                key: itemContext.metadata.key,
                            };
                        }
                    }
                    return searchItemContext ? JSON.stringify(searchItemContext) : "";
                };
                this._getCurrentTime = () => {
                    var date = new Date();
                    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
                };
                onLoadAccountRecords = () => {
                    $.getJSON(url).then(function (data) {
                        var activitiesArray2 = data.filter(element => element.SalesProfileStatus)
                        var resultData = JSON.stringify(activitiesArray2);
                        var _resultobj = JSON.parse(resultData, function (key, value) {
                            if (key == "LastVisit" || key == "NextVisit") {
                                var formateddate_value = monthShortNames[new Date(value).getMonth()] + ' ' + new Date(value).getDate() + '  ' + new Date(value).getFullYear();
                                return formateddate_value;
                            } else {
                                return value;
                            }
                        });
                        self.activityDataProvider(new ArrayDataProvider(_resultobj, { keyAttributes: 'SyncLocalId' }));
                    });
                };
                onLoadAccountRecords();
                this.startAnimationListener = (event) => {
                    let ui = event.detail;
                    if (event.target.id !== "popup1") {
                        return;
                    }
                    if (ui.action === "open") {
                        event.preventDefault();
                        let options = { direction: "top" };
                        AnimationUtils.slideIn(ui.element, options).then(ui.endCallback);
                    }
                    else if (ui.action === "close") {
                        event.preventDefault();
                        ui.endCallback();
                    }
                };
                this.currentColor = ko.observable("");
                this.name = ko.observable('Adam Fripp');
                self.selectedvaluelength = ko.observable("");
                self.selectedvaluetype = ko.observable("Total");
                this.applyFilterValues = () => {
                    this.selectedvalue = ko.observable("");
                    selectedvalue = this.currentColor._latestValue;

                    $.getJSON(url).then(function (data) {
                        var activitiesArray1 = data.filter(element => element.SalesProfileStatus == selectedvalue)
                        var result = JSON.stringify(activitiesArray1);
                        var obj = JSON.parse(result, function (key, value) {
                            if (key == "LastVisit" || key == "NextVisit") {
                                var formateddate = monthShortNames[new Date(value).getMonth()] + ' ' + new Date(value).getDate() + '  ' + new Date(value).getFullYear();
                                return formateddate;
                            } else {
                                return value;
                            }
                        });
                        self.activityDataProvider(new ArrayDataProvider(obj, { keyAttributes: 'SyncLocalId' }));
                        cancelListener();
                        //this.selectedvaluelength('SATISH');
                        //  console.log(selectedvaluelength);
                        //this.selectedvaluelength = ko.observable("SATISH");
                        self.selectedvaluelength(activitiesArray1.length);
                        self.selectedvaluetype(self.currentColor._latestValue);


                    });
                    //this.selectedvaluelength = ko.observable("43");
                    clearFilter.style.display = "block";

                };
                this.setCurrentColorToNull = () => {
                    this.currentColor(null);
                    return true;
                };

                this.accountTypeOptions = [
                    { id: "blueopt", value: "INACTIVE", accounttype: "INACTIVE" },
                    { id: "greenopt", value: "ACTIVE", accounttype: "ACTIVE" },
                    { id: "redopt", value: "CANDIDATE", accounttype: "CANDIDATE" }
                ];
                this.colorOptions = [
                    { id: "blueopt", value: "Whole Sale", color: "Whole Sale" },
                    { id: "greenopt", value: "Whole Sale-Retail", color: "Whole Sale-Retail" },
                    { id: "redopt", value: "Retail", color: "Retail" },

                ];

                this.valueChangedEventData = ko.observable();
                this.valueActionEventData = ko.observable();
                this.valueActionTimestamp = ko.observable();
                this.selectVal = ko.observable("");
                this.browsers = [
                    { value: "IE", label: "Internet Explorer" },
                    { value: "FF", label: "Firefox" },
                    { value: "CH", label: "Chrome" },
                    { value: "OP", label: "Opera" },
                    { value: "SA", label: "Safari" },
                ];
                this.browsersDP = new ArrayDataProvider(this.browsers, {
                    keyAttributes: "value",
                });

                this.valueChangedLogMsg = ko.pureComputed(() => {
                    const data = this.valueChangedEventData();
                    if (data) {
                        return JSON.stringify(data);
                    }
                    return "";
                });
                this.valueActionLogMsg = ko.pureComputed(() => {
                    var data = this.valueActionEventData();
                    if (data) {
                        return JSON.stringify(data);
                    }
                    return "";
                });
                this.valueChangedHandler = (event) => {
                    this.valueChangedEventData(event.detail);
                };
                this.valueActionHandler = (event) => {
                    this.valueActionEventData(event.detail);
                    this.valueActionTimestamp("timestamp: " + this._getCurrentTime());
                };
                this._getCurrentTime = () => {
                    var date = new Date();
                    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
                };

                this.browsersDP2 = new ArrayDataProvider(this.browsers, {
                    keyAttributes: "value",
                });
                this.selectedStepValue = ko.observable("stp1");
                this.selectedStepLabel = ko.observable("Basic Information");
                this.selectedStepFormLabel = ko.observable("Name");
                this.selectedStepFormaddress = ko.observable("");
                this.phoneselectednumber = ko.observable("");

                this.name = ko.observable();
                this.email = ko.observable();
                this.telephoneNumber = ko.observable();
                this.isChecked = ko.observable(false);
                this.valueActionEventData = ko.observable();
                this.isFormReadonly = ko.observable(false);
                this.stepArray = ko.observableArray([
                    { label: "Basic Information", id: "stp1" },
                    { label: "Primary Address", id: "stp2" },
                    { label: "Primary Contact", id: "stp3" },
                ]);
                this.regExpValidator = new AsyncRegExpValidator({
                    pattern: "[a-zA-Z ,.'-]{1,}",
                    hint: "1 or more letters",
                    messageDetail: "You must enter at least 1 letter",
                });
                this.emailRegExpValidator = new AsyncRegExpValidator({
                    pattern: ".+@.+..+",
                    hint: "email format",
                    messageDetail: "Invalid email format",
                });
                //It is being called by the train to make sure the form is valid before moving on to the next step.
                this.validate = (event) => {
                    let nextStep = event.detail.toStep;
                    let previousStep = event.detail.fromStep;
                    var tracker = document.getElementById("tracker");
                    if (tracker == null) {
                        return;
                    }
                    var train = document.getElementById("train");
                    if (tracker.valid === "valid") {
                        //The previous step will have a confirmation message type icon
                        previousStep.messageType = "confirmation";
                        train.updateStep(previousStep.id, previousStep);
                        //Now the clicked step could be selected
                        this.selectedStepValue(nextStep.id);
                        return;
                    }
                    else {
                        //The ojBeforeSelect can be cancelled by calling event.preventDefault().
                        event.preventDefault();
                        //The previous step will have an error message type icon
                        previousStep.messageType = "error";
                        train.updateStep(previousStep.id, previousStep);
                        // show messages on all the components
                        // that have messages hidden.
                        setTimeout(function () {
                            tracker.showMessages();
                            tracker.focusOn("@firstInvalidShown");
                        }, 0);
                        return;
                    }
                };
                // Updating train label values
                this.updateLabelText = (event) => {
                    var train = document.getElementById("train");
                    let selectedStep = train.getStep(event.detail.value);
                    if (selectedStep != null) {
                        this.selectedStepLabel(selectedStep.label);
                    }
                    if (selectedStep != null && selectedStep.id == "stp2") {
                        this.selectedStepFormLabel("Address");
                        this.isFormReadonly(false);
                    }
                    else if (selectedStep != null && selectedStep.id == "stp1") {
                        this.selectedStepFormLabel("Please fill in your full name");
                        this.isFormReadonly(false);
                    }
                    else {
                        this.selectedStepFormLabel("");
                        this.isFormReadonly(true);
                    }
                };


                this.buttonDisplay = ko.observable("none");
                this.loadingText = ko.observable("Loading...");
                this.progressValue = ko.observable(0);
                //document.getElementById('progressCircle').style.display="none";
                //saved form data in localstorage        
                this.saveLocalStorage = (event) => {
                    var train = document.getElementById("train");
                    let finalStep = train.getStep("stp3");
                    //The final step will have a confirmation message type icon
                    if (finalStep != null) {
                        finalStep.messageType = "confirmation";
                        train.updateStep(finalStep.id, finalStep);
                    }
                    var accoutnDataObject = { 'name': this.name._latestValue, 'email': this.email._latestValue, 'phonenumber': this.telephoneNumber._latestValue, 'selectItem1': this.selectVal._latestValue, 'swithvalue': this.isChecked._latestValue };
                    localStorage.setItem('accoutnDataStoreObject', JSON.stringify(accoutnDataObject));
                    var retrievedObject = localStorage.getItem('accoutnDataStoreObject');
                    console.log('retrievedObject: ', JSON.parse(retrievedObject));
                    this.name = ko.observable();
                    this.email = ko.observable();
                    this.telephoneNumber = ko.observable();
                    //   document.getElementById('progressCircle').style.display="block";

                    //Toaster
                    /*const isoTimeNow = new Date().toISOString();
                     const isoTimeYesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
                     this.messages = [
                       
                         {
                             severity: "confirmation",
                             summary: "saved Successfully in localstorage",
                             timestamp: isoTimeYesterday,
                         },
                         {
                             severity: "info",
                             summary: "Info message summary no detail",
                         },
                     ];
                     this.messagesDataprovider = new ArrayDataProvider(this.messages);*/

                    const isoTimeNow = new Date().toISOString();
                    const isoTimeYesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
                    self.messages = [
                        {
                            severity: "error",
                            summary: "Error message summary",
                            detail: "Error message detail",
                            timestamp: isoTimeNow,
                        },
                        {
                            severity: "warning",
                            summary: "Warning message summary",
                            detail: "Warning message detail",
                        },
                        {
                            severity: "confirmation",
                            summary: "Confirmation message summary no detail",
                            timestamp: isoTimeYesterday,
                        },
                        {
                            severity: "info",
                            summary: "Info message summary no detail",
                        },
                        {
                            severity: "none",
                            summary: "Message summary no detail",
                        },
                    ];
                    //  alert("Data Saved Succesfully in local storage")
                    // messagesDataprovider = new ArrayDataProvider(self.messages);
                    // this.progressValue(0);
                    // this.buttonDisplay("none");
                    // this.loadingText("");
                    window.location.href = window.location.origin;
                };
                /*  this.progressValue.subscribe((newValue) => {
                      if (newValue === 100) {
                          let loadingRegion = document.getElementById("loadingRegion");
                         // loadingRegion.removeAttribute("aria-busy");
                        //  loadingRegion.removeAttribute("aria-describedby");
                          this.loadingText("Data Saved Successfully in Local Storage!");
                          this.buttonDisplay("inline-flex");
                         
                         
                         // document.getElementById('progressCircle').style.display="none";
                          //setTimeout(function(){
                              window.location.href = window.location.origin;
  
                         // },1000);
                      }
                  });
                  window.setInterval(() => {
                      {
                          this.progressValue(Math.min(this.progressValue() + 1, 100));
                      }
                  }, 30);*/
                // details page link
                openArrowListener = (event, content) => {
                    accountname = content.data.OrganizationName;
                    lastvisit = content.data.LastVisit;
                    nextvisit = content.data.NextVisit;

                    // oj.Router.rootInstance.go('/dashboard');
                    //  alert(event);
                    //this.router.rootInstance.go({ path: 'accountlist', params: { name: 'Account List' } })
                    //  router.go({path:'dashboard',params:{}})
                    //  router.go({path:'dashboard',params: { name: 'Dashboard' } })

                    // router.go({path: 'dashboard', params: {name: 'Dashboard'}}

                    //   self.router=oj.Router.rootInstance;
                    self.router.go({
                        path: 'accountlistdetails', params: {
                            "accountName": accountname,
                            "LastVisit": lastvisit,
                            "NextVisit": nextvisit,
                        }
                    });
                };
                clearfilterAction = (event) => {
                    clearFilter.style.display = "none";
                    window.location.href = window.location.origin;

                };
                openListener = (event) => {
                    let popup = document.getElementById("popup1");
                    popup.open("#btnGo");
                    clearFilter.style.display = "none";

                };
                cancelListener = (event) => {
                    let popup = document.getElementById("popup1");
                    popup.close();
                }
                openAddNewAccount = (event) => {
                    let popup = document.getElementById("popup2");
                    popup.open("#icon_button2");
                };
                cancelListenerNewAccount = (event) => {
                    let popup = document.getElementById("popup2");
                    popup.close();
                };
                importContact = (event) => {
                    //findContacts();
                    pickContacts();
                };

                function findContacts() {
                    var options = new ContactFindOptions();
                    options.filter = "";
                    options.multiple = true;
                    fields = ["displayName"];
                    navigator.contacts.find(fields, contactfindSuccess, contactfindError, options);

                    function contactfindSuccess(contacts) {
                        for (var i = 0; i < contacts.length; i++) {
                            console.log("Display Name = " + contacts[i].displayName);
                        }
                    }

                    function contactfindError(message) {
                        console.log('Failed because: ' + message);
                    }

                }



            };
            function pickContacts() {

                navigator.contacts.pickContact(function (contact) {
                    //alert('The following contact has been selected:' + JSON.stringify(contact));
                    selectedContact = JSON.parse(JSON.stringify(contact));

                    // alert("contacts: "+selectedContact);

                    alert("selected phone number: " + selectedContact.phoneNumbers[0].value);

                    //selectedStepFormaddress="ddd";

                    // this.phoneselectednumber = ko.observable('saaaaa');

                }, function (err) {
                    alert('Error: ' + err);
                    //this.phoneselectednumber = ko.observable('saaaaa');

                });
            };
            /**
             * Optional ViewModel method invoked after the View is disconnected from the DOM.
             */
            self.disconnected = function () {
                // Implement if needed
            };

            /**
             * Optional ViewModel method invoked after transition to the new View is complete.
             * That includes any possible animation between the old and the new View.
             */
            self.transitionCompleted = function () {
                // Implement if needed
            };
        }

        /*
         * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
         * return a constructor for the ViewModel so that the ViewModel is constructed
         * each time the view is displayed.
         */
        return IncidentsViewModel;
    }
);
