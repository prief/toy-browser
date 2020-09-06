export class Timeline {
  constructor(config) {
    this.state = "inited";
    this.animations = [];
    this.requestAnimationFrameId = null;
  }

  tick() {
    console.log("tick");
    let t = Date.now() - this.startTime;
    let animations = this.animations.filter((animation) => !animation.finished);
    for (let animation of animations) {
      let {
        object,
        property,
        template,
        start,
        end,
        delay,
        duration,
        addTime,
        timingFunction,
      } = animation;

      let progression = timingFunction((t - delay - addTime) / duration); // 0-1

      if (t > duration + delay + addTime) {
        progression = 1;
        animation.finished = true;
      }
      let value = animation.valueFromProgression(progression);
      object[property] = template(value);
    }

    if (animations.length) {
      this.requestAnimationFrameId = requestAnimationFrame(() => this.tick());
    }
  }
  add(animation, addTime) {
    this.animations.push(animation);
    animation.finished = false;
    if (this.state == "playing") {
      animation.addTime =
        addTime != void 0 ? addTime : Date.now() - this.startTime;
    } else {
      animation.addTime = addTime != void 0 ? addTime : 0;
    }
  }
  pause() {
    if (this.state != "playing") {
      return;
    }
    this.state = "paused";
    this.pauseTime = Date.now();
    cancelAnimationFrame(this.requestAnimationFrameId);
  }
  resume() {
    if (this.state != "paused") {
      return;
    }
    this.state = "playing";
    this.startTime += Date.now() - this.pauseTime;
    this.tick();
  }
  start() {
    if (this.state != "inited") {
      return;
    }
    this.state = "playing";
    this.startTime = Date.now();
    this.tick();
  }
  restart() {
    if (this.state == "playing") {
      this.pause();
    }
    this.state = "playing";
    this.animations = [];
    this.requestAnimationFrameId = null;
    this.startTime = Date.now();
    this.pauseTime = null;
    this.tick();
  }
}

export class Animation {
  constructor(
    object,
    property,
    template,
    start,
    end,
    duration,
    delay,
    timingFunction
  ) {
    this.object = object;
    this.property = property;
    this.template = template;
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction;
  }
  valueFromProgression(progression) {
    return this.start + progression * (this.end - this.start);
  }
}
export class ColorAnimation {
  constructor(
    object,
    property,
    template,
    start,
    end,
    duration,
    delay,
    timingFunction
  ) {
    this.object = object;
    this.property = property;
    this.template = template || ((v) => `rgba(${v.r},${v.g},${v.b},${v.a})`);
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction;
  }
  valueFromProgression(progression) {
    return {
      r: this.start.r + progression * (this.end.r - this.start.r),
      g: this.start.g + progression * (this.end.g - this.start.g),
      b: this.start.b + progression * (this.end.b - this.start.b),
      a: this.start.a + progression * (this.end.a - this.start.a),
    };
  }
}
