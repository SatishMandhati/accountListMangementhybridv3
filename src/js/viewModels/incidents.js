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
 
define(['knockout', 'appController','ojs/ojmodule-element-utils','accUtils', 'ojs/ojcontext', 'jquery', 'ojs/ojanimation', 'ojs/ojarraydataprovider', 'text!../datacontent/data.json', 'ojs/ojasyncvalidator-regexp', 'ojs/ojknockout', 'ojs/ojinputsearch', 'ojs/ojhighlighttext',
    , 'ojs/ojpopup', 'ojs/ojlistview', 'ojs/ojlistitemlayout', 'ojs/ojradioset', 'ojs/ojbutton',
    'ojs/ojtrain', 'ojs/ojlabel', 'ojs/ojinputtext', 'ojs/ojvalidationgroup',
    'ojs/ojlabelvalue', 'ojs/ojinputtext', 'ojs/ojselectsingle', 'ojs/ojformlayout', 'ojs/ojswitch', 'accountlist-details/loader', 'ojs/ojcore', 'ojs/ojrouter'],

  function (ko,app,moduleUtils,accUtils,Context,$,AnimationUtils, ArrayDataProvider, employeeData, AsyncRegExpValidator) {

    function IncidentsViewModel() {
      var self = this;

      // Wait until header show up to resolve
      var resolve = Context.getPageContext().getBusyContext().addBusyState({description: "wait for header"});
      // Header Config
      self.headerConfig = ko.observable({'view':[], 'viewModel':null});
      moduleUtils.createView({'viewPath':'views/header.html'}).then(function(view) {
        self.headerConfig({'view':view, 'viewModel': app.getHeaderModel()});
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
      self.connected = function() {
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
               // self.router = params.parentRouter;

                /*this.suggestionsDP = () => {
                   
                    $.getJSON(url).then(function (data) {
                      new ArrayDataProvider(JSON.parse(data), { keyAttributes: 'OrganizationName',textFilterAttributes: [] });
                    });
                    //this.selectedvaluelength = ko.observable("43");

                };*/
                this.handleValueAction = (event) => {
                    var detail = event.detail;
                    var eventTime = this._getCurrentTime();
                    this.searchTerm(detail.value);
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


                /*  $.getJSON(url).then(function(data) {
                    var activitiesArray = data;
          
                    /*$.each(activitiesArray.NextVisit, function (r) {
                      this.NextVisit = new Date(this.NextVisit);
                  });
                    console.log(activitiesArray);
                    self.activityDataProvider(new ArrayDataProvider(activitiesArray, { keyAttributes: 'SyncLocalId'}));
                  });*/

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
                self.selectedvaluelength = ko.observable("0");
                this.applyFilterValues = () => {
                    this.selectedvalue = ko.observable("");
                    selectedvalue = this.currentColor._latestValue;
                    $.getJSON(url).then(function (data) {
                        monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                        ];
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


                    });
                    //this.selectedvaluelength = ko.observable("43");

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
                this.saveLocalStorage = (event) => {
                    var train = document.getElementById("train");
                    let finalStep = train.getStep("stp3");
                    //The final step will have a confirmation message type icon
                    if (finalStep != null) {
                        finalStep.messageType = "confirmation";
                        train.updateStep(finalStep.id, finalStep);
                    }
                    var accoutnDataObject = { 'name': this.name._latestValue, 'email': this.email._latestValue, 'phonenumber': this.telephoneNumber._latestValue,'selectItem1':this.selectVal._latestValue,'swithvalue':this.isChecked._latestValue };
                    localStorage.setItem('accoutnDataStoreObject', JSON.stringify(accoutnDataObject));
                    var retrievedObject = localStorage.getItem('accoutnDataStoreObject');
                    console.log('retrievedObject: ', JSON.parse(retrievedObject));
                    this.name = ko.observable();
                    this.email = ko.observable();
                    this.telephoneNumber = ko.observable();
                    window.location.href = window.location.origin;
                };

                openArrowListener = (event) => {
                    // oj.Router.rootInstance.go('/dashboard');
                  //  alert(event);
                  this.router.rootInstance.go({ path: 'accountlist', params: { name: 'Account List' } })
                  //  router.go({path:'dashboard',params:{}})

                //  router.go({path:'dashboard',params: { name: 'Dashboard' } })

                };
                openListener = (event) => {
                    let popup = document.getElementById("popup1");
                    popup.open("#btnGo");
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
                }
            

      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function() {
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
