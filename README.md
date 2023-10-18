# DHIS2 - User Support App

## Introduction

The level of effort being used in supporting data managers requests at sub-national levels for a country like Tanzania is huge and hence would require support team that attend users feedback to be large enough. Also when it comes to supporting Ministry of Health Programmes like RCH, HIV, MALARIA, eIDSR e.t.c, its a headache and may require each program to have an expert on DHIS2 but also given access to DHIS2 maintenance app, which is impractical it some point.

Form/Dataset assignment and un-assignment requests through built-in DHIS2 feedback messaging app has been a way so far used, but with User Support, large part of the load to work on a number of requests is moved down to sub-national level users. In the process, sub-national level user can request form/dataset and the central team at national level can just approve or reject it with few clicks.

Validation rules have also been an issue since they are Ministry programme specific and would like specific programme lets say RCH to propose validation rules and central team just approve.

## Features

1. Support to request form/dataset assignment or un-assignment for multiple forms.
2. Support to request form/dataset assignment or un-assignment for multiple organisation units (Health facilities)
3. Support to accommodate the request via feedback messages. Whet the request is sent (stored on datastore), it is also sent to feedaback recipient via messages. It is also true when the request is approved.
4. Feedback recipitient group and other users see different things, while the former see requests from user, the later see UI for sending requests.
5. Attended requests are deleted and the remained backup is the messages thread.
6. Central team can reject request with a reason.
7. Support user to view rejected requests and reason provided.
8. Central team is alerted for requests that contains too much information (third eye may be required). A configuration for this is put on datastore.
9. User can edit a request, provided not approved.

## Configurations

A. Namespace
The user support app, set up dhis2-user-support namespace upon installing. One can change some configurations through the configuration key.

B. Feedback recipient group
The group intended to attend the request is the feedback recipient group. To configure this Open DHIS2 System Settings app -> General -> Feedback Recipients, then choose your group.

## Prerequisites

1. [NodeJs (10 or higher)](https://nodejs.org)
2. npm (6.4.0 or higher), can be installed by running `apt install npm`
3. git, can be installed by running `apt install git`

## Setup

Clone repository

```bash
 git clone git@github.com:udsm-dhis2-lab/user-support-app.git
```

Navigate to application root folder

```bash
cd user-support-app
```

Install all required dependencies for the app

```bash
npm install
```

## Development server

To start development server

`npm start`

Navigate to [http://localhost:4200](http://localhost:4200).

This command will require proxy-config.json file available in the root of your source code, usually this file has this format

```json
{
  "/api": {
    "target": "https://play.dhis2.org/2.36.11/",
    "secure": "false",
    "auth": "admin:district",
    "changeOrigin": "true"
  },
  "/": {
    "target": "https://play.dhis2.org/2.36.11/",
    "secure": "false",
    "auth": "admin:district",
    "changeOrigin": "true"
  }
}
```

We have provided `proxy-config.example.json` file as an example, make a copy and rename to `proxy-config.json`

## Index DB Setup

This app support index DB as based on [dexie library](https://dexie.org/). In order to initiatiate index db then you have to passed index db configuration in forRoot of core module, so in app.module.ts

```ts
........
@NgModule({
  declarations: [AppComponent, ...fromPages.pages],
  imports: [
   ..........
    CoreModule.forRoot({
      namespace: 'iapps',
      version: 1,
      models: {
        users: 'id',
        dataElement: 'id',
        .......
      }
    })
    .......
    ]
    ......
    })
```

where in the models, for example user will be a table "user" and 'id' will be a keyIndex for the table

## Build

To build the project run

`npm run build`

The build artifacts will be stored in the `dist/`, this will include a zip file ready for deploying to any DHIS2 instance.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
