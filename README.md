pitch it.
========
pitch it. is communication tool based on webrtc

## Prerequesits
To run or build pitch it. you need to have nodejs and npm installed.
## Installation
Recommended: Download a prebuild version from the release area  
Unzip and navigate to the folder
```
$ npm install
```
Will install all dependencies (build and runtime dependencies)
You need to execute this for both the asset server and the pitch it. backend server
## Configuration
### Server
Create a config.json file that can be passed as cmd arg
```javascript
{
  "logLevel": [DEBUG|INFO|WARN|ERROR], // define one of the given log levels
  "assetServer": {
    "port": [http port],
    "https": {
      "port": [https port],
      "certificate": "[cert]",
      "key": "[key]",
      "passphrase": "[passphase]" // optional
    }
  }
  "server": {
    "port": [http port]
  }
}
```
If you don't specify the https property. The server will run without HTTPS-Encryption. 
you can use one config for both the asset server and the pitch it. backend server using the "assetServer" and "server" property
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
Will run the server depending in which directory you are. The config file is the configuration for the server

## Development

### Execute the Tests
```
$ npm test
```
Will run the tests with mocha

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

## Contributing
Take a look at the [contribution guide](CONTRIBUTING.md)

## License
See [LICENSE file](LICENSE)