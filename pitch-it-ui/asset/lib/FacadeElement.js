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

export default class FacadeElement {

  constructor(id, classes, content, tooltip) {
    this._id = id || '';
    this._classes = classes || [];
    this._content = content || '';
    this._tooltip = tooltip || '';
    this._children = [];
    this._events = {};
    this._compiled = undefined;
  }

  appendChild(child) {
    if (child instanceof HTMLElement || child instanceof FacadeElement) {
      this._children.push(child);
    } else {
      console.warn('Cannot append child', child);
    }
  }

  addClass(className) {
    if (className && this._classes.indexOf(className) === -1) {
      this._classes.push(className);
      if (this._compiled) {
        this._compiled.classList.add(className);        
      }
    }
  }

  removeClass(className) {
    let index = this._classes.indexOf(className)
    if (className && index !== -1) {
      this._classes.splice(index, 1);
      if (this._compiled) {
        this._compiled.classList.remove(className);
      }
    }
  }

  hasClass(className) {
    return (this._classes.indexOf(className) !== -1);
  }

  on(event, handle) {
    if (event && !this._events[event]) {
      this._events[event] = handle;
    } else {
      console.warn('Try to overwrite event. Cancel');
    }
  }

  clear() {
    this._children = [];
    if (this._compiled) {
      let firstChild = this._compiled.firstChild;
      while (firstChild) {
        firstChild.remove();
        firstChild = this._compiled.firstChild;
      }
    }
  }

  getValue() {
    return this._content;
  }

  update(content, tooltip) {
    if (content) {
      this._content = content;
      if (this._compiled) {
        this._compiled.textContent = this._content;
      }
    }
    if (tooltip) {
      this._tooltip = tooltip;
      if (this._compiled) {
        this._compiled.title = this._tooltip;
      }
    }
  }

  _attachClasses(elm) {
    this._classes.forEach((className) => {
      if (className) {
        elm.classList.add(className);
      }
    });
  }

  _attachEvents(elm) {
    let events = Object.keys(this._events);
    events.forEach((e) => {
      if (e && this._events[e]) {
        elm.addEventListener(e, this._events[e]);        
      }
    });
  }

  _renderChild(child) {
    if (child instanceof FacadeElement) {
      return child.render();
    } else {
      return child;
    }
  }

  _renderChildren() {
    this._children.forEach((child) => {
      this._compiled.appendChild(this._renderChild(child));
    });
  }

  render() {
    this._compiled = document.createElement('div');
    this._attachClasses(this._compiled);
    this._attachEvents(this._compiled);
    if (this._id && this._id.length > 0) {
      this._compiled.id = this._id;      
    }
    if (this._content && this._compiled && this._content.length > 0) {
      this._compiled.textContent = this._content;      
    }
    if (this._tooltip && this._compiled && this._tooltip.length > 0) {
      this._compiled.title = this._tooltip;
    }
    this._renderChildren();
    return this._compiled;
  }
}