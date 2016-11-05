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

import FacadeView from './FacadeView';
import CookieApi from './CookieApi';

export default class FacadeRouter {
  constructor (routes, authApi) {
    window.onhashchange = this._onRouteChange.bind(this);
    this._routes = routes;
    this._authApi = authApi;
    window.onhashchange();
  }
  
  _onRouteChange() {
    let hash = location.hash.substr(1);
    let route = this._routes[hash];
    if (!route || !hash) {
      route = this._routes['default'];
    }

    if (!route.authentication || this._authApi.isAuthenticated()) {
      if (route.view) {
        if (route.view instanceof FacadeView) {
          if (route.view.init) {
            route.view.init();
          }
          route.view.render();
        } else {
          throw new Error('View is not a FacadeView');
        }
      }

      if (route.onEnter) {
        route.onEnter();
      }
    } else {
      location.hash = "";
    }
  }
  
  addRoute(routeName, view, onEnter) {
    if (!this._routes[routeName]) {
      this._routes[routeName] = {
        view: view,
        onEnter: onEnter
      };
    } else {
      throw new Error('Route ' + routeName + ' already exists');
    }
  }
}