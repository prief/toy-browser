function enableGesture(e) {
  let contexts = Object.create(null);
  let MOUSE_SYMBOL = Symbol("MOUSE");

  if (document.ontouchstart !== null) {
    e.addEventListener("mousedown", (e) => {
      contexts[MOUSE_SYMBOL] = Object.create(null);
      start(e, contexts[MOUSE_SYMBOL]);
      let mousemove = (e) => {
        // console.log(e.clientX, e.clientY);
        move(e, contexts[MOUSE_SYMBOL]);
      };
      let mouseup = (e) => {
        end(e, contexts[MOUSE_SYMBOL]);
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);
      };

      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
    });
  }

  e.addEventListener("touchstart", (e) => {
    //  console.log("touchstart", e.changedTouches[0]);
    for (let touch of e.changedTouches) {
      contexts[touch.identifier] = Object.create(null);
      start(touch, contexts[touch.identifier]);
    }
  });
  e.addEventListener("touchmove", (e) => {
    // console.log("touchmove", e.changedTouches[0]);
    for (let touch of e.changedTouches) {
      move(touch, contexts[touch.identifier]);
    }
  });
  e.addEventListener("touchend", (e) => {
    // console.log("touchend", e.changedTouches[0]);
    for (let touch of e.changedTouches) {
      end(touch, contexts[touch.identifier]);
      delete contexts[touch.identifier];
    }
  });
  e.addEventListener("touchcancel", (e) => {
    //  console.log("touchcancel", e.changedTouches[0]);
    for (let touch of e.changedTouches) {
      cancel(touch, contexts[touch.identifier]);
      delete contexts[touch.identifier];
    }
  });

  let start = (point, context) => {
    e.dispatchEvent(
      new CustomEvent("start", {
        startX: point.clientX,
        startY: point.clientY,
        clientX: point.clientX,
        clientY: point.clientY,
      })
    );
    context.startX = point.clientX;
    context.startY = point.clientY;
    console.log("start", context.startX, context.startY);
    context.moves = [];
    context.isTap = true;
    context.isPan = false;
    context.isPress = false;
    context.timeoutHandler = setTimeout(() => {
      if (context.isPan) {
        return;
      }
      context.isTap = false;
      context.isPan = false;
      context.isPress = true;
      e.dispatchEvent(new CustomEvent("pressstart", {}));
    }, 500);
  };
  let move = (point, context) => {
    let dx = point.clientX - context.startX;
    let dy = point.clientY - context.startY;
    console.log("move", dx, dy);
    if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
      if (context.isPress) {
        e.dispatchEvent(new CustomEvent("presscancel", {}));
      }
      context.isTap = false;
      context.isPan = true;
      context.isPress = false;
      e.dispatchEvent(
        new CustomEvent("panstart", {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
        })
      );
    }

    if (context.isPan) {
      console.log("panmove");
      context.moves.push({ dx, dy, t: Date.now() });
      context.moves = context.moves.filter((o) => Date.now() - o.t < 300);
      e.dispatchEvent(
        Object.assign(new CustomEvent("pan"), {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
        })
      );
    }
  };
  let end = (point, context) => {
    console.log("end", point.clientX, point.clientY);
    if (context.isPan) {
      let dx = point.clientX - context.startX;
      let dy = point.clientY - context.startY;
      console.log(context.moves);
      let record = context.moves[0];
      let speed =
        Math.sqrt((record.dx - dx) ** 2 + (record.dy - dy) ** 2) /
        (Date.now() - record.t);
      let isFlick = speed > 2.5;
      if (isFlick) {
        console.log("flick");
        e.dispatchEvent(
          new CustomEvent("flick", {
            startX: context.startX,
            startY: context.startY,
            clientX: point.clientX,
            clientY: point.clientY,
            speed,
          })
        );
      }
      console.log("panend");
      e.dispatchEvent(
        Object.assign(new CustomEvent("panend"), {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          speed,
          isFlick,
        })
      );
    }
    if (context.isTap) {
      console.log("tapend");
      e.dispatchEvent(new CustomEvent("tap", {}));
    }
    if (context.isPress) {
      console.log("pressend");
      e.dispatchEvent(new CustomEvent("pressend", {}));
    }
    clearTimeout(context.timeoutHandler);
  };
  let cancel = (point, context) => {
    console.log("cancel", point.clientX, point.clientY);
    e.dispatchEvent(new CustomEvent("canceled", {}));
    clearTimeout(context.timeoutHandler);
  };
}
