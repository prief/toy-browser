export class Timeline {
  constructor(config) {
    this.state = "inited";
    this.animations = new Set();
    this.addTimes = new Map();
    this.finishedAnimations = new Set();
    this.requestAnimationFrameId = null;
  }

  tick() {
    console.log("tick");
    let t = Date.now() - this.startTime;
    for (let animation of this.animations) {
      let {
        object,
        property,
        template,
        start,
        end,
        delay,
        duration,
        timingFunction,
      } = animation;

      let addTime = this.addTimes.get(animation);
      let progression = timingFunction((t - delay - addTime) / duration); // 0-1

      if (t < delay + addTime) {
        continue;
      }
      if (t > duration + delay + addTime) {
        progression = 1;
        this.animations.delete(animation);
        this.finishedAnimations.add(animation);
      }
      let value = animation.valueFromProgression(progression);
      object[property] = template(value);
    }

    if (this.animations.size) {
      this.requestAnimationFrameId = requestAnimationFrame(() => this.tick());
    } else {
      this.requestAnimationFrameId = null;
    }
  }
  add(animation, addTime) {
    this.animations.add(animation);
    if (this.state == "playing" && this.requestAnimationFrameId == null) {
      this.tick();
    }
    if (this.state == "playing") {
      this.addTimes.set(
        animation,
        addTime != void 0 ? addTime : Date.now() - this.startTime
      );
    } else {
      this.addTimes.set(animation, addTime != void 0 ? addTime : 0);
    }
  }
  pause() {
    if (this.state != "playing") {
      return;
    }
    this.state = "paused";
    this.pauseTime = Date.now();
    if (this.requestAnimationFrameId !== null) {
      cancelAnimationFrame(this.requestAnimationFrameId);
      this.requestAnimationFrameId = null;
    }
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
  reset() {
    if (this.state == "playing") {
      this.pause();
    }
    this.animations = new Set();
    this.addTimes = new Map();
    this.finishedAnimations = new Set();
    this.requestAnimationFrameId = null;
    this.startTime = Date.now();
    this.pauseTime = null;
    this.state = "inited";
  }
  restart() {
    if (this.state == "playing") {
      this.pause();
    }
    for (let animation of this.finishedAnimations) {
      this.animations.add(animation);
    }
    this.finishedAnimations = new Set();
    this.requestAnimationFrameId = null;
    this.state = "playing";
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
