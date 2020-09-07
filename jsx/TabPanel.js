// TabPanel.js
import { create } from "./creatElement";

export class TabPanel {
  constructor(config) {
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
    this.state = Object.create(null);
  }

  setAttribute(n, v) {
    this[n] = v;
  }
  getAttribute(n) {
    return this[n];
  }
  appendChild(c) {
    this.children.push(c);
  }

  select(i) {
    for (let child of this.childViews) {
      child.style.display = "none";
    }
    this.childViews[i].style.display = "";
    for (let child of this.titleViews) {
      child.classList.remove("selected");
    }
    this.titleViews[i].classList.add("selected");
    // this.titleView.innerText = this.childViews[i].title;
  }
  render() {
    this.childViews = this.children.map((child) => (
      <div style="width:300px;min-height:300px;">{child}</div>
    ));
    this.titleViews = this.children.map((child, i) => (
      <span
        onClick={() => this.select(i)}
        style="font-size:24px;margin:5px 5px 0 5px;background-color:lightgreen;width:300px;min-height:300px;"
      >
        {child.getAttribute("title")}
      </span>
    ));
    setTimeout(() => this.select(0), 16);
    return (
      <div class="tab-panel" style="width:300px;">
        <h1 style="width:300px;margin:0;">{this.titleViews}</h1>
        <div style="border:1px solid lightgreen;">{this.childViews}</div>
      </div>
    );
  }
  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
