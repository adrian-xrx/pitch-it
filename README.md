# Installation
Recommended: Download a prebuild version from the release area
Unzip and navigate to the folder
Execute:
```
$ npm install
```
to install all dependencies
# Configuration
Change the config.js in server/asset/config.js to use your servers.
```javascript
socket: {
  host: '', // hostname of the backend websocket server
  port: -1 // port of the backend websocket server
},
stun: [] // array of stun configurations
turn: [] // array of turn configurations

// Example stun config:
{
  url: 'stun:my.stun.server:1234'
}

// Example turn config:
{
  url: 'turn:my.turn.server:1234'
}
```
# Run
Execute
```
$ npm start
```
to run the server application

# Development

## Build
Execute
```
$ npm run build
```
to build the software.

## Development Server 
To launch the development server you need a running server instance with
```
$ npm start
```
Then you can execute
```
$ npm run dev
```
to start the webpack dev server for development.
The application will be available at localhost:8080/webpack-dev-server

# License
BSD License
Copyright (c) 2016-present, the creators of Pitch It