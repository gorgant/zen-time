import { trigger, state, style, transition, animate, animation, keyframes } from '@angular/animations';

// based on source code: https://github.com/daneden/animate.css/blob/master/source/bouncing_exits/bounceOutLeft.css
export const bounceOutLeftAnimation = animation(
  animate('500ms ease-out', keyframes([
    style({
      offset: .2,
      opacity: 1,
      transform: 'translateX(20px)'
    }),
    style({
      offset: 1,
      opacity: 0,
      transform: 'translateX(-100%)'
    }),
  ]))
);

export const slide = trigger('slide', [
  // transition(':enter', [
  //   style({ transform: 'translateX(-40px)', opacity: 0}),
  //   animate(2000)
  // ]),
  transition(':leave', [
    style({ transform: 'translateX(-100%)', opacity: 0}),
    animate(2000)
  ])
]);

export const fade = trigger('fade', [
  state('void', style({ opacity: 0})),
  transition(':enter, :leave', [
    // Animate is applied over time
    animate(4000)
  ])
]);

export const fadeInAnimation = animation([
  style({ opacity: 0 }),
  animate('{{ duration }} {{ easing }}')
], {
  // here we set some default options if the user doesn't set them
  params: {
    duration: '500',
    easing: 'ease-out'
  }
});
