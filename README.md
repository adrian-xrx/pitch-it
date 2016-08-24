# pitch it
pitch it is comunication tool based on webrtc
## Prerequesits
To run or build pitch it you need to have nodejs and npm installed.
## Installation
Recommended: Download a prebuild version from the release area
Unzip and navigate to the folder
```
$ npm install
```
Will install all dependencies (build and runtime dependencies)
## Configuration
### Server
Create a config.json file that can be passed as cmd arg
```javascript
{
  "port": 80,
  "https": {
    "port": 443,
    "certificate": "[cert]",
    "key": "[key]",
    "passphrase": "[passphase]" // optional
  }
}
```
If you don't specify the https property. The server will run without HTTPS-Encryption
### Client
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
## Run
```
$ npm start [config file]
```
Will run the server. The config file is the configuration for the server

## Development

### Build
```
$ npm run build
```
Will run the build. Afterwards the binaries are available in the dist/ folder

### Development Server 
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

## License
BSD License
Copyright (c) 2016, the creators of pitch it