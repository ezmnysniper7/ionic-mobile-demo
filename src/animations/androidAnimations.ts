import { createAnimation, Animation } from '@ionic/react';

/**
 * Android-style vertical transition animation (Material Design)
 * Forward: Slides UP from bottom
 * Back: Slides DOWN to bottom
 */
export const mdTransitionAnimation = (_: HTMLElement, opts: any): Animation => {
  const DURATION = 250;
  const rootTransition = createAnimation()
    .duration(opts.duration || DURATION)
    .easing('cubic-bezier(0.4, 0.0, 0.2, 1)');

  const enteringPage = createAnimation()
    .addElement(opts.enteringEl)
    .beforeRemoveClass('ion-page-invisible');

  const leavingPage = createAnimation()
    .addElement(opts.leavingEl);

  if (opts.direction === 'back') {
    // Going back: entering page stays in place, leaving page slides DOWN
    enteringPage
      .fromTo('opacity', 0.8, 1);

    leavingPage
      .fromTo('transform', 'translateY(0)', 'translateY(100%)')
      .fromTo('opacity', 1, 0);
  } else {
    // Going forward: entering page slides UP from bottom, leaving page fades
    enteringPage
      .fromTo('transform', 'translateY(100%)', 'translateY(0)')
      .fromTo('opacity', 0, 1);

    leavingPage
      .fromTo('opacity', 1, 0.8);
  }

  rootTransition.addAnimation(enteringPage);
  rootTransition.addAnimation(leavingPage);

  return rootTransition;
};
