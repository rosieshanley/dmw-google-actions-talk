### Table of Contents

[Project Overview](https://github.com/rosieshanley/dmw-google-actions-talk#project-overview)

[What We'll Use](https://github.com/rosieshanley/dmw-google-actions-talk#what-well-use)

[Instructions](https://github.com/rosieshanley/dmw-google-actions-talk#instructions)

1. [Create a free trial account for the Google Cloud Platform](https://github.com/rosieshanley/dmw-google-actions-talk#create-a-free-trial-account-for-the-google-cloud-platform)
2. [Enable cloud billing for your project](https://github.com/rosieshanley/dmw-google-actions-talk#enable-cloud-billing-for-your-project)
3. [Create an Actions project](https://github.com/rosieshanley/dmw-google-actions-talk#create-an-actions-project)
4. [Create a Dialogflow agent](https://github.com/rosieshanley/dmw-google-actions-talk#create-a-dialogflow-agent)
5. [Import the Dialogflow project files](https://github.com/rosieshanley/dmw-google-actions-talk#import-the-dialogflow-project-files)
6. [Test your Action in the Actions console simulator](https://github.com/rosieshanley/dmw-google-actions-talk#test-your-action-in-the-actions-console-simulator)
7. [Set up your local development environment to develop actions locally](https://github.com/rosieshanley/dmw-google-actions-talk#set-up-your-local-development-environment-to-develop-actions-locally)
8. [Generate an access token for the Genius APIs](https://github.com/rosieshanley/dmw-google-actions-talk#generate-an-access-token-for-the-genius-apis)
9. [Prepare and deploy locally-developed webhook using the Firebase Functions CLI](https://github.com/rosieshanley/dmw-google-actions-talk#prepare-and-deploy-locally-developed-webhook-using-the-firebase-functions-cli)
10. [Retreive your webhook URL from the firebase console](https://github.com/rosieshanley/dmw-google-actions-talk#retreive-your-webhook-url-from-the-firebase-console)
11. [Provide Dialogflow with the URL to your firebase function](https://github.com/rosieshanley/dmw-google-actions-talk#provide-dialogflow-with-the-url-to-your-firebase-function)
12. [Test your newly configured Dialogflow fulfillment webhook](https://github.com/rosieshanley/dmw-google-actions-talk#test-your-newly-configured-dialogflow-fulfillment-webhook)

[Additional Resources](https://github.com/rosieshanley/dmw-google-actions-talk#additional-resources)

## Project Overview

For this project, we create an Action for the Google Assistant that identifies songs based on their lyrics.

## What We'll Use

### Free-Tier GCP Account

For this tutorial, you'll need to set up a **GCP Free Trial** account. To create your account, click [here](https://cloud.google.com/free/docs/gcp-free-tier) and then click the button in the top right hand corner that says **"Get started for free"**.

A GCP Free Trial account is a billing account that does not get charged. It requires a credit card for verification, but it will not charge the card until the account is manually upgraded to a paying account. The free trial includes a \$300 credit that can last 12 months. It's a great option if you want to get started building cloud projects without worrying about accidentally running up a steep bill.

When you log into your account, you'll see a banner indicating the credit balance and number of days left in your free trial. Click the **Dismiss** button to hide this banner.

**Note about GCP Projects:** Creating your account also automatically generates a project. Projects are the primary unit of organization in GCP. (Similar to AWS accounts.) Projects own resources, and every resource is owner by a **single** project. Resources can be shared with other projects, but only one project owns and is billed for that resource. A single GCP account can have multiple projects which can be grouped and controlled in a hierarchy.

### Actions on Google

Actions on Google lets you create Actions to extend the functionality of the Google Assistant.

###### Key Terms

**Action:** entry point into an interaction that you build for the Assistant.
**Intent:** An underlying goal or task the user wants to do.
**Fulfillment:** A service, app, feed, conversation, or other logic that handles an intent and carries out the corresponding Action.

[Learn More](https://actions.google.com)

### Dialogflow

We'll use Dialogflow to handle user input from the Google Assistant and send requests to our fulfillment webhook.
It can also be used to extract key words and phrases from the user's input. (e.g. lyricpreface)

###### Key Terms

**Agent:** A Dialogflow agent handles conversations with your end-users. It is a natural language understanding module that understands the nuances of human language. Dialogflow translates end-user text or audio during a conversation to structured data that your apps and services can understand. You design and build a Dialogflow agent to handle the types of conversations required for your system.
**Parameters:** Represents values that you want to extract from the user's phrases, similar to fields in a form. (e.g. the time and date fields for a scheduling intent.)
**Intent:** An object that maps user utterances to your agent's response. You can specify a static response directly within the intent or generate a dynamic response with a webhook.
**Fulfillment Webhook:** Code that responds to an HTTP request in a Dialogflow-specific messaging format; it contains the logic for handling intents and dynamically constructing responses to send to the user. If your Action interacts with external APIs, requires complex logic, or needs to read and store to a database, it will need fulfillment.
**Entities (Dialogflow):** Represents a category of things. (e.g. colors, dates, or in our case, lyric prefaces) Dialogflow uses entities for extracting parameter values from natural language inputs.

[Learn More](https://cloud.google.com/dialogflow/)

### Firebase Cloud Functions

With Firebase Cloud Functions, we can host our Action's fulfillment as an HTTP web service. This makes deployment and maintenance quick and easy. We'll use the Firebase CLI tools to deploy your webhook to Google Cloud Functions.

[Learn More](https://firebase.google.com/docs/functions)

## Instructions

### Create a free trial account for the Google Cloud Platform

To create your account, click [here](https://cloud.google.com/free/docs/gcp-free-tier) and then click the button in the top right hand corner that says **"Get started for free"**.

### Create an Actions project

Log into the [Actions console](https://console.actions.google.com) and select **New Project**, and accept the terms.

Select a project name for your action. You can either use the default project created when we created our Free Trial account, or create a new project. and click **Create Project**. (This may take a couple minutes.)

On the welcome screen, select the **Conversational** category.

Under the list of welcome options, select **Build Your Action** > **Add Actions**.

Select **Add Your First Action** > **Custom Intent** > **Build**.

You will be redirected to the Dialogflow console.

### Enable cloud billing for your project

If you created a new project for your action in the last step, you'll need to enable cloud billing for it. This is because we'll be hitting an external API from our cloud function, which is not available with a Free Tier only project.

1. Open the [cloud console](https://console.cloud.google.com/).
2. Select **Billing** from the lefthand navigation menu.
3. Click **"Link a billing account"** > **Set Account**. (There should only be one billing account available.)

### Create a Dialogflow agent

Log into the [Dialogflow console](https://console.dialogflow.com) using the same google account you used to create your action.

Create a new agent.
(There should be a message in the "Google Project" section indicating that your agent will be linked to the action you just created.)

When your agent finishes initializing, you should be on the **Intents** tab of the Dialogflow console.

### Import the Dialogflow project files

In the lefthand menu, select the **gear icon** on the righthand side of the dropdown of agents.

In the **Export and Import** tab, select the **Import from Zip** option.

Click **Select File** and add the `dialogflow-agent.zip` file located in the root directory of this repository.

Type **IMPORT** into the provided input and click the import button.

This adds our action's **Intents** and **Entities** to the Dialogflow agent, located under their respective tabs in the lefthand menu.

### Test your Action in the Actions console simulator

In the **Integrations** section, select **Integration Settings** on the Google Assistant card.

Click the **Test** button to open your action in the Actions console simulator.

Test sending messages to your action by typing "Talk to my test app" in the righthand input.

The action returns one of the expected responses to the [Default Welcome Intent](https://cloud.google.com/dialogflow/docs/intents-default).

Every Actions project must have a welcome intent to serve as an entry point for beginning the conversation. The welcome intent is triggered when users explicitly invoke an Action by saying its name.

In this case, our welcome intent asks the user whether there's a specific song they're thinking of.

We handle the user response using [follow-up intents](https://cloud.google.com/dialogflow/docs/contexts-follow-up-intents).

Google provides a selection of predefined follow-up intents for common replies. (e.g. yes, no, cancel, more) In this case, we configure follow-up intents for **Yes** and **No** responses. Replying **Yes** prompts the user to provide song lyrics. Replying **No** ends the conversation. Any other responses trigger the [Default Fallback Intent](https://cloud.google.com/dialogflow/docs/intents-default).

When we reply to the prompt for song lyrics, we receive the follow error response:

> "My test app isn't responding right now. Try again soon."

This is because the intent we triggered, **"search lyrics"**, expects a Dialogflow fulfillment webhook to be configured. We'll set this up next.

### Set up your local development environment to develop actions locally

###### Dependencies

- A terminal with NodeJS, npm, and git installed.
- Text editor / IDE of your choice.

1. Install or upgrade the firebase CLI.

```shell
npm -g install firebase-tools
```

Confirm that CLI is installed correctly at version 3.5.0 or higher.

```shell
firebase --version
```

2. Authorize the Firebase CLI.

```shell
firebase login
```

3. Set your action as the active project.
   To find your project ID, navigate to the meatball menu in the top right corner of the Actions console and select **Project Settings**.

```shell
firebase use --project <project-ID>
```

### Generate an access token for the Genius APIs

1. Create an account with [Genius](https://genius.com/signup).
2. Select [**New API Client**](https://genius.com/api-clients).
   Note: you must provide an App Website URL but we will not be using it for this project. You can put any URL you’d like. I used the URL to my personal website.
3. Click **generate an access token** and copy it to your clipboard.

### Prepare and deploy locally-developed webhook using the Firebase Functions CLI

1. Add your genius API key to your cloud function's configuration

```shell
firebase functions:config:set geniusapi.key=<genius-API-key> --project <project-ID>
```

2. Install the project dependencies.

```shell
npm install
```

3. Deploy the webhook to Firebase.

```shell
firebase deploy --project <project-name>
```

### Retreive your webhook URL from the firebase console

1. Open the [firebase console](https://console.firebase.google.com/).
2. Select your Actions project.
3. Navigate to Develop > Functions on the lefthand menu.
4. Under the Dashboard tab, you should see a function named "dialogflowFirebaseFulfillment" with a URL. Copy the URL listed in the trigger column for this function.

### Provide Dialogflow with the URL to your firebase function

1. Open the [Dialogflow console](https://console.dialogflow.com)
2. Select **Fulfillment** on the left navigation.
3. Enable Webhook.
4. Paste the URL you copied from the Firebase dashboard.
5. Click the Save button.

### Test your newly configured Dialogflow fulfillment webhook

1. Return to the Actions console simulator
   // TODO: finish this

## Additional Resources

Looking for more tutorials working with GCP? Check out Google's [codelab offerings](https://codelabs.developers.google.com/)
