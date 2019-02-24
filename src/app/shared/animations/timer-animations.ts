import { trigger, state, style, transition, animate, animation, keyframes } from '@angular/animations';

// based on source code: https://github.com/daneden/animate.css/blob/master/source/bouncing_exits/bounceOutLeft.css
export const bounceOutLeftAnimation = animation(
  animate('500ms ease-out', keyframes([
    style({
      offset: .3,
      opacity: 1,
      transform: 'translateX(30px)'
    }),
    style({
      offset: 1,
      opacity: 0,
      transform: 'translateX(-100%)'
    }),
  ]))
);

// based on source code: https://github.com/daneden/animate.css/blob/master/source/bouncing_entrances/bounceInRight.css
export const bounceInLeftAnimation = animation(
  animate('500ms ease-in', keyframes([
    style({
      offset: 0,
      transform: 'translateX(-100%)'
    }),
    style({
      offset: .6,
      transform: 'translateX(25px)'
    }),
    style({
      offset: .75,
      transform: 'translateX(-10px)'
    }),
    style({
      offset: .9,
      transform: 'translateX(5px)'
    }),
    style({
      offset: 1,
      transform: 'translateX(0)'
    }),
  ]))
);

