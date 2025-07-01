/**
 * Reusable keyframe objects. Stored as constants so they are defined only once
 * and can be referenced by multiple animation definitions. This is ideal for
 * both DRY principles and minification.
 */
const slideInY = {
  '0%': { opacity: 0, transform: 'scaleY(0)' },
  '100%': { opacity: 1, transform: 'scaleY(1)' },
};
const slideOutY = {
  '0%': { opacity: 1, transform: 'scaleY(1)' },
  '100%': { opacity: 0, transform: 'scaleY(0)' },
};
const slideInX = {
  '0%': { opacity: 0, transform: 'scaleX(0)' },
  '100%': { opacity: 1, transform: 'scaleX(1)' },
};
const slideOutX = {
  '0%': { opacity: 1, transform: 'scaleX(1)' },
  '100%': { opacity: 0, transform: 'scaleX(0)' },
};

const swingInX = {
  '0%': { transform: 'perspective(1000px) rotateX(90deg)', opacity: 0 },
  '40%': { transform: 'perspective(1000px) rotateX(-30deg)', opacity: 1 },
  '60%': { transform: 'perspective(1000px) rotateX(15deg)' },
  '80%': { transform: 'perspective(1000px) rotateX(-7.5deg)' },
  '100%': { transform: 'perspective(1000px) rotateX(0deg)' },
};
const swingOutX = {
  '0%': { transform: 'perspective(1000px) rotateX(0deg)' },
  '40%': { transform: 'perspective(1000px) rotateX(-7.5deg)' },
  '60%': { transform: 'perspective(1000px) rotateX(17.5deg)' },
  '80%': { transform: 'perspective(1000px) rotateX(-30deg)', opacity: 1 },
  '100%': { transform: 'perspective(1000px) rotateX(90deg)', opacity: 0 },
};
const swingInY = {
  '0%': { transform: 'perspective(1000px) rotateY(-90deg)', opacity: 0 },
  '40%': { transform: 'perspective(1000px) rotateY(30deg)', opacity: 1 },
  '60%': { transform: 'perspective(1000px) rotateY(-17.5deg)' },
  '80%': { transform: 'perspective(1000px) rotateY(7.5deg)' },
  '100%': { transform: 'perspective(1000px) rotateY(0deg)' },
};
const swingOutY = {
  '0%': { transform: 'perspective(1000px) rotateY(0deg)' },
  '40%': { transform: 'perspective(1000px) rotateY(7.5deg)' },
  '60%': { transform: 'perspective(1000px) rotateY(-10deg)' },
  '80%': { transform: 'perspective(1000px) rotateY(30deg)', opacity: 1 },
  '100%': { transform: 'perspective(1000px) rotateY(-90deg)', opacity: 0 },
};

/**
 * The main animation definitions, structured as JS objects for optimal minification.
 * - `keyframe`: A direct reference to one of the reusable keyframe objects above.
 * - `keyframeName`: A string to name the animation. This is used when the keyframe is unique.
 * - `alias`: Points to another definition path within this object to avoid repetition.
 */
const animationDefinitions = {
  browse: {
    in: {
      duration: '500ms',
      keyframeName: 'browseIn',
      keyframe: {
        '0%': { transform: 'scale(0.8) translateZ(0px)', zIndex: -1 },
        '10%': { transform: 'scale(0.8) translateZ(0px)', zIndex: -1, opacity: 0.7 },
        '80%': { transform: 'scale(1.05) translateZ(0px)', opacity: 1, zIndex: 999 },
        '100%': { transform: 'scale(1) translateZ(0px)', zIndex: 999 },
      },
    },
    out: {
      duration: '500ms',
      keyframeName: 'browseOutLeft',
      keyframe: {
        '0%': { zIndex: 999, transform: 'translateX(0%) rotateY(0deg) rotateX(0deg)' },
        '50%': { zIndex: -1, transform: 'translateX(-105%) rotateY(35deg) rotateX(10deg) translateZ(-10px)' },
        '80%': { opacity: 1 },
        '100%': { zIndex: -1, transform: 'translateX(0%) rotateY(0deg) rotateX(0deg) translateZ(-10px)', opacity: 0 },
      },
    },
    right: {
      out: {
        duration: '500ms',
        keyframeName: 'browseOutRight',
        keyframe: {
          '0%': { zIndex: 999, transform: 'translateX(0%) rotateY(0deg) rotateX(0deg)' },
          '50%': { zIndex: 1, transform: 'translateX(105%) rotateY(35deg) rotateX(10deg) translateZ(-10px)' },
          '80%': { opacity: 1 },
          '100%': { zIndex: 1, transform: 'translateX(0%) rotateY(0deg) rotateX(0deg) translateZ(-10px)', opacity: 0 },
        },
      },
    },
  },

  drop: {
    in: {
      duration: '400ms',
      keyframeName: 'dropIn',
      keyframe: {
        '0%': { opacity: 0, transform: 'scale(0)' },
        '100%': { opacity: 1, transform: 'scale(1)' },
      },
    },
    out: {
      duration: '400ms',
      keyframeName: 'dropOut',
      keyframe: {
        '0%': { opacity: 1, transform: 'scale(1)' },
        '100%': { opacity: 0, transform: 'scale(0)' },
      },
    },
  },

  fade: {
    in: { duration: '300ms', keyframeName: 'fadeIn', keyframe: { '0%': { opacity: 0 }, '100%': { opacity: 1 } } },
    out: { duration: '300ms', keyframeName: 'fadeOut', keyframe: { '0%': { opacity: 1 }, '100%': { opacity: 0 } } },
    up: {
      in: {
        keyframeName: 'fadeInUp',
        keyframe: {
          '0%': { opacity: 0, transform: 'translateY(10%)' },
          '100%': { opacity: 1, transform: 'translateY(0%)' },
        },
      },
      out: {
        keyframeName: 'fadeOutUp',
        keyframe: {
          '0%': { opacity: 1, transform: 'translateY(0%)' },
          '100%': { opacity: 0, transform: 'translateY(5%)' },
        },
      },
    },
    down: {
      in: {
        keyframeName: 'fadeInDown',
        keyframe: {
          '0%': { opacity: 0, transform: 'translateY(-10%)' },
          '100%': { opacity: 1, transform: 'translateY(0%)' },
        },
      },
      out: {
        keyframeName: 'fadeOutDown',
        keyframe: {
          '0%': { opacity: 1, transform: 'translateY(0%)' },
          '100%': { opacity: 0, transform: 'translateY(-5%)' },
        },
      },
    },
    left: {
      in: {
        keyframeName: 'fadeInLeft',
        keyframe: {
          '0%': { opacity: 0, transform: 'translateX(10%)' },
          '100%': { opacity: 1, transform: 'translateX(0%)' },
        },
      },
      out: {
        keyframeName: 'fadeOutLeft',
        keyframe: {
          '0%': { opacity: 1, transform: 'translateX(0%)' },
          '100%': { opacity: 0, transform: 'translateX(5%)' },
        },
      },
    },
    right: {
      in: {
        keyframeName: 'fadeInRight',
        keyframe: {
          '0%': { opacity: 0, transform: 'translateX(-10%)' },
          '100%': { opacity: 1, transform: 'translateX(0%)' },
        },
      },
      out: {
        keyframeName: 'fadeOutRight',
        keyframe: {
          '0%': { opacity: 1, transform: 'translateX(0%)' },
          '100%': { opacity: 0, transform: 'translateX(-5%)' },
        },
      },
    },
  },

  fly: {
    duration: '600ms',
    in: {
      keyframeName: 'flyIn',
      keyframe: {
        '0%': { opacity: 0, transform: 'scale3d(.3,.3,.3)' },
        '20%': { transform: 'scale3d(1.1,1.1,1.1)' },
        '40%': { transform: 'scale3d(.9,.9,.9)' },
        '60%': { opacity: 1, transform: 'scale3d(1.03,1.03,1.03)' },
        '80%': { transform: 'scale3d(.97,.97,.97)' },
        '100%': { opacity: 1, transform: 'scale3d(1,1,1)' },
      },
    },
    out: {
      keyframeName: 'flyOut',
      keyframe: {
        '20%': { transform: 'scale3d(.9,.9,.9)' },
        '50%,55%': { opacity: 1, transform: 'scale3d(1.1,1.1,1.1)' },
        '100%': { opacity: 0, transform: 'scale3d(.3,.3,.3)' },
      },
    },
    up: {
      in: {
        keyframeName: 'flyInUp',
        keyframe: {
          '0%': { opacity: 0, transform: 'translate3d(0,1500px,0)' },
          '60%': { opacity: 1, transform: 'translate3d(0,-20px,0)' },
          '75%': { transform: 'translate3d(0,10px,0)' },
          '90%': { transform: 'translate3d(0,-5px,0)' },
          '100%': { transform: 'translate3d(0,0,0)' },
        },
      },
      out: {
        keyframeName: 'flyOutUp',
        keyframe: {
          '20%': { transform: 'translate3d(0,10px,0)' },
          '40%,45%': { opacity: 1, transform: 'translate3d(0,-20px,0)' },
          '100%': { opacity: 0, transform: 'translate3d(0,2000px,0)' },
        },
      },
    },
    down: {
      in: {
        keyframeName: 'flyInDown',
        keyframe: {
          '0%': { opacity: 0, transform: 'translate3d(0,-1500px,0)' },
          '60%': { opacity: 1, transform: 'translate3d(0,25px,0)' },
          '75%': { transform: 'translate3d(0,-10px,0)' },
          '90%': { transform: 'translate3d(0,5px,0)' },
          '100%': { transform: 'none' },
        },
      },
      out: {
        keyframeName: 'flyOutDown',
        keyframe: {
          '20%': { transform: 'translate3d(0,-10px,0)' },
          '40%,45%': { opacity: 1, transform: 'translate3d(0,20px,0)' },
          '100%': { opacity: 0, transform: 'translate3d(0,-2000px,0)' },
        },
      },
    },
    left: {
      in: {
        keyframeName: 'flyInLeft',
        keyframe: {
          '0%': { opacity: 0, transform: 'translate3d(1500px,0,0)' },
          '60%': { opacity: 1, transform: 'translate3d(-25px,0,0)' },
          '75%': { transform: 'translate3d(10px,0,0)' },
          '90%': { transform: 'translate3d(-5px,0,0)' },
          '100%': { transform: 'none' },
        },
      },
      out: {
        keyframeName: 'flyOutLeft',
        keyframe: {
          '20%': { opacity: 1, transform: 'translate3d(-20px,0,0)' },
          '100%': { opacity: 0, transform: 'translate3d(2000px,0,0)' },
        },
      },
    },
    right: {
      in: {
        keyframeName: 'flyInRight',
        keyframe: {
          '0%': { opacity: 0, transform: 'translate3d(-1500px,0,0)' },
          '60%': { opacity: 1, transform: 'translate3d(25px,0,0)' },
          '75%': { transform: 'translate3d(-10px,0,0)' },
          '90%': { transform: 'translate3d(5px,0,0)' },
          '100%': { transform: 'none' },
        },
      },
      out: {
        keyframeName: 'flyOutRight',
        keyframe: {
          '20%': { opacity: 1, transform: 'translate3d(20px,0,0)' },
          '100%': { opacity: 0, transform: 'translate3d(-2000px,0,0)' },
        },
      },
    },
  },

  flip: {
    duration: '600ms',
    horizontal: {
      in: {
        keyframeName: 'horizontalFlipIn',
        keyframe: {
          '0%': { transform: 'perspective(2000px) rotateY(-90deg)', opacity: 0 },
          '100%': { transform: 'perspective(2000px) rotateY(0)', opacity: 1 },
        },
      },
      out: {
        keyframeName: 'horizontalFlipOut',
        keyframe: {
          '0%': { transform: 'perspective(2000px) rotateY(0)', opacity: 1 },
          '100%': { transform: 'perspective(2000px) rotateY(90deg)', opacity: 0 },
        },
      },
    },
    vertical: {
      in: {
        keyframeName: 'verticalFlipIn',
        keyframe: {
          '0%': { transform: 'perspective(2000px) rotateX(-90deg)', opacity: 0 },
          '100%': { transform: 'perspective(2000px) rotateX(0)', opacity: 1 },
        },
      },
      out: {
        keyframeName: 'verticalFlipOut',
        keyframe: {
          '0%': { transform: 'perspective(2000px) rotateX(0)', opacity: 1 },
          '100%': { transform: 'perspective(2000px) rotateX(-90deg)', opacity: 0 },
        },
      },
    },
  },

  scale: {
    in: {
      duration: '300ms',
      keyframeName: 'scaleIn',
      keyframe: { '0%': { opacity: 0, transform: 'scale(0.8)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
    },
    out: {
      duration: '300ms',
      keyframeName: 'scaleOut',
      keyframe: { '0%': { opacity: 1, transform: 'scale(1)' }, '100%': { opacity: 0, transform: 'scale(0.9)' } },
    },
  },

  slide: {
    down: {
      in: { keyframeName: 'slideInY', keyframe: slideInY },
      out: { keyframeName: 'slideOutY', keyframe: slideOutY },
    },
    up: { alias: 'slide.down' },
    left: {
      in: { keyframeName: 'slideInX', keyframe: slideInX },
      out: { keyframeName: 'slideOutX', keyframe: slideOutX },
    },
    right: { alias: 'slide.left' },
  },

  swing: {
    duration: '800ms',
    down: {
      in: { keyframeName: 'swingInX', keyframe: swingInX },
      out: { keyframeName: 'swingOutX', keyframe: swingOutX },
    },
    up: { alias: 'swing.down' },
    left: {
      in: { keyframeName: 'swingInY', keyframe: swingInY },
      out: { keyframeName: 'swingOutY', keyframe: swingOutY },
    },
    right: { alias: 'swing.left' },
  },

  zoom: {
    in: {
      keyframeName: 'zoomIn',
      keyframe: { '0%': { opacity: 1, transform: 'scale(0)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
    },
    out: {
      keyframeName: 'zoomOut',
      keyframe: { '0%': { opacity: 1, transform: 'scale(1)' }, '100%': { opacity: 1, transform: 'scale(0)' } },
    },
  },

  // --- Static Animations (no in/out direction) ---
  jiggle: {
    static: {
      duration: '750ms',
      keyframeName: 'jiggle',
      keyframe: {
        '0%': { transform: 'scale3d(1, 1, 1)' },
        '30%': { transform: 'scale3d(1.25, 0.75, 1)' },
        '40%': { transform: 'scale3d(0.75, 1.25, 1)' },
        '50%': { transform: 'scale3d(1.15, 0.85, 1)' },
        '65%': { transform: 'scale3d(0.95, 1.05, 1)' },
        '75%': { transform: 'scale3d(1.05, 0.95, 1)' },
        '100%': { transform: 'scale3d(1, 1, 1)' },
      },
    },
  },
  flash: {
    static: {
      duration: '750ms',
      keyframeName: 'flash',
      keyframe: { '0%, 50%, 100%': { opacity: 1 }, '25%, 75%': { opacity: 0 } },
    },
  },
  shake: {
    static: {
      duration: '750ms',
      keyframeName: 'shake',
      keyframe: {
        '0%, 100%': { transform: 'translateX(0)' },
        '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
        '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
      },
    },
  },
  bounce: {
    static: {
      duration: '750ms',
      keyframeName: 'bounce',
      keyframe: {
        '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
        '40%': { transform: 'translateY(-30px)' },
        '60%': { transform: 'translateY(-15px)' },
      },
    },
  },
  tada: {
    static: {
      duration: '750ms',
      keyframeName: 'tada',
      keyframe: {
        '0%': { transform: 'scale(1)' },
        '10%, 20%': { transform: 'scale(0.9) rotate(-3deg)' },
        '30%, 50%, 70%, 90%': { transform: 'scale(1.1) rotate(3deg)' },
        '40%, 60%, 80%': { transform: 'scale(1.1) rotate(-3deg)' },
        '100%': { transform: 'scale(1) rotate(0)' },
      },
    },
  },
  pulse: {
    static: {
      duration: '500ms',
      keyframeName: 'pulse',
      keyframe: {
        '0%': { transform: 'scale(1)', opacity: 1 },
        '50%': { transform: 'scale(0.9)', opacity: 0.7 },
        '100%': { transform: 'scale(1)', opacity: 1 },
      },
    },
  },
  glow: {
    static: {
      duration: '2000ms',
      keyframeName: 'glow',
      keyframe: {
        '0%': { backgroundColor: '#FCFCFD' },
        '30%': { backgroundColor: '#FFF6CD' },
        '100%': { backgroundColor: '#FCFCFD' },
      },
    },
  },
};
