# hubot-stride
[Hubot](https://hubot.github.com/) adapter for [Atlassian Stride](https://www.stride.com/)

[![npm (scoped)](https://img.shields.io/npm/v/hubot-stride.svg?maxAge=2592000)](https://www.npmjs.com/package/hubot-stride)
[![Build Status](https://travis-ci.org/atlassian/hubot-stride.svg?branch=master)](https://travis-ci.org/atlassian/hubot-stride)
[![codecov](https://codecov.io/gh/atlassian/hubot-stride/branch/master/graph/badge.svg)](https://codecov.io/gh/atlassian/hubot-stride)
## Prerequisites
You need to install:

* [node.js >= 8.0.0](https://nodejs.org/en/) 
* [ngrok](https://ngrok.com/) 
* [Yeoman](http://yeoman.io/) 
* [Hubot generator](https://github.com/hubotio/generator-hubot):
```
npm install -g yo generator-hubot
```
### Generate the Hubot project
```
mkdir myhubot
cd myhubot
yo hubot --adapter="stride"
```
### Create a Stride app

Next, [create a Stride app](https://developer.atlassian.com/apps/create) in developer.atlassian.com 

* Give your new app a name in the App name field.
* If desired, add a short description in the Description field.
* Click **Create**; you'll be directed to your app's dashboard page.
* Click **Enable API** for the **Stride API**.
* Click **Add** for the **Manage conversation** scope
* Click **Enable API** for the **User API**
* In the **Enabled APIs** tab, make a note of the client ID and the client secret.
* In the **App Features** tab, enable Bot account and make note of the **bot mention name**

### Configure the Hubot adapter

You will need to tell adapter its name and credentials:
```
export HUBOT_STRIDE_CLIENT_ID=<Stride client id>
export HUBOT_STRIDE_CLIENT_SECRET=<Stride client secret>
export HUBOT_ALIAS="bot mention name"
```

**Make sure HUBOT_NAME matches the bot mention name for the Stride app**, 
otherwise mentioning the bot in Stride won't work.

### Start ngrok

```
//start ngrok and leave running
ngrok http 8000
```

Copy the URL provided by ngrok {ngrokURL}. It should look similar to https://740a1ad5.ngrok.io.

### Start the bot 
```
./bin/hubot --adapter stride
```
To verify if your Stride app works correctly, load the following URL in your browser:

```
http://localhost:8000/descriptor // descriptor.json should load in browser 
```

### Update the Stride app descriptor in Stride 

* Navigate to your [My Apps](https://developer.atlassian.com/apps) page.
* Click to open the app and then click the **Install** tab.
* Enter your app descriptor URL, {ngrokURL}/descriptor, in the **Descriptor URL** field. The URL you enter should look similar to https://740a1ad5.ngrok.io/descriptor.
* Click **Refresh**. When the app descriptor is installed you will see a **The descriptor has been updated successfully!** message displayed.


### Install the app in Stride 

Your app is created and configured, and your app descriptor is linked. Now, you need to add the app to a conversation:

* In your app dashboard, in the **Install** tab, click **Copy** for the Installation URL.
* Open Stride.
* Open the conversation in which you’d like to install the app.
* Click the **Apps** icon to open the Apps sidebar, and then click the + button to open the Atlassian Marketplace in Stride.
* Click **Connect your app** in the **Connect your own app** box, and then select the **Installation URL** tab.
* Paste in the **Installation URL** and click **Add to room**.
* In a few seconds, a new card for your installed app and bot should appear in the sidebar and the app should send a message to the conversation.

For subsequent installations, users just have to mention the bot in any room.

## Contributing
If you wish to contribute to this project, you first need to clone this repository. Installing dependencies:
```
npm i
npm link
npm link hubot-stride
```
Now you need to perform all the steps from the previous sections except that you do not need to generate a project.

To run you bot, instead of using `./bin/hubot --adapter stride` you should use:
```
npm start
```
To run API tests:
```
npm test
```