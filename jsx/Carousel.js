import { create } from "./creatElement";

import { Timeline, Animation } from "./animation.js";
import { ease } from "./cubicBezier.js";
import { enableGesture } from "./gesture.js";

import './carousel.css'

export class Carousel {
  constructor(config) {
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
  }

  setAttribute(n, v) {
    this[n] = v;
  }
  appendChild(c) {
    this.children.push(c);
  }

  render() {
    let p = 0;
    let nextPicStopHandler = null;
    let tl = new Timeline();
    window.xtl = tl;
    tl.start();

    let children = this.data.map((url, position) => {
      let prevPosition = (position - 1 + this.data.length) % this.data.length;
      let nextPosition = (position + 1) % this.data.length;
      // console.log(prevPosition, position, nextPosition);

      let offset = 0;

      let onStart = () => {
        tl.pause();
        clearTimeout(nextPicStopHandler);
        let el = children[position];

        let elTransformValue = Number(
          el.style.transform.match(/translateX\(([\s\S]+)px\)/)[1]
        );

        offset = elTransformValue + 500 * position;
      };
      let onPan = (e) => {
        let prevEl = children[prevPosition];
        let el = children[position];
        let nextEl = children[nextPosition];

        let elTransformValue = -500 * position + offset;
        let prevElTransformValue = -500 - 500 * prevPosition + offset;
        let nextElTransformValue = 500 - 500 * nextPosition + offset;
        let dx = e.clientX - e.startX;

        prevEl.style.transform = `translateX(${prevElTransformValue + dx}px)`;
        el.style.transform = `translateX(${elTransformValue + dx}px)`;
        nextEl.style.transform = `translateX(${nextElTransformValue + dx}px)`;
      };
      let onPanend = (e) => {
        let direction = 0;
        let dx = e.clientX - e.startX;

        if (dx + offset > 250 || (dx > 0 && e.isFlick)) {
          direction = 1;
        } else if (dx + offset < -250 || (dx < 0 && e.isFlick)) {
          direction = -1;
        }

        tl.reset();
        tl.start();
        let prevEl = children[prevPosition];
        let el = children[position];
        let nextEl = children[nextPosition];

        let prevAnimation = new Animation(
          prevEl.style,
          "transform",
          (v) => `translateX(${v}px)`,
          -500 - 500 * prevPosition + offset + dx,
          -500 - 500 * prevPosition + direction * 500,
          500,
          0,
          ease
        );
        let curAnimation = new Animation(
          el.style,
          "transform",
          (v) => `translateX(${v}px)`,
          -500 * position + offset + dx,
          -500 * position + direction * 500,
          500,
          0,
          ease
        );
        let nextAnimation = new Animation(
          nextEl.style,
          "transform",
          (v) => `translateX(${v}px)`,
          500 - 500 * nextPosition + offset + dx,
          500 - 500 * nextPosition + direction * 500,
          500,
          0,
          ease
        );

        tl.add(prevAnimation);
        tl.add(curAnimation);
        tl.add(nextAnimation);

        p = (p - direction + this.data.length) % this.data.length;

        nextPicStopHandler = setTimeout(nextPic, 3000);
      };
      let e = (
        <img
          src={url}
          onStart={onStart}
          onPan={onPan}
          onPanend={onPanend}
          enableGesture={true}
        />
      );
      e.style.transform = "translateX(0px)";
      e.addEventListener("dragstart", (e) => e.preventDefault());
      return e;
    });
    let root = <div class="carousel">{children}</div>;

    let nextPic = () => {
      let nextP = (p + 1) % this.data.length;
      let cur = children[p];
      let next = children[nextP];

      let curAnimation = new Animation(
        cur.style,
        "transform",
        (v) => `translateX(${5 * v}px)`,
        -100 * p,
        -100 - 100 * p,
        500,
        0,
        ease
      );
      let nextAnimation = new Animation(
        next.style,
        "transform",
        (v) => `translateX(${5 * v}px)`,
        100 - 100 * nextP,
        -100 * nextP,
        500,
        0,
        ease
      );

      tl.add(curAnimation);
      tl.add(nextAnimation);

      p = nextP;

      // cur.style.transition = "ease 0s";
      // next.style.transition = "ease 0s";
      // cur.style.transform = `translateX(${-100 * p}%)`;
      // next.style.transform = `translateX(${100 - 100 * nextP}%)`;

      // setTimeout(() => {
      //   cur.style.transition = "ease 0.5s";
      //   next.style.transition = "ease 0.5s";
      //   cur.style.transform = `translateX(${-100 - 100 * p}%)`;
      //   next.style.transform = `translateX(${-100 * nextP}%)`;
      //   p = nextP;
      //   console.log(p);
      // }, 16);
      window.xtlHandler = nextPicStopHandler = setTimeout(nextPic, 3000);
    };
    nextPicStopHandler = setTimeout(nextPic, 3000);
    return root;
  }
  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
