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
    },
    "client" {
      "socket": [{
        "host": "[host]",
        "port": [port]
      }],
      "tls": true|false, // will connect via wss or wss
      "stun": [], // stun server configurations
      "turn": [] // turn server configurations
    }
  }
  "server": {
    "port": [http port],
    "tls": {
      "certificate": "[cert]",
      "key": "[key]",
      "passphrase": "[passphase]" // optional
    }
  }
}
```
If you don't specify the https property. The server will run without HTTPS-Encryption. 
you can use one config for both the asset server and the pitch it. backend server using the "assetServer" and "server" property
## Run
```
$ npm run asset [config file]
```
Will run the asset server
```
$ npm run backend [config file]
```
Will run the backend server
## Development

### Execute the Tests
Coming soon...

### Build
```
$ npm run build
```
Will run the build. Afterwards the binaries are available in the dist/ folder

### Development Server 
Coming soon...

## Contributing
Take a look at the [contribution guide](CONTRIBUTING.md)

## License
See [LICENSE file](LICENSE)