/**
 *    Copyright 2016, the creators of pitch-it
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * be found in the LICENSE file in the root directory
 * 
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