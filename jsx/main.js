import { create } from "./creatElement";
// import { Carousel } from "./Carousel.view";
class Carousel {
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
    let children = this.data.map((url) => {
      let e = <img src={url} />;
      e.addEventListener("dragstart", (e) => e.preventDefault());
      return e;
    });
    let root = <div class="carousel">{children}</div>;
    let p = 0;
    let nextPic = () => {
      let nextP = (p + 1) % this.data.length;
      let cur = children[p];
      let next = children[nextP];

      cur.style.transition = "ease 0s";
      next.style.transition = "ease 0s";
      cur.style.transform = `translateX(${-100 * p}%)`;
      next.style.transform = `translateX(${100 - 100 * nextP}%)`;

      setTimeout(() => {
        cur.style.transition = "ease 0.5s";
        next.style.transition = "ease 0.5s";
        cur.style.transform = `translateX(${-100 - 100 * p}%)`;
        next.style.transform = `translateX(${-100 * nextP}%)`;
        p = nextP;
        console.log(p);
      }, 16);
      setTimeout(nextPic, 3000);
    };
    setTimeout(nextPic, 3000);
    return root;
  }
  mountTo(parent) {
    this.render().mountTo(parent);
  }
}

let c = (
  <Carousel
    data={[
      "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
      "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
      "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
      "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
    ]}
  ></Carousel>
);
c.mountTo(document.body);
