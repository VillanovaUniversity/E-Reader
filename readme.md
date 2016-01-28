E-Reader (Based on the Augustine's Confessions app)
==========
> This is the core project for Villanova's E-Reader platform. It is licensed under a modified MIT license (see LICENSE.txt). 

## Configuring your Development Environment ##

*Note:* Mac recommended; Cordova cannot be used to build iOS apps on Windows.

1. Install Node from [here](https://nodejs.org/en/download/)
2. Install Git from [here](https://git-scm.com/) (if not already installed). Ensure to add to system path.
3. Install Bower: `npm install -g bower` (add `sudo` for mac)
4. Install Cordova: `npm install -g cordova` 
5. [Optional] Install Ionic (for splash screen and icon generation): `npm install -g ionic`
6. Install Grunt (for some build task automation): `npm install -g grunt`
7. Clone project from repository
8. Open command line to project directory
9. Install project-specific node dependencies: `npm install`
10. Install bower dependencies: `bower install`
11. [Mac Only] Prepare the native app project: `cordova prepare` (unnecessary for simply running in web browser)

## Running the Project ##

It's usually sufficient to test changes in a Webkit browser (e.g. Chrome) and periodically test changes on the device.

### Running in a Browser ###

To run in a browser, you will need to host the `www` folder on a local server. One easy way to do this is via Brackets: 

1. Install Brackets (without Extract) from [here](http://brackets.io/).
2. Open the Confessions project directory.
3. Expand the `www` folder and select the index.html file.
4. Click the lightning bolt symbol in the upper right hand corner of Brackets to start the live preview. The live preview will attempt to update whenever the project code changes. (This appears glitchy, so you may want to open the same URL in another tab.)
5. Refresh the tab whenever you've modified the source code in the `www` directory.

Remember to test periodically on all destination platforms. 

In the future, the "web" platform may eliminate the need to set up a local server or utilize Brackets.

### Testing on a Device ###

`cordova run <platform>` 

(Platforms are `android`, `ios`, or `browser`)

## Deploying to the App Stores ##

** Bump version number ** before building. 

### iOS ###
1. Run `cordova build ios`
2. Open the Xcode project placed in the iOS platform folder.
3. Follow usual steps to build and upload an iOS app. (Generally: select the "generic iOS device", build an archive, upload the archive to the store.)

### Android ###
1. Add the Confessions Keystore to the root project folder. 
2. Run `grunt buildAndroidProd`
3. Copy generated signed APK from root dir and upload to Google Play Developer Console.

Alternatively, you can use Android Studio to generate the signed APK.

### Web ###
1. Connect to WebDAV site: `https://webdavsites.villanova.edu/theconfessions` using a client like Cyberduck.
2. Delete server `www` folder and `package.json`.
3. Copy project `www` dir and `package.json` to server root.

## Development Tips and Best Practices ##

Cordova has access to many plugins. Most are hosted on Github, and will indicate how to install them (typically `cordova add <plugin name>`). 

**Please remember to save all plugins you add** using the `--save` argument.