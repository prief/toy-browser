// createElement.js

import { enableGesture } from "./gesture";

export function create(Classname, attributes, ...children) {
  let o;
  if (typeof Classname == "string") {
    o = new Wrapper(Classname);
  } else {
    o = new Classname();
  }
  for (var a in attributes) {
    //  o[a] = attributes[a];   // property 和 attribute 融合成一体联动
    o.setAttribute(a, attributes[a]); // property 和 attribute 分离
  }
  //   console.log(children);

  let visit = (children) => {
    for (let child of children) {
      if (typeof child == "object" && child instanceof Array) {
        visit(child);
        continue;
      }
      if (typeof child == "string") {
        child = new Text(child);
      }

      o.appendChild(child);
    }
  };
  visit(children);
  return o;
}

export class Text {
  constructor(text) {
    this.children = [];
    this.root = document.createTextNode(text);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
  getAttribute(n) {
    return;
  }
}

export class Wrapper {
  constructor(type) {
    console.log("::type", type);
    this.children = [];
    this.root = document.createElement(type);
  }
  setAttribute(name, value) {
    console.log("::setAttribute", name, value);
    this.root.setAttribute(name, value);
    if (name.match(/^on([\s\S]+)$/)) {
      this.addEventListener(
        RegExp.$1.replace(/^[\s\S]/, (c) => c.toLowerCase()),
        value
      );
    }
    if (name == "enableGesture") {
      enableGesture(this.root);
    }
  }
  getAttribute(n) {
    return this.root.getAttribute(n);
  }

  get classList() {
    return this.root.classList;
  }
  appendChild(child) {
    console.log("::appendChild", child);
    this.children.push(child);
  }
  get style() {
    return this.root.style;
  }

  addEventListener() {
    this.root.addEventListener(...arguments);
  }

  set innerText(t) {
    return (this.root.innerText = t);
  }

  mountTo(parent) {
    parent.appendChild(this.root);
    for (let child of this.children) {
      child.mountTo(this.root);
    }
  }
}
