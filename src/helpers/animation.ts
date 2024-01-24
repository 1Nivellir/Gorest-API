import gsap from "gsap";
export function onBeforeEnter1(el: any) {
  el.style.opacity = "0";
  el.style.height = "0";
}

export function onEnter1(el: any, done: any) {
  gsap.to(el, {
    opacity: 1,
    height: "1.6em",
    delay: el.dataset.index * 0.15,
    onComplete: done,
  });
}

export function onLeave1(el: any, done: any) {
  gsap.to(el, {
    opacity: 0,
    height: 0,
    delay: el.dataset.index * 0.15,
    onComplete: done,
  });
}

export function onBeforeEnter(el: any) {
  gsap.set(el, {
    x: 300, // Start from the right of the screen
    opacity: 0,
    ease: "power2.inOut",
  });
}

export function onEnter(el: any, done: any) {
  gsap.to(el, {
    duration: 1,
    x: 0, // End at the original position
    opacity: 1,
    ease: "power2.inOut",
    onComplete: done,
  });
}

export function onLeave(el: any, done: any) {
  gsap.to(el, {
    duration: 0.7,
    x: 300, // Move to the right of the screen
    opacity: 0,
    ease: "power2.inOut",
    onComplete: done,
  });
}
export function onBeforeEnter2(el: any) {
  gsap.set(el, {
    duration: 0.7,
    scale: 0,
    opacity: 0,
    y: 300,
    ease: "power2.inOut",
  });
}

export function onEnter2(el: any, done: any) {
  gsap.to(el, {
    duration: 0.7,
    scale: 1,
    opacity: 1,
    y: 0,
    ease: "power2.inOut",
    onComplete: done,
  });
}

export function onLeave2(el: any, done: any) {
  gsap.to(el, {
    duration: 0.1,
    scale: 0,
    opacity: 0,
    y: -300,
    ease: "power2.inOut",
    onComplete: done,
  });
}
