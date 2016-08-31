/**
 * BSD-Licensed
 * @author J-Pi
 */

export default class Router {
  constructor (routes) {
    window.onhashchange = this._onRouteChange.bind(this);
    this._routes = routes;
    window.onhashchange();
  }
  
  _onRouteChange() {
    let hash = location.hash.substr(1);
    let route = this._routes[hash];
    if (!route || !hash) {
      route = this._routes['default'];
    }
    
    if (route.onEnter) {
      route.onEnter(); 
    }
  }
  
  addRoute(routeName, onEnter) {
    if (!this._routes[routeName]) {
      this._routes[routeName] = {
        onEnter: onEnter
      };
    } else {
      throw new Error('Route ' + routeName + ' already exists');
    }
  }
}