# FloodGuardian

The FloodGuardian project aims to develop a mobile app to assist potential victims of floods worldwide. It is the result of a UCL BSc. Computer Science student's dissertation and is in collaboration with IBM.

## Setup
To run the app on your local machine, your machine must have installed:  
1. [Android Studio](https://developer.android.com/studio)
2. [Docker](https://www.docker.com/)  
3. [Docker Compose](https://docs.docker.com/compose/install/)

In Android Studio, create an Android Virtual Device (instructions [here](https://developer.android.com/studio/run/managing-avds)). The settings used during testing are:  

    CPU/ABI: Google Play Intel Atom (x86)

    Target: google_apis_playstore [Google Play] (API level 29)

    Skin: pixel_2

For the purposes of this guide, the AVD name will be assumed to be named _myAVD_.

## Running the app
### Starting the server
1. Navigate to the `flood-guardian-server/` folder in your terminal  
2. Build the docker image and start the container (ie the server) by running `docker-compose up --build`


### Running the React Native frontend
1. In Android Studio, launch _myAVD_
2. Set the AVD's location to anywhere in the United Kingdom or Jakarta:   
    1. On the _myAVD_ window, on the right pane, click on _More_ (the three dots at the bottom of the pane)  
    2. Under _Location_, search for "Hull, UK"
    3. Click the _Set Location_ button at the bottom right
3. In a new terminal, navigate to the `flood-guardian-mobile-app/` folder
4. Run `npm install`
5. Run `npm run all` (this is a script defined in `flood-guardian-mobile-app/package.json`)      
    The app should now be running in _myAVD_. If _myAVD_ does not display the FloodGuardian app, reload _myAVD_ by hitting **R** + **R** on your keyboard
6. On the FloodGuardian app, tap _Tap to set location_
7. Tap _My current location_
8. Accept location permissions
9. Tap _Close_

You can now navigate the FloodGuardian app. Scroll on the forecasts to view future dates, tap on the dates to view more information, or interact with the chatbot!

## Stopping the app
### Stopping the server
1. Navigate to the `flood-guardian-server/` folder in your terminal  
2. Run `docker-compose down`

### Stopping the React Native frontend
1. In the terminal used to run the frontend, hit **Ctrl** + **C**

