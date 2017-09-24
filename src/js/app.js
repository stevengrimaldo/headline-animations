import { TweenMax, TimelineMax } from 'gsap';

import {
  addClass,
  removeClass,
  wrap
} from 'common_';

import { snappy } from './easing';

import SplitText from './vendors/gsap/src/bonus-files-for-npm-users/SplitText';

import '../scss/app.scss';

const pushDown = (lines) => {
  TweenMax.set(lines, {
    y: '100%',
    force3D: true
  });
};

const split = (els) => {
  [].slice.call(els).forEach((el) => {
    addClass(el, 'sfx-visible');
    let textType;
    TweenMax.set(el, {
      width: el.offsetWidth
    });
    const headlineText = el.textContent || el.innerText;
    if (headlineText.indexOf(' ') < 0) {
      textType = 'words';
    } else {
      textType = 'lines';
    }
    const mySplitText = new SplitText(el, {
      type: textType,
      linesClass: 'line',
      wordsClass: 'line'
    });
    const lines = el.querySelectorAll('.line');
    const lineWrapper = document.createElement('div');
    addClass(lineWrapper, 'line-wrapper');
    wrap(lines, lineWrapper);
    // eslint-disable-next-line no-unused-vars
    const headlineSplit = mySplitText;
  });
};

const maskOff = (el) => {
  const lines = el.querySelectorAll('.line');
  const lineWrappers = el.querySelectorAll('.line-wrapper');

  pushDown(lines);

  [].slice.call(lineWrappers).forEach((line) => {
    const maskOverlay = document.createElement('div');
    addClass(maskOverlay, 'sfx-mask');
    line.appendChild(maskOverlay);
    const maskCover = maskOverlay;
    const masks = el.querySelectorAll('.sfx-mask');
    const unHide = () => {
      addClass(maskCover, 'hidden');
      maskCover.parentNode.removeChild(maskCover);
    };
    const maskTimeline = new TimelineMax({
      delay: 0.75,
      onComplete: unHide
    });
    const revert = () => {
      TweenMax.set(el, {
        clearProps: 'width'
      });
    };
    maskTimeline.staggerFromTo(masks, 0.8, {
      y: '0%'
    }, {
      y: '-100%',
      ease: snappy
    }, 0.1);
    maskTimeline.staggerFromTo(lines, 0.8, {
      y: '100%'
    }, {
      y: '0%',
      ease: snappy
    }, 0.1, '-=0.7', revert);
  });
};

const linesUp = (el) => {
  const lines = el.querySelectorAll('.line');
  const revert = () => {
    TweenMax.set(el, {
      clearProps: 'width'
    });
  };
  const lineTimeline = new TimelineMax({
    delay: 0.75,
    onComplete: revert
  });

  pushDown(lines);

  lineTimeline.staggerFromTo(lines, 0.8, {
    y: '100%'
  }, {
    y: '0%',
    ease: snappy
  }, 0.1, '-=0.7');
};

const blockRotate = (el) => {
  const lineWrappers = el.querySelectorAll('.line-wrapper');

  [].slice.call(lineWrappers).forEach((line) => {
    const blockCopy = document.createElement('div');
    addClass(blockCopy, 'sfx-block');
    blockCopy.innerHTML = line.querySelector('.line').innerHTML;
    line.appendChild(blockCopy);

    const blockWrapper = document.createElement('div');
    addClass(blockWrapper, 'block-wrapper');
    wrap(line, blockWrapper);

    TweenMax.set(blockWrapper, { height: blockCopy.offsetHeight });
    TweenMax.set(blockCopy, { y: (blockCopy.offsetHeight / 2), force3D: true });
    TweenMax.set(line.querySelector('.line'), { z: (blockCopy.offsetHeight / 2), position: 'absolute', force3D: true });
  });

  const blockTimeline = new TimelineMax();
  blockTimeline.staggerTo(lineWrappers, 0.4, {
    rotationX: 90,
    ease: snappy
  }, 0.15);
};

window.addEventListener('load', () => {
  const headlines = document.querySelectorAll('.type__headline h1');
  const mask = document.querySelector('.type__headline--mask h1');
  const line = document.querySelector('.type__headline--line h1');
  const block = document.querySelector('.type__headline--block h1');

  split(headlines);
  maskOff(mask);
  linesUp(line);
  blockRotate(block);
});
