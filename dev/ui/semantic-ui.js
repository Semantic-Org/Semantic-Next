var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i5 = decorators.length - 1, decorator; i5 >= 0; i5--)
    if (decorator = decorators[i5])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};

// src/button/button.css
var button_default = '/* src/button/css/content/button.css */\n.button {\n  cursor: pointer;\n  display: inline-block;\n  min-height: 1em;\n  font-size: var(--medium);\n  border: none;\n  vertical-align: var(--vertical-align);\n  background: var(--background);\n  color: var(--text-color);\n  font-family: var(--font-family);\n  margin: 0em var(--horizontal-margin) var(--vertical-margin) 0em;\n  padding: var(--vertical-padding) var(--horizontal-padding) calc(var(--vertical-padding) + var(--shadow-offset));\n  text-transform: var(--text-transform);\n  text-shadow: var(--text-shadow);\n  font-weight: var(--font-weight);\n  line-height: var(--line-height);\n  font-style: normal;\n  text-align: center;\n  text-decoration: none;\n  border-radius: var(--border-radius);\n  box-shadow: var(--box-shadow);\n  user-select: none;\n  transition: var(--transition);\n  will-change: var(--will-change);\n  -webkit-tap-highlight-color: var(--tap-color);\n  outline: none;\n}\n\n/* src/button/css/group/buttons.css */\n.buttons {\n  display: inline-flex;\n  flex-direction: row;\n  font-size: 0em;\n  vertical-align: baseline;\n  margin: var(--vertical-margin) var(--horizontal-margin) 0em 0em;\n}\n.buttons:not(.basic):not(.inverted) {\n  box-shadow: var(--group-box-shadow);\n}\n.buttons::after {\n  content: ".";\n  display: block;\n  height: 0;\n  clear: both;\n  visibility: hidden;\n}\n.buttons .button {\n  flex: 1 0 auto;\n  border-radius: 0em;\n  margin: var(--group-button-offset);\n}\n.buttons > .button:not(.basic):not(.inverted),\n.buttons:not(.basic):not(.inverted) > .button {\n  box-shadow: var(--group-button-box-shadow);\n}\n.buttons .button:first-child {\n  border-left: none;\n  margin-left: 0em;\n  border-top-left-radius: var(--border-radius);\n  border-bottom-left-radius: var(--border-radius);\n}\n.buttons .button:last-child {\n  border-top-right-radius: var(--border-radius);\n  border-bottom-right-radius: var(--border-radius);\n}\n\n/* src/button/css/types/animated.css */\n.animated.button {\n  position: relative;\n  overflow: hidden;\n  padding-right: 0em !important;\n  vertical-align: var(--animated-vertical-align);\n  z-index: var(--animated-z-index);\n}\n.animated.button .content {\n  will-change: transform, opacity;\n}\n.animated.button .visible.content {\n  position: relative;\n  margin-right: var(--horizontal-padding);\n}\n.animated.button .hidden.content {\n  position: absolute;\n  width: 100%;\n}\n.animated.button .visible.content,\n.animated.button .hidden.content {\n  transition: right var(--animation-duration) var(--animation-easing) 0s;\n}\n.animated.button .visible.content {\n  left: auto;\n  right: 0%;\n}\n.animated.button .hidden.content {\n  top: 50%;\n  left: auto;\n  right: -100%;\n  margin-top: calc(var(--line-height) / 2 * -1);\n}\n.animated.button:focus .visible.content,\n.animated.button:hover .visible.content {\n  left: auto;\n  right: 200%;\n}\n.animated.button:focus .hidden.content,\n.animated.button:hover .hidden.content {\n  left: auto;\n  right: 0%;\n}\n.vertical.animated.button .visible.content,\n.vertical.animated.button .hidden.content {\n  transition: top var(--animation-duration) var(--animation-easing), transform var(--animation-duration) var(--animation-easing);\n}\n.vertical.animated.button .visible.content {\n  transform: translateY(0%);\n  right: auto;\n}\n.vertical.animated.button .hidden.content {\n  top: -50%;\n  left: 0%;\n  right: auto;\n}\n.vertical.animated.button:focus .visible.content,\n.vertical.animated.button:hover .visible.content {\n  transform: translateY(200%);\n  right: auto;\n}\n.vertical.animated.button:focus .hidden.content,\n.vertical.animated.button:hover .hidden.content {\n  top: 50%;\n  right: auto;\n}\n.fade.animated.button .visible.content,\n.fade.animated.button .hidden.content {\n  transition: opacity var(--animation-duration) var(--animation-easing), transform var(--animation-duration) var(--animation-easing);\n}\n.fade.animated.button .visible.content {\n  left: auto;\n  right: auto;\n  opacity: 1;\n  transform: scale(1);\n}\n.fade.animated.button .hidden.content {\n  opacity: 0;\n  left: 0%;\n  right: auto;\n  transform: scale(var(--fade-scale-high));\n}\n.fade.animated.button:focus .visible.content,\n.fade.animated.button:hover .visible.content {\n  left: auto;\n  right: auto;\n  opacity: 0;\n  transform: scale(var(--fade-scale-low));\n}\n.fade.animated.button:focus .hidden.content,\n.fade.animated.button:hover .hidden.content {\n  left: 0%;\n  right: auto;\n  opacity: 1;\n  transform: scale(1);\n}\n\n/* src/button/css/types/emphasis.css */\n.primary.buttons .button,\n.primary.button {\n  background-color: var(--primary-color);\n  color: var(--primary-text-color);\n  text-shadow: var(--primary-text-shadow);\n  background-image: var(--primary-background-image);\n}\n.primary.button {\n  box-shadow: var(--primary-box-shadow);\n}\n.primary.buttons .button:hover,\n.primary.button:hover {\n  background-color: var(--primary-color-hover);\n  color: var(--primary-text-color);\n  text-shadow: var(--primary-text-shadow);\n}\n.primary.buttons .button:focus,\n.primary.button:focus {\n  background-color: var(--primary-color-focus);\n  color: var(--primary-text-color);\n  text-shadow: var(--primary-text-shadow);\n}\n.primary.buttons .button:active,\n.primary.button:active {\n  background-color: var(--primary-color-down);\n  color: var(--primary-text-color);\n  text-shadow: var(--primary-text-shadow);\n}\n.primary.buttons .active.button,\n.primary.buttons .active.button:active,\n.primary.active.button,\n.primary.button .active.button:active {\n  background-color: var(--primary-color-active);\n  color: var(--primary-text-color);\n  text-shadow: var(--primary-text-shadow);\n}\n.secondary.buttons .button,\n.secondary.button {\n  background-color: var(--secondary-color);\n  color: var(--secondary-text-color);\n  text-shadow: var(--secondary-text-shadow);\n  background-image: var(--colored-background-image);\n}\n.secondary.button {\n  box-shadow: var(--colored-box-shadow);\n}\n.secondary.buttons .button:hover,\n.secondary.button:hover {\n  background-color: var(--secondary-color-hover);\n  color: var(--secondary-text-color);\n  text-shadow: var(--secondary-text-shadow);\n}\n.secondary.buttons .button:focus,\n.secondary.button:focus {\n  background-color: var(--secondary-color-focus);\n  color: var(--secondary-text-color);\n  text-shadow: var(--secondary-text-shadow);\n}\n.secondary.buttons .button:active,\n.secondary.button:active {\n  background-color: var(--secondary-color-down);\n  color: var(--secondary-text-color);\n  text-shadow: var(--secondary-text-shadow);\n}\n.secondary.buttons .active.button,\n.secondary.buttons .active.button:active,\n.secondary.active.button,\n.secondary.button .active.button:active {\n  background-color: var(--secondary-color-active);\n  color: var(--secondary-text-color);\n  text-shadow: var(--secondary-text-shadow);\n}\n\n/* src/button/css/types/icon.css */\n.icon.buttons .button,\n.icon.button {\n  padding: var(--vertical-padding) var(--vertical-padding) (var(--vertical-padding) + var(--shadow-offset));\n}\n.icon.buttons .button > .icon,\n.icon.button > .icon {\n  opacity: var(--icon-button-opacity);\n  margin: 0em !important;\n  vertical-align: top;\n}\n\n/* src/button/css/types/labeled.css */\n.labeled.button:not(.icon) {\n  display: inline-flex;\n  flex-direction: row;\n  background: none !important;\n  padding: 0px !important;\n  border: none !important;\n  box-shadow: none !important;\n}\n.labeled.button > .button {\n  margin: 0px;\n}\n.labeled.button > .label {\n  display: flex;\n  align-items: var(--labeled-label-align);\n  margin: 0px 0px 0px var(--labeled-label-border-offset) !important;\n  padding: var(--labeled-label-padding);\n  font-size: var(--labeled-label-font-size);\n  border-color: var(--labeled-label-border-color);\n}\n.labeled.button > .tag.label::before {\n  width: var(--labeled-tag-label-size);\n  height: var(--labeled-tag-label-size);\n}\n.labeled.button:not([class*="left labeled"]) > .button {\n  border-top-right-radius: 0px;\n  border-bottom-right-radius: 0px;\n}\n.labeled.button:not([class*="left labeled"]) > .label {\n  border-top-left-radius: 0px;\n  border-bottom-left-radius: 0px;\n}\n[class*="left labeled"].button > .button {\n  border-top-left-radius: 0px;\n  border-bottom-left-radius: 0px;\n}\n[class*="left labeled"].button > .label {\n  border-top-right-radius: 0px;\n  border-bottom-right-radius: 0px;\n}\n\n/* src/button/css/types/labeled-icon.css */\n.labeled.icon.buttons .button,\n.labeled.icon.button {\n  position: relative;\n  padding-left: var(--labeled-icon-padding) !important;\n  padding-right: var(--horizontal-padding) !important;\n}\n.labeled.icon.buttons > .button > .icon,\n.labeled.icon.button > .icon {\n  position: absolute;\n  height: 100%;\n  line-height: 1;\n  border-radius: 0px;\n  border-top-left-radius: inherit;\n  border-bottom-left-radius: inherit;\n  text-align: center;\n  margin: var(--labeled-icon-margin);\n  width: var(--labeled-icon-width);\n  background-color: var(--labeled-icon-background-color);\n  color: var(--labeled-icon-color);\n  box-shadow: var(--labeled-icon-left-shadow);\n}\n.labeled.icon.buttons > .button > .icon,\n.labeled.icon.button > .icon {\n  top: 0em;\n  left: 0em;\n}\n[class*="right labeled"].icon.button {\n  padding-right: var(--labeled-icon-padding) !important;\n  padding-left: var(--horizontal-padding) !important;\n}\n[class*="right labeled"].icon.button > .icon {\n  left: auto;\n  right: 0em;\n  border-radius: 0px;\n  border-top-right-radius: inherit;\n  border-bottom-right-radius: inherit;\n  box-shadow: var(--labeled-icon-right-shadow);\n}\n.labeled.icon.buttons > .button > .icon::before,\n.labeled.icon.button > .icon::before,\n.labeled.icon.buttons > .button > .icon::after,\n.labeled.icon.button > .icon::after {\n  display: block;\n  position: absolute;\n  width: 100%;\n  top: 50%;\n  text-align: center;\n  transform: translateY(-50%);\n}\n.labeled.icon.button > .icon.loading {\n  animation: none;\n}\n.labeled.icon.button > .icon.loading::before {\n  animation: labeled-button-icon-loading var(--loading-icon-duration) linear infinite;\n}\n@keyframes labeled-button-icon-loading {\n  from {\n    transform: translateY(-50%) rotate(0deg);\n  }\n  to {\n    transform: translateY(-50%) rotate(360deg);\n  }\n}\n.labeled.icon.buttons .button > .icon {\n  border-radius: 0em;\n}\n.labeled.icon.buttons .button:first-child > .icon {\n  border-top-left-radius: var(--border-radius);\n  border-bottom-left-radius: var(--border-radius);\n}\n.labeled.icon.buttons .button:last-child > .icon {\n  border-top-right-radius: var(--border-radius);\n  border-bottom-right-radius: var(--border-radius);\n}\n.vertical.labeled.icon.buttons .button:first-child > .icon {\n  border-radius: 0em;\n  border-top-left-radius: var(--border-radius);\n}\n.vertical.labeled.icon.buttons .button:last-child > .icon {\n  border-radius: 0em;\n  border-bottom-left-radius: var(--border-radius);\n}\n.fluid[class*="left labeled"].icon.button,\n.fluid[class*="right labeled"].icon.button {\n  padding-left: var(--horizontal-padding) !important;\n  padding-right: var(--horizontal-padding) !important;\n}\n\n/* src/button/css/types/toggle.css */\n.toggle.buttons .active.button,\n.buttons .button.toggle.active,\n.button.toggle.active {\n  background-color: var(--positive-color) !important;\n  box-shadow: none !important;\n  text-shadow: var(--inverted-text-shadow);\n  color: var(--inverted-text-color) !important;\n}\n.button.toggle.active:hover {\n  background-color: var(--positive-color-hover) !important;\n  text-shadow: var(--inverted-text-shadow);\n  color: var(--inverted-text-color) !important;\n}\n\n/* src/button/css/states/hover.css */\n.button:hover {\n  background-color: var(--hover-background-color);\n  background-image: var(--hover-background-image);\n  box-shadow: var(--hover-box-shadow);\n  color: var(--hover-color);\n}\n.button:hover .icon {\n  opacity: var(--hover-icon-opacity);\n}\n\n/* src/button/css/states/focus.css */\n.button:focus {\n  background-color: var(--focus-background-color);\n  color: var(--focus-color);\n  background-image: var(--focus-background-image) !important;\n  box-shadow: var(--focus-box-shadow) !important;\n}\n.button:focus .icon {\n  opacity: var(--icon-focus-opacity);\n}\n\n/* src/button/css/states/pressed.css */\n.button:active,\n.active.button:active {\n  background-color: var(--pressed-background-color);\n  background-image: var(--pressed-background-image);\n  color: var(--pressed-color);\n  box-shadow: var(--pressed-box-shadow);\n}\n\n/* src/button/css/states/active.css */\n.active.button {\n  background-color: var(--active-background-color);\n  background-image: var(--active-background-image);\n  box-shadow: var(--active-box-shadow);\n  color: var(--active-color);\n}\n.active.button:hover {\n  background-color: var(--active-hover-background-color);\n  background-image: var(--active-hover-background-image);\n  color: var(--active-hover-color);\n  box-shadow: var(--active-hover-box-shadow);\n}\n.active.button:active {\n  background-color: var(--active-down-background-color);\n  background-image: var(--active-down-background-image);\n  color: var(--active-down-color);\n  box-shadow: var(--active-down-box-shadow);\n}\n\n/* src/button/css/states/disabled.css */\n.disabled.button,\n.disabled.button:hover,\n.disabled.active.button {\n  cursor: default;\n  pointer-events: none !important;\n  opacity: var(--disabled-opacity) !important;\n  background-image: var(--disabled-background-image) !important;\n  box-shadow: var(--disabled-background-image) !important;\n}\n\n/* src/button/css/states/loading.css */\n.loading.button {\n  position: relative;\n  cursor: default;\n  text-shadow: none !important;\n  color: transparent !important;\n  opacity: var(--loading-opacity);\n  pointer-events: var(--loading-pointer-events);\n  transition: var(--loading-transition);\n}\n.loading.button::before {\n  position: absolute;\n  content: "";\n  top: 50%;\n  left: 50%;\n  margin: var(--loader-margin);\n  width: var(--loader-size);\n  height: var(--loader-size);\n  border-radius: var(--circular-radius);\n  border: var(--loader-line-width) solid var(--inverted-loader-fill-color);\n}\n.loading.button::after {\n  position: absolute;\n  content: "";\n  top: 50%;\n  left: 50%;\n  margin: var(--loader-margin);\n  width: var(--loader-size);\n  height: var(--loader-size);\n  animation: button-spin var(--loader-speed-linear);\n  animation-iteration-count: infinite;\n  border-radius: var(--circular-radius);\n  border-color: var(--inverted-loader-line-color) transparent transparent;\n  border-style: solid;\n  border-width: var(--loader-line-width);\n  box-shadow: 0px 0px 0px 1px transparent;\n}\n@keyframes button-spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n/* src/button/css/variations/basic.css */\n.basic.buttons .button,\n.basic.button {\n  background: var(--basic-background) !important;\n  color: var(--basic-text-color) !important;\n  font-weight: var(--basic-font-weight);\n  border-radius: var(--basic-border-radius);\n  text-transform: var(--basic-text-transform);\n  text-shadow: none !important;\n  box-shadow: var(--basic-box-shadow);\n}\n.basic.buttons {\n  box-shadow: var(--basic-group-box-shadow);\n  border: var(--basic-group-border);\n  border-radius: var(--border-radius);\n}\n.basic.buttons .button {\n  border-radius: 0em;\n}\n.basic.buttons .button:hover,\n.basic.button:hover {\n  background: var(--basic-hover-background) !important;\n  color: var(--basic-hover-text-color) !important;\n  box-shadow: var(--basic-hover-box-shadow);\n}\n.basic.buttons .button:focus,\n.basic.button:focus {\n  background: var(--basic-focus-background) !important;\n  color: var(--basic-focus-text-color) !important;\n  box-shadow: var(--basic-focus-box-shadow);\n}\n.basic.buttons .button:active,\n.basic.button:active {\n  background: var(--basic-down-background) !important;\n  color: var(--basic-down-text-color) !important;\n  box-shadow: var(--basic-down-box-shadow);\n}\n.basic.buttons .active.button,\n.basic.active.button {\n  background: var(--basic-active-background) !important;\n  box-shadow: var(--basic-active-box-shadow) !important;\n  color: var(--basic-active-text-color) !important;\n}\n.basic.buttons .active.button:hover,\n.basic.active.button:hover {\n  background-color: var(--transparent-black);\n}\n.basic.buttons .button:hover {\n  box-shadow: var(--basic-hover-box-shadow) inset;\n}\n.basic.buttons .button:active {\n  box-shadow: var(--basic-down-box-shadow) inset;\n}\n.basic.buttons .active.button {\n  box-shadow: var(--basic-active-box-shadow) !important;\n}\n.basic.inverted.buttons .button,\n.basic.inverted.button {\n  background-color: transparent !important;\n  color: var(--off-white) !important;\n  box-shadow: var(--basic-inverted-box-shadow) !important;\n}\n.basic.inverted.buttons .button:hover,\n.basic.inverted.button:hover {\n  color: var(--white) !important;\n  box-shadow: var(--basic-inverted-hover-box-shadow) !important;\n}\n.basic.inverted.buttons .button:focus,\n.basic.inverted.button:focus {\n  color: var(--white) !important;\n  box-shadow: var(--basic-inverted-focus-box-shadow) !important;\n}\n.basic.inverted.buttons .button:active,\n.basic.inverted.button:active {\n  background-color: var(--transparent-white) !important;\n  color: var(--white) !important;\n  box-shadow: var(--basic-inverted-down-box-shadow) !important;\n}\n.basic.inverted.buttons .active.button,\n.basic.inverted.active.button {\n  background-color: var(--transparent-white);\n  color: var(--inverted-text-color);\n  text-shadow: var(--inverted-text-shadow);\n  box-shadow: var(--basic-inverted-active-box-shadow);\n}\n.basic.inverted.buttons .active.button:hover,\n.basic.inverted.active.button:hover {\n  background-color: var(--strong-transparent-white);\n  box-shadow: var(--basic-inverted-hover-box-shadow) !important;\n}\n.basic.buttons .button {\n  border-left: var(--basic-group-border);\n  box-shadow: none;\n}\n.basic.vertical.buttons .button {\n  border-left: none;\n}\n.basic.vertical.buttons .button {\n  border-left-width: 0px;\n  border-top: var(--basic-group-border);\n}\n.basic.vertical.buttons .button:first-child {\n  border-top-width: 0px;\n}\n\n/* src/button/css/variations/attached.css */\n.attached.button {\n  position: relative;\n  display: block;\n  margin: 0em;\n  border-radius: 0em;\n  box-shadow: var(--attached-box-shadow) !important;\n}\n.attached.top.button {\n  border-radius: var(--border-radius) var(--border-radius) 0em 0em;\n}\n.attached.bottom.button {\n  border-radius: 0em 0em var(--border-radius) var(--border-radius);\n}\n.left.attached.button {\n  display: inline-block;\n  border-left: none;\n  text-align: right;\n  padding-right: var(--attached-horizontal-padding);\n  border-radius: var(--border-radius) 0em 0em var(--border-radius);\n}\n.right.attached.button {\n  display: inline-block;\n  text-align: left;\n  padding-left: var(--attached-horizontal-padding);\n  border-radius: 0em var(--border-radius) var(--border-radius) 0em;\n}\n.attached.buttons {\n  position: relative;\n  display: flex;\n  border-radius: 0em;\n  width: auto !important;\n  z-index: var(--attached-z-index);\n  margin-left: var(--attached-offset);\n  margin-right: var(--attached-offset);\n}\n.attached.buttons .button {\n  margin: 0em;\n}\n.attached.buttons .button:first-child {\n  border-radius: 0em;\n}\n.attached.buttons .button:last-child {\n  border-radius: 0em;\n}\n[class*="top attached"].buttons {\n  margin-bottom: var(--attached-offset);\n  border-radius: var(--border-radius) var(--border-radius) 0em 0em;\n}\n[class*="top attached"].buttons .button:first-child {\n  border-radius: var(--border-radius) 0em 0em 0em;\n}\n[class*="top attached"].buttons .button:last-child {\n  border-radius: 0em var(--border-radius) 0em 0em;\n}\n[class*="bottom attached"].buttons {\n  margin-top: var(--attached-offset);\n  border-radius: 0em 0em var(--border-radius) var(--border-radius);\n}\n[class*="bottom attached"].buttons .button:first-child {\n  border-radius: 0em 0em 0em var(--border-radius);\n}\n[class*="bottom attached"].buttons .button:last-child {\n  border-radius: 0em 0em var(--border-radius) 0em;\n}\n[class*="left attached"].buttons {\n  display: inline-flex;\n  margin-right: 0em;\n  margin-left: var(--attached-offset);\n  border-radius: 0em var(--border-radius) var(--border-radius) 0em;\n}\n[class*="left attached"].buttons .button:first-child {\n  margin-left: var(--attached-offset);\n  border-radius: 0em var(--border-radius) 0em 0em;\n}\n[class*="left attached"].buttons .button:last-child {\n  margin-left: var(--attached-offset);\n  border-radius: 0em 0em var(--border-radius) 0em;\n}\n[class*="right attached"].buttons {\n  display: inline-flex;\n  margin-left: 0em;\n  margin-right: var(--attached-offset);\n  border-radius: var(--border-radius) 0em 0em var(--border-radius);\n}\n[class*="right attached"].buttons .button:first-child {\n  margin-left: var(--attached-offset);\n  border-radius: var(--border-radius) 0em 0em 0em;\n}\n[class*="right attached"].buttons .button:last-child {\n  margin-left: var(--attached-offset);\n  border-radius: 0em 0em 0em var(--border-radius);\n}\n\n/* src/button/css/variations/circular.css */\n.circular.button {\n  border-radius: 10em;\n}\n.circular.button > .icon {\n  width: 1em;\n  vertical-align: baseline;\n}\n\n/* src/button/css/variations/colored.css */\n.black.buttons .button,\n.black.button {\n  background-color: var(--black);\n  color: var(--black-text-color);\n  text-shadow: var(--black-text-shadow);\n  background-image: var(--colored-background-image);\n}\n.black.button {\n  box-shadow: var(--colored-box-shadow);\n}\n.black.buttons .button:hover,\n.black.button:hover {\n  background-color: var(--black-hover);\n  color: var(--black-text-color);\n  text-shadow: var(--black-text-shadow);\n}\n.black.buttons .button:focus,\n.black.button:focus {\n  background-color: var(--black-focus);\n  color: var(--black-text-color);\n  text-shadow: var(--black-text-shadow);\n}\n.black.buttons .button:active,\n.black.button:active {\n  background-color: var(--black-down);\n  color: var(--black-text-color);\n  text-shadow: var(--black-text-shadow);\n}\n.black.buttons .active.button,\n.black.buttons .active.button:active,\n.black.active.button,\n.black.button .active.button:active {\n  background-color: var(--black-active);\n  color: var(--black-text-color);\n  text-shadow: var(--black-text-shadow);\n}\n.basic.black.buttons .button,\n.basic.black.button {\n  box-shadow: 0px 0px 0px var(--basic-border-size) var(--black) inset !important;\n  color: var(--black) !important;\n}\n.basic.black.buttons .button:hover,\n.basic.black.button:hover {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--black-hover) inset !important;\n  color: var(--black-hover) !important;\n}\n.basic.black.buttons .button:focus,\n.basic.black.button:focus {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--black-focus) inset !important;\n  color: var(--black-hover) !important;\n}\n.basic.black.buttons .active.button,\n.basic.black.active.button {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--black-active) inset !important;\n  color: var(--black-down) !important;\n}\n.basic.black.buttons .button:active,\n.basic.black.button:active {\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--black-down) inset !important;\n  color: var(--black-down) !important;\n}\n.buttons:not(.vertical) > .basic.black.button:not(:first-child) {\n  margin-left: var(--basic-colored-border-size);\n}\n.inverted.black.buttons .button,\n.inverted.black.button {\n  background-color: transparent;\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--solid-border-color) inset !important;\n  color: var(--inverted-text-color);\n}\n.inverted.black.buttons .button:hover,\n.inverted.black.button:hover,\n.inverted.black.buttons .button:focus,\n.inverted.black.button:focus,\n.inverted.black.buttons .button.active,\n.inverted.black.button.active,\n.inverted.black.buttons .button:active,\n.inverted.black.button:active {\n  box-shadow: none !important;\n  color: var(--light-black-text-color);\n}\n.inverted.black.buttons .button:hover,\n.inverted.black.button:hover {\n  background-color: var(--light-black-hover);\n}\n.inverted.black.buttons .button:focus,\n.inverted.black.button:focus {\n  background-color: var(--light-black-focus);\n}\n.inverted.black.buttons .active.button,\n.inverted.black.active.button {\n  background-color: var(--light-black-active);\n}\n.inverted.black.buttons .button:active,\n.inverted.black.button:active {\n  background-color: var(--light-black-down);\n}\n.inverted.black.basic.buttons .button,\n.inverted.black.buttons .basic.button,\n.inverted.black.basic.button {\n  background-color: transparent;\n  box-shadow: var(--basic-inverted-box-shadow) !important;\n  color: var(--white) !important;\n}\n.inverted.black.basic.buttons .button:hover,\n.inverted.black.buttons .basic.button:hover,\n.inverted.black.basic.button:hover {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-black-hover) inset !important;\n  color: var(--white) !important;\n}\n.inverted.black.basic.buttons .button:focus,\n.inverted.black.basic.buttons .button:focus,\n.inverted.black.basic.button:focus {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-black-focus) inset !important;\n  color: var(--light-black) !important;\n}\n.inverted.black.basic.buttons .active.button,\n.inverted.black.buttons .basic.active.button,\n.inverted.black.basic.active.button {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-black-active) inset !important;\n  color: var(--white) !important;\n}\n.inverted.black.basic.buttons .button:active,\n.inverted.black.buttons .basic.button:active,\n.inverted.black.basic.button:active {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-black-down) inset !important;\n  color: var(--white) !important;\n}\n.grey.buttons .button,\n.grey.button {\n  background-color: var(--grey);\n  color: var(--grey-text-color);\n  text-shadow: var(--grey-text-shadow);\n  background-image: var(--colored-background-image);\n}\n.grey.button {\n  box-shadow: var(--colored-box-shadow);\n}\n.grey.buttons .button:hover,\n.grey.button:hover {\n  background-color: var(--grey-hover);\n  color: var(--grey-text-color);\n  text-shadow: var(--grey-text-shadow);\n}\n.grey.buttons .button:focus,\n.grey.button:focus {\n  background-color: var(--grey-focus);\n  color: var(--grey-text-color);\n  text-shadow: var(--grey-text-shadow);\n}\n.grey.buttons .button:active,\n.grey.button:active {\n  background-color: var(--grey-down);\n  color: var(--grey-text-color);\n  text-shadow: var(--grey-text-shadow);\n}\n.grey.buttons .active.button,\n.grey.buttons .active.button:active,\n.grey.active.button,\n.grey.button .active.button:active {\n  background-color: var(--grey-active);\n  color: var(--grey-text-color);\n  text-shadow: var(--grey-text-shadow);\n}\n.basic.grey.buttons .button,\n.basic.grey.button {\n  box-shadow: 0px 0px 0px var(--basic-border-size) var(--grey) inset !important;\n  color: var(--grey) !important;\n}\n.basic.grey.buttons .button:hover,\n.basic.grey.button:hover {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--grey-hover) inset !important;\n  color: var(--grey-hover) !important;\n}\n.basic.grey.buttons .button:focus,\n.basic.grey.button:focus {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--grey-focus) inset !important;\n  color: var(--grey-hover) !important;\n}\n.basic.grey.buttons .active.button,\n.basic.grey.active.button {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--grey-active) inset !important;\n  color: var(--grey-down) !important;\n}\n.basic.grey.buttons .button:active,\n.basic.grey.button:active {\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--grey-down) inset !important;\n  color: var(--grey-down) !important;\n}\n.buttons:not(.vertical) > .basic.grey.button:not(:first-child) {\n  margin-left: var(--basic-colored-border-size);\n}\n.inverted.grey.buttons .button,\n.inverted.grey.button {\n  background-color: transparent;\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--solid-border-color) inset !important;\n  color: var(--inverted-text-color);\n}\n.inverted.grey.buttons .button:hover,\n.inverted.grey.button:hover,\n.inverted.grey.buttons .button:focus,\n.inverted.grey.button:focus,\n.inverted.grey.buttons .button.active,\n.inverted.grey.button.active,\n.inverted.grey.buttons .button:active,\n.inverted.grey.button:active {\n  box-shadow: none !important;\n  color: var(--light-grey-text-color);\n}\n.inverted.grey.buttons .button:hover,\n.inverted.grey.button:hover {\n  background-color: var(--light-grey-hover);\n}\n.inverted.grey.buttons .button:focus,\n.inverted.grey.button:focus {\n  background-color: var(--light-grey-focus);\n}\n.inverted.grey.buttons .active.button,\n.inverted.grey.active.button {\n  background-color: var(--light-grey-active);\n}\n.inverted.grey.buttons .button:active,\n.inverted.grey.button:active {\n  background-color: var(--light-grey-down);\n}\n.inverted.grey.basic.buttons .button,\n.inverted.grey.buttons .basic.button,\n.inverted.grey.basic.button {\n  background-color: transparent;\n  box-shadow: var(--basic-inverted-box-shadow) !important;\n  color: var(--white) !important;\n}\n.inverted.grey.basic.buttons .button:hover,\n.inverted.grey.buttons .basic.button:hover,\n.inverted.grey.basic.button:hover {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-grey-hover) inset !important;\n  color: var(--white) !important;\n}\n.inverted.grey.basic.buttons .button:focus,\n.inverted.grey.basic.buttons .button:focus,\n.inverted.grey.basic.button:focus {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-grey-focus) inset !important;\n  color: var(--light-grey) !important;\n}\n.inverted.grey.basic.buttons .active.button,\n.inverted.grey.buttons .basic.active.button,\n.inverted.grey.basic.active.button {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-grey-active) inset !important;\n  color: var(--white) !important;\n}\n.inverted.grey.basic.buttons .button:active,\n.inverted.grey.buttons .basic.button:active,\n.inverted.grey.basic.button:active {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-grey-down) inset !important;\n  color: var(--white) !important;\n}\n.brown.buttons .button,\n.brown.button {\n  background-color: var(--brown);\n  color: var(--brown-text-color);\n  text-shadow: var(--brown-text-shadow);\n  background-image: var(--colored-background-image);\n}\n.brown.button {\n  box-shadow: var(--colored-box-shadow);\n}\n.brown.buttons .button:hover,\n.brown.button:hover {\n  background-color: var(--brown-hover);\n  color: var(--brown-text-color);\n  text-shadow: var(--brown-text-shadow);\n}\n.brown.buttons .button:focus,\n.brown.button:focus {\n  background-color: var(--brown-focus);\n  color: var(--brown-text-color);\n  text-shadow: var(--brown-text-shadow);\n}\n.brown.buttons .button:active,\n.brown.button:active {\n  background-color: var(--brown-down);\n  color: var(--brown-text-color);\n  text-shadow: var(--brown-text-shadow);\n}\n.brown.buttons .active.button,\n.brown.buttons .active.button:active,\n.brown.active.button,\n.brown.button .active.button:active {\n  background-color: var(--brown-active);\n  color: var(--brown-text-color);\n  text-shadow: var(--brown-text-shadow);\n}\n.basic.brown.buttons .button,\n.basic.brown.button {\n  box-shadow: 0px 0px 0px var(--basic-border-size) var(--brown) inset !important;\n  color: var(--brown) !important;\n}\n.basic.brown.buttons .button:hover,\n.basic.brown.button:hover {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--brown-hover) inset !important;\n  color: var(--brown-hover) !important;\n}\n.basic.brown.buttons .button:focus,\n.basic.brown.button:focus {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--brown-focus) inset !important;\n  color: var(--brown-hover) !important;\n}\n.basic.brown.buttons .active.button,\n.basic.brown.active.button {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--brown-active) inset !important;\n  color: var(--brown-down) !important;\n}\n.basic.brown.buttons .button:active,\n.basic.brown.button:active {\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--brown-down) inset !important;\n  color: var(--brown-down) !important;\n}\n.buttons:not(.vertical) > .basic.brown.button:not(:first-child) {\n  margin-left: var(--basic-colored-border-size);\n}\n.inverted.brown.buttons .button,\n.inverted.brown.button {\n  background-color: transparent;\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-brown) inset !important;\n  color: var(--light-brown);\n}\n.inverted.brown.buttons .button:hover,\n.inverted.brown.button:hover,\n.inverted.brown.buttons .button:focus,\n.inverted.brown.button:focus,\n.inverted.brown.buttons .button.active,\n.inverted.brown.button.active,\n.inverted.brown.buttons .button:active,\n.inverted.brown.button:active {\n  box-shadow: none !important;\n  color: var(--light-brown-text-color);\n}\n.inverted.brown.buttons .button:hover,\n.inverted.brown.button:hover {\n  background-color: var(--light-brown-hover);\n}\n.inverted.brown.buttons .button:focus,\n.inverted.brown.button:focus {\n  background-color: var(--light-brown-focus);\n}\n.inverted.brown.buttons .active.button,\n.inverted.brown.active.button {\n  background-color: var(--light-brown-active);\n}\n.inverted.brown.buttons .button:active,\n.inverted.brown.button:active {\n  background-color: var(--light-brown-down);\n}\n.inverted.brown.basic.buttons .button,\n.inverted.brown.buttons .basic.button,\n.inverted.brown.basic.button {\n  background-color: transparent;\n  box-shadow: var(--basic-inverted-box-shadow) !important;\n  color: var(--white) !important;\n}\n.inverted.brown.basic.buttons .button:hover,\n.inverted.brown.buttons .basic.button:hover,\n.inverted.brown.basic.button:hover {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-brown-hover) inset !important;\n  color: var(--light-brown) !important;\n}\n.inverted.brown.basic.buttons .button:focus,\n.inverted.brown.basic.buttons .button:focus,\n.inverted.brown.basic.button:focus {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-brown-focus) inset !important;\n  color: var(--light-brown) !important;\n}\n.inverted.brown.basic.buttons .active.button,\n.inverted.brown.buttons .basic.active.button,\n.inverted.brown.basic.active.button {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-brown-active) inset !important;\n  color: var(--light-brown) !important;\n}\n.inverted.brown.basic.buttons .button:active,\n.inverted.brown.buttons .basic.button:active,\n.inverted.brown.basic.button:active {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-brown-down) inset !important;\n  color: var(--light-brown) !important;\n}\n.blue.buttons .button,\n.blue.button {\n  background-color: var(--blue);\n  color: var(--blue-text-color);\n  text-shadow: var(--blue-text-shadow);\n  background-image: var(--colored-background-image);\n}\n.blue.button {\n  box-shadow: var(--colored-box-shadow);\n}\n.blue.buttons .button:hover,\n.blue.button:hover {\n  background-color: var(--blue-hover);\n  color: var(--blue-text-color);\n  text-shadow: var(--blue-text-shadow);\n}\n.blue.buttons .button:focus,\n.blue.button:focus {\n  background-color: var(--blue-focus);\n  color: var(--blue-text-color);\n  text-shadow: var(--blue-text-shadow);\n}\n.blue.buttons .button:active,\n.blue.button:active {\n  background-color: var(--blue-down);\n  color: var(--blue-text-color);\n  text-shadow: var(--blue-text-shadow);\n}\n.blue.buttons .active.button,\n.blue.buttons .active.button:active,\n.blue.active.button,\n.blue.button .active.button:active {\n  background-color: var(--blue-active);\n  color: var(--blue-text-color);\n  text-shadow: var(--blue-text-shadow);\n}\n.basic.blue.buttons .button,\n.basic.blue.button {\n  box-shadow: 0px 0px 0px var(--basic-border-size) var(--blue) inset !important;\n  color: var(--blue) !important;\n}\n.basic.blue.buttons .button:hover,\n.basic.blue.button:hover {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--blue-hover) inset !important;\n  color: var(--blue-hover) !important;\n}\n.basic.blue.buttons .button:focus,\n.basic.blue.button:focus {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--blue-focus) inset !important;\n  color: var(--blue-hover) !important;\n}\n.basic.blue.buttons .active.button,\n.basic.blue.active.button {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--blue-active) inset !important;\n  color: var(--blue-down) !important;\n}\n.basic.blue.buttons .button:active,\n.basic.blue.button:active {\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--blue-down) inset !important;\n  color: var(--blue-down) !important;\n}\n.buttons:not(.vertical) > .basic.blue.button:not(:first-child) {\n  margin-left: var(--basic-colored-border-size);\n}\n.inverted.blue.buttons .button,\n.inverted.blue.button {\n  background-color: transparent;\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-blue) inset !important;\n  color: var(--light-blue);\n}\n.inverted.blue.buttons .button:hover,\n.inverted.blue.button:hover,\n.inverted.blue.buttons .button:focus,\n.inverted.blue.button:focus,\n.inverted.blue.buttons .button.active,\n.inverted.blue.button.active,\n.inverted.blue.buttons .button:active,\n.inverted.blue.button:active {\n  box-shadow: none !important;\n  color: var(--light-blue-text-color);\n}\n.inverted.blue.buttons .button:hover,\n.inverted.blue.button:hover {\n  background-color: var(--light-blue-hover);\n}\n.inverted.blue.buttons .button:focus,\n.inverted.blue.button:focus {\n  background-color: var(--light-blue-focus);\n}\n.inverted.blue.buttons .active.button,\n.inverted.blue.active.button {\n  background-color: var(--light-blue-active);\n}\n.inverted.blue.buttons .button:active,\n.inverted.blue.button:active {\n  background-color: var(--light-blue-down);\n}\n.inverted.blue.basic.buttons .button,\n.inverted.blue.buttons .basic.button,\n.inverted.blue.basic.button {\n  background-color: transparent;\n  box-shadow: var(--basic-inverted-box-shadow) !important;\n  color: var(--white) !important;\n}\n.inverted.blue.basic.buttons .button:hover,\n.inverted.blue.buttons .basic.button:hover,\n.inverted.blue.basic.button:hover {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-blue-hover) inset !important;\n  color: var(--light-blue) !important;\n}\n.inverted.blue.basic.buttons .button:focus,\n.inverted.blue.basic.buttons .button:focus,\n.inverted.blue.basic.button:focus {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-blue-focus) inset !important;\n  color: var(--light-blue) !important;\n}\n.inverted.blue.basic.buttons .active.button,\n.inverted.blue.buttons .basic.active.button,\n.inverted.blue.basic.active.button {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-blue-active) inset !important;\n  color: var(--light-blue) !important;\n}\n.inverted.blue.basic.buttons .button:active,\n.inverted.blue.buttons .basic.button:active,\n.inverted.blue.basic.button:active {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-blue-down) inset !important;\n  color: var(--light-blue) !important;\n}\n.green.buttons .button,\n.green.button {\n  background-color: var(--green);\n  color: var(--green-text-color);\n  text-shadow: var(--green-text-shadow);\n  background-image: var(--colored-background-image);\n}\n.green.button {\n  box-shadow: var(--colored-box-shadow);\n}\n.green.buttons .button:hover,\n.green.button:hover {\n  background-color: var(--green-hover);\n  color: var(--green-text-color);\n  text-shadow: var(--green-text-shadow);\n}\n.green.buttons .button:focus,\n.green.button:focus {\n  background-color: var(--green-focus);\n  color: var(--green-text-color);\n  text-shadow: var(--green-text-shadow);\n}\n.green.buttons .button:active,\n.green.button:active {\n  background-color: var(--green-down);\n  color: var(--green-text-color);\n  text-shadow: var(--green-text-shadow);\n}\n.green.buttons .active.button,\n.green.buttons .active.button:active,\n.green.active.button,\n.green.button .active.button:active {\n  background-color: var(--green-active);\n  color: var(--green-text-color);\n  text-shadow: var(--green-text-shadow);\n}\n.basic.green.buttons .button,\n.basic.green.button {\n  box-shadow: 0px 0px 0px var(--basic-border-size) var(--green) inset !important;\n  color: var(--green) !important;\n}\n.basic.green.buttons .button:hover,\n.basic.green.button:hover {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--green-hover) inset !important;\n  color: var(--green-hover) !important;\n}\n.basic.green.buttons .button:focus,\n.basic.green.button:focus {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--green-focus) inset !important;\n  color: var(--green-hover) !important;\n}\n.basic.green.buttons .active.button,\n.basic.green.active.button {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--green-active) inset !important;\n  color: var(--green-down) !important;\n}\n.basic.green.buttons .button:active,\n.basic.green.button:active {\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--green-down) inset !important;\n  color: var(--green-down) !important;\n}\n.buttons:not(.vertical) > .basic.green.button:not(:first-child) {\n  margin-left: var(--basic-colored-border-size);\n}\n.inverted.green.buttons .button,\n.inverted.green.button {\n  background-color: transparent;\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-green) inset !important;\n  color: var(--light-green);\n}\n.inverted.green.buttons .button:hover,\n.inverted.green.button:hover,\n.inverted.green.buttons .button:focus,\n.inverted.green.button:focus,\n.inverted.green.buttons .button.active,\n.inverted.green.button.active,\n.inverted.green.buttons .button:active,\n.inverted.green.button:active {\n  box-shadow: none !important;\n  color: var(--green-text-color);\n}\n.inverted.green.buttons .button:hover,\n.inverted.green.button:hover {\n  background-color: var(--light-green-hover);\n}\n.inverted.green.buttons .button:focus,\n.inverted.green.button:focus {\n  background-color: var(--light-green-focus);\n}\n.inverted.green.buttons .active.button,\n.inverted.green.active.button {\n  background-color: var(--light-green-active);\n}\n.inverted.green.buttons .button:active,\n.inverted.green.button:active {\n  background-color: var(--light-green-down);\n}\n.inverted.green.basic.buttons .button,\n.inverted.green.buttons .basic.button,\n.inverted.green.basic.button {\n  background-color: transparent;\n  box-shadow: var(--basic-inverted-box-shadow) !important;\n  color: var(--white) !important;\n}\n.inverted.green.basic.buttons .button:hover,\n.inverted.green.buttons .basic.button:hover,\n.inverted.green.basic.button:hover {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-green-hover) inset !important;\n  color: var(--light-green) !important;\n}\n.inverted.green.basic.buttons .button:focus,\n.inverted.green.basic.buttons .button:focus,\n.inverted.green.basic.button:focus {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-green-focus) inset !important;\n  color: var(--light-green) !important;\n}\n.inverted.green.basic.buttons .active.button,\n.inverted.green.buttons .basic.active.button,\n.inverted.green.basic.active.button {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-green-active) inset !important;\n  color: var(--light-green) !important;\n}\n.inverted.green.basic.buttons .button:active,\n.inverted.green.buttons .basic.button:active,\n.inverted.green.basic.button:active {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-green-down) inset !important;\n  color: var(--light-green) !important;\n}\n.orange.buttons .button,\n.orange.button {\n  background-color: var(--orange);\n  color: var(--orange-text-color);\n  text-shadow: var(--orange-text-shadow);\n  background-image: var(--colored-background-image);\n}\n.orange.button {\n  box-shadow: var(--colored-box-shadow);\n}\n.orange.buttons .button:hover,\n.orange.button:hover {\n  background-color: var(--orange-hover);\n  color: var(--orange-text-color);\n  text-shadow: var(--orange-text-shadow);\n}\n.orange.buttons .button:focus,\n.orange.button:focus {\n  background-color: var(--orange-focus);\n  color: var(--orange-text-color);\n  text-shadow: var(--orange-text-shadow);\n}\n.orange.buttons .button:active,\n.orange.button:active {\n  background-color: var(--orange-down);\n  color: var(--orange-text-color);\n  text-shadow: var(--orange-text-shadow);\n}\n.orange.buttons .active.button,\n.orange.buttons .active.button:active,\n.orange.active.button,\n.orange.button .active.button:active {\n  background-color: var(--orange-active);\n  color: var(--orange-text-color);\n  text-shadow: var(--orange-text-shadow);\n}\n.basic.orange.buttons .button,\n.basic.orange.button {\n  box-shadow: 0px 0px 0px var(--basic-border-size) var(--orange) inset !important;\n  color: var(--orange) !important;\n}\n.basic.orange.buttons .button:hover,\n.basic.orange.button:hover {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--orange-hover) inset !important;\n  color: var(--orange-hover) !important;\n}\n.basic.orange.buttons .button:focus,\n.basic.orange.button:focus {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--orange-focus) inset !important;\n  color: var(--orange-hover) !important;\n}\n.basic.orange.buttons .active.button,\n.basic.orange.active.button {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--orange-active) inset !important;\n  color: var(--orange-down) !important;\n}\n.basic.orange.buttons .button:active,\n.basic.orange.button:active {\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--orange-down) inset !important;\n  color: var(--orange-down) !important;\n}\n.buttons:not(.vertical) > .basic.orange.button:not(:first-child) {\n  margin-left: var(--basic-colored-border-size);\n}\n.inverted.orange.buttons .button,\n.inverted.orange.button {\n  background-color: transparent;\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-orange) inset !important;\n  color: var(--light-orange);\n}\n.inverted.orange.buttons .button:hover,\n.inverted.orange.button:hover,\n.inverted.orange.buttons .button:focus,\n.inverted.orange.button:focus,\n.inverted.orange.buttons .button.active,\n.inverted.orange.button.active,\n.inverted.orange.buttons .button:active,\n.inverted.orange.button:active {\n  box-shadow: none !important;\n  color: var(--light-orange-text-color);\n}\n.inverted.orange.buttons .button:hover,\n.inverted.orange.button:hover {\n  background-color: var(--light-orange-hover);\n}\n.inverted.orange.buttons .button:focus,\n.inverted.orange.button:focus {\n  background-color: var(--light-orange-focus);\n}\n.inverted.orange.buttons .active.button,\n.inverted.orange.active.button {\n  background-color: var(--light-orange-active);\n}\n.inverted.orange.buttons .button:active,\n.inverted.orange.button:active {\n  background-color: var(--light-orange-down);\n}\n.inverted.orange.basic.buttons .button,\n.inverted.orange.buttons .basic.button,\n.inverted.orange.basic.button {\n  background-color: transparent;\n  box-shadow: var(--basic-inverted-box-shadow) !important;\n  color: var(--white) !important;\n}\n.inverted.orange.basic.buttons .button:hover,\n.inverted.orange.buttons .basic.button:hover,\n.inverted.orange.basic.button:hover {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-orange-hover) inset !important;\n  color: var(--light-orange) !important;\n}\n.inverted.orange.basic.buttons .button:focus,\n.inverted.orange.basic.buttons .button:focus,\n.inverted.orange.basic.button:focus {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-orange-focus) inset !important;\n  color: var(--light-orange) !important;\n}\n.inverted.orange.basic.buttons .active.button,\n.inverted.orange.buttons .basic.active.button,\n.inverted.orange.basic.active.button {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-orange-active) inset !important;\n  color: var(--light-orange) !important;\n}\n.inverted.orange.basic.buttons .button:active,\n.inverted.orange.buttons .basic.button:active,\n.inverted.orange.basic.button:active {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-orange-down) inset !important;\n  color: var(--light-orange) !important;\n}\n.pink.buttons .button,\n.pink.button {\n  background-color: var(--pink);\n  color: var(--pink-text-color);\n  text-shadow: var(--pink-text-shadow);\n  background-image: var(--colored-background-image);\n}\n.pink.button {\n  box-shadow: var(--colored-box-shadow);\n}\n.pink.buttons .button:hover,\n.pink.button:hover {\n  background-color: var(--pink-hover);\n  color: var(--pink-text-color);\n  text-shadow: var(--pink-text-shadow);\n}\n.pink.buttons .button:focus,\n.pink.button:focus {\n  background-color: var(--pink-focus);\n  color: var(--pink-text-color);\n  text-shadow: var(--pink-text-shadow);\n}\n.pink.buttons .button:active,\n.pink.button:active {\n  background-color: var(--pink-down);\n  color: var(--pink-text-color);\n  text-shadow: var(--pink-text-shadow);\n}\n.pink.buttons .active.button,\n.pink.buttons .active.button:active,\n.pink.active.button,\n.pink.button .active.button:active {\n  background-color: var(--pink-active);\n  color: var(--pink-text-color);\n  text-shadow: var(--pink-text-shadow);\n}\n.basic.pink.buttons .button,\n.basic.pink.button {\n  box-shadow: 0px 0px 0px var(--basic-border-size) var(--pink) inset !important;\n  color: var(--pink) !important;\n}\n.basic.pink.buttons .button:hover,\n.basic.pink.button:hover {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--pink-hover) inset !important;\n  color: var(--pink-hover) !important;\n}\n.basic.pink.buttons .button:focus,\n.basic.pink.button:focus {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--pink-focus) inset !important;\n  color: var(--pink-hover) !important;\n}\n.basic.pink.buttons .active.button,\n.basic.pink.active.button {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--pink-active) inset !important;\n  color: var(--pink-down) !important;\n}\n.basic.pink.buttons .button:active,\n.basic.pink.button:active {\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--pink-down) inset !important;\n  color: var(--pink-down) !important;\n}\n.buttons:not(.vertical) > .basic.pink.button:not(:first-child) {\n  margin-left: var(--basic-colored-border-size);\n}\n.inverted.pink.buttons .button,\n.inverted.pink.button {\n  background-color: transparent;\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-pink) inset !important;\n  color: var(--light-pink);\n}\n.inverted.pink.buttons .button:hover,\n.inverted.pink.button:hover,\n.inverted.pink.buttons .button:focus,\n.inverted.pink.button:focus,\n.inverted.pink.buttons .button.active,\n.inverted.pink.button.active,\n.inverted.pink.buttons .button:active,\n.inverted.pink.button:active {\n  box-shadow: none !important;\n  color: var(--light-pink-text-color);\n}\n.inverted.pink.buttons .button:hover,\n.inverted.pink.button:hover {\n  background-color: var(--light-pink-hover);\n}\n.inverted.pink.buttons .button:focus,\n.inverted.pink.button:focus {\n  background-color: var(--light-pink-focus);\n}\n.inverted.pink.buttons .active.button,\n.inverted.pink.active.button {\n  background-color: var(--light-pink-active);\n}\n.inverted.pink.buttons .button:active,\n.inverted.pink.button:active {\n  background-color: var(--light-pink-down);\n}\n.inverted.pink.basic.buttons .button,\n.inverted.pink.buttons .basic.button,\n.inverted.pink.basic.button {\n  background-color: transparent;\n  box-shadow: var(--basic-inverted-box-shadow) !important;\n  color: var(--white) !important;\n}\n.inverted.pink.basic.buttons .button:hover,\n.inverted.pink.buttons .basic.button:hover,\n.inverted.pink.basic.button:hover {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-pink-hover) inset !important;\n  color: var(--light-pink) !important;\n}\n.inverted.pink.basic.buttons .button:focus,\n.inverted.pink.basic.buttons .button:focus,\n.inverted.pink.basic.button:focus {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-pink-focus) inset !important;\n  color: var(--light-pink) !important;\n}\n.inverted.pink.basic.buttons .active.button,\n.inverted.pink.buttons .basic.active.button,\n.inverted.pink.basic.active.button {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-pink-active) inset !important;\n  color: var(--light-pink) !important;\n}\n.inverted.pink.basic.buttons .button:active,\n.inverted.pink.buttons .basic.button:active,\n.inverted.pink.basic.button:active {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-pink-down) inset !important;\n  color: var(--light-pink) !important;\n}\n.violet.buttons .button,\n.violet.button {\n  background-color: var(--violet);\n  color: var(--violet-text-color);\n  text-shadow: var(--violet-text-shadow);\n  background-image: var(--colored-background-image);\n}\n.violet.button {\n  box-shadow: var(--colored-box-shadow);\n}\n.violet.buttons .button:hover,\n.violet.button:hover {\n  background-color: var(--violet-hover);\n  color: var(--violet-text-color);\n  text-shadow: var(--violet-text-shadow);\n}\n.violet.buttons .button:focus,\n.violet.button:focus {\n  background-color: var(--violet-focus);\n  color: var(--violet-text-color);\n  text-shadow: var(--violet-text-shadow);\n}\n.violet.buttons .button:active,\n.violet.button:active {\n  background-color: var(--violet-down);\n  color: var(--violet-text-color);\n  text-shadow: var(--violet-text-shadow);\n}\n.violet.buttons .active.button,\n.violet.buttons .active.button:active,\n.violet.active.button,\n.violet.button .active.button:active {\n  background-color: var(--violet-active);\n  color: var(--violet-text-color);\n  text-shadow: var(--violet-text-shadow);\n}\n.basic.violet.buttons .button,\n.basic.violet.button {\n  box-shadow: 0px 0px 0px var(--basic-border-size) var(--violet) inset !important;\n  color: var(--violet) !important;\n}\n.basic.violet.buttons .button:hover,\n.basic.violet.button:hover {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--violet-hover) inset !important;\n  color: var(--violet-hover) !important;\n}\n.basic.violet.buttons .button:focus,\n.basic.violet.button:focus {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--violet-focus) inset !important;\n  color: var(--violet-hover) !important;\n}\n.basic.violet.buttons .active.button,\n.basic.violet.active.button {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--violet-active) inset !important;\n  color: var(--violet-down) !important;\n}\n.basic.violet.buttons .button:active,\n.basic.violet.button:active {\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--violet-down) inset !important;\n  color: var(--violet-down) !important;\n}\n.buttons:not(.vertical) > .basic.violet.button:not(:first-child) {\n  margin-left: var(--basic-colored-border-size);\n}\n.inverted.violet.buttons .button,\n.inverted.violet.button {\n  background-color: transparent;\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-violet) inset !important;\n  color: var(--light-violet);\n}\n.inverted.violet.buttons .button:hover,\n.inverted.violet.button:hover,\n.inverted.violet.buttons .button:focus,\n.inverted.violet.button:focus,\n.inverted.violet.buttons .button.active,\n.inverted.violet.button.active,\n.inverted.violet.buttons .button:active,\n.inverted.violet.button:active {\n  box-shadow: none !important;\n  color: var(--light-violet-text-color);\n}\n.inverted.violet.buttons .button:hover,\n.inverted.violet.button:hover {\n  background-color: var(--light-violet-hover);\n}\n.inverted.violet.buttons .button:focus,\n.inverted.violet.button:focus {\n  background-color: var(--light-violet-focus);\n}\n.inverted.violet.buttons .active.button,\n.inverted.violet.active.button {\n  background-color: var(--light-violet-active);\n}\n.inverted.violet.buttons .button:active,\n.inverted.violet.button:active {\n  background-color: var(--light-violet-down);\n}\n.inverted.violet.basic.buttons .button,\n.inverted.violet.buttons .basic.button,\n.inverted.violet.basic.button {\n  background-color: transparent;\n  box-shadow: var(--basic-inverted-box-shadow) !important;\n  color: var(--white) !important;\n}\n.inverted.violet.basic.buttons .button:hover,\n.inverted.violet.buttons .basic.button:hover,\n.inverted.violet.basic.button:hover {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-violet-hover) inset !important;\n  color: var(--light-violet) !important;\n}\n.inverted.violet.basic.buttons .button:focus,\n.inverted.violet.basic.buttons .button:focus,\n.inverted.violet.basic.button:focus {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-violet-focus) inset !important;\n  color: var(--light-violet) !important;\n}\n.inverted.violet.basic.buttons .active.button,\n.inverted.violet.buttons .basic.active.button,\n.inverted.violet.basic.active.button {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-violet-active) inset !important;\n  color: var(--light-violet) !important;\n}\n.inverted.violet.basic.buttons .button:active,\n.inverted.violet.buttons .basic.button:active,\n.inverted.violet.basic.button:active {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-violet-down) inset !important;\n  color: var(--light-violet) !important;\n}\n.purple.buttons .button,\n.purple.button {\n  background-color: var(--purple);\n  color: var(--purple-text-color);\n  text-shadow: var(--purple-text-shadow);\n  background-image: var(--colored-background-image);\n}\n.purple.button {\n  box-shadow: var(--colored-box-shadow);\n}\n.purple.buttons .button:hover,\n.purple.button:hover {\n  background-color: var(--purple-hover);\n  color: var(--purple-text-color);\n  text-shadow: var(--purple-text-shadow);\n}\n.purple.buttons .button:focus,\n.purple.button:focus {\n  background-color: var(--purple-focus);\n  color: var(--purple-text-color);\n  text-shadow: var(--purple-text-shadow);\n}\n.purple.buttons .button:active,\n.purple.button:active {\n  background-color: var(--purple-down);\n  color: var(--purple-text-color);\n  text-shadow: var(--purple-text-shadow);\n}\n.purple.buttons .active.button,\n.purple.buttons .active.button:active,\n.purple.active.button,\n.purple.button .active.button:active {\n  background-color: var(--purple-active);\n  color: var(--purple-text-color);\n  text-shadow: var(--purple-text-shadow);\n}\n.basic.purple.buttons .button,\n.basic.purple.button {\n  box-shadow: 0px 0px 0px var(--basic-border-size) var(--purple) inset !important;\n  color: var(--purple) !important;\n}\n.basic.purple.buttons .button:hover,\n.basic.purple.button:hover {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--purple-hover) inset !important;\n  color: var(--purple-hover) !important;\n}\n.basic.purple.buttons .button:focus,\n.basic.purple.button:focus {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--purple-focus) inset !important;\n  color: var(--purple-hover) !important;\n}\n.basic.purple.buttons .active.button,\n.basic.purple.active.button {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--purple-active) inset !important;\n  color: var(--purple-down) !important;\n}\n.basic.purple.buttons .button:active,\n.basic.purple.button:active {\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--purple-down) inset !important;\n  color: var(--purple-down) !important;\n}\n.buttons:not(.vertical) > .basic.purple.button:not(:first-child) {\n  margin-left: var(--basic-colored-border-size);\n}\n.inverted.purple.buttons .button,\n.inverted.purple.button {\n  background-color: transparent;\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-purple) inset !important;\n  color: var(--light-purple);\n}\n.inverted.purple.buttons .button:hover,\n.inverted.purple.button:hover,\n.inverted.purple.buttons .button:focus,\n.inverted.purple.button:focus,\n.inverted.purple.buttons .button.active,\n.inverted.purple.button.active,\n.inverted.purple.buttons .button:active,\n.inverted.purple.button:active {\n  box-shadow: none !important;\n  color: var(--light-purple-text-color);\n}\n.inverted.purple.buttons .button:hover,\n.inverted.purple.button:hover {\n  background-color: var(--light-purple-hover);\n}\n.inverted.purple.buttons .button:focus,\n.inverted.purple.button:focus {\n  background-color: var(--light-purple-focus);\n}\n.inverted.purple.buttons .active.button,\n.inverted.purple.active.button {\n  background-color: var(--light-purple-active);\n}\n.inverted.purple.buttons .button:active,\n.inverted.purple.button:active {\n  background-color: var(--light-purple-down);\n}\n.inverted.purple.basic.buttons .button,\n.inverted.purple.buttons .basic.button,\n.inverted.purple.basic.button {\n  background-color: transparent;\n  box-shadow: var(--basic-inverted-box-shadow) !important;\n  color: var(--white) !important;\n}\n.inverted.purple.basic.buttons .button:hover,\n.inverted.purple.buttons .basic.button:hover,\n.inverted.purple.basic.button:hover {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-purple-hover) inset !important;\n  color: var(--light-purple) !important;\n}\n.inverted.purple.basic.buttons .button:focus,\n.inverted.purple.basic.buttons .button:focus,\n.inverted.purple.basic.button:focus {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-purple-focus) inset !important;\n  color: var(--light-purple) !important;\n}\n.inverted.purple.basic.buttons .active.button,\n.inverted.purple.buttons .basic.active.button,\n.inverted.purple.basic.active.button {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-purple-active) inset !important;\n  color: var(--light-purple) !important;\n}\n.inverted.purple.basic.buttons .button:active,\n.inverted.purple.buttons .basic.button:active,\n.inverted.purple.basic.button:active {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-purple-down) inset !important;\n  color: var(--light-purple) !important;\n}\n.red.buttons .button,\n.red.button {\n  background-color: var(--red);\n  color: var(--red-text-color);\n  text-shadow: var(--red-text-shadow);\n  background-image: var(--colored-background-image);\n}\n.red.button {\n  box-shadow: var(--colored-box-shadow);\n}\n.red.buttons .button:hover,\n.red.button:hover {\n  background-color: var(--red-hover);\n  color: var(--red-text-color);\n  text-shadow: var(--red-text-shadow);\n}\n.red.buttons .button:focus,\n.red.button:focus {\n  background-color: var(--red-focus);\n  color: var(--red-text-color);\n  text-shadow: var(--red-text-shadow);\n}\n.red.buttons .button:active,\n.red.button:active {\n  background-color: var(--red-down);\n  color: var(--red-text-color);\n  text-shadow: var(--red-text-shadow);\n}\n.red.buttons .active.button,\n.red.buttons .active.button:active,\n.red.active.button,\n.red.button .active.button:active {\n  background-color: var(--red-active);\n  color: var(--red-text-color);\n  text-shadow: var(--red-text-shadow);\n}\n.basic.red.buttons .button,\n.basic.red.button {\n  box-shadow: 0px 0px 0px var(--basic-border-size) var(--red) inset !important;\n  color: var(--red) !important;\n}\n.basic.red.buttons .button:hover,\n.basic.red.button:hover {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--red-hover) inset !important;\n  color: var(--red-hover) !important;\n}\n.basic.red.buttons .button:focus,\n.basic.red.button:focus {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--red-focus) inset !important;\n  color: var(--red-hover) !important;\n}\n.basic.red.buttons .active.button,\n.basic.red.active.button {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--red-active) inset !important;\n  color: var(--red-down) !important;\n}\n.basic.red.buttons .button:active,\n.basic.red.button:active {\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--red-down) inset !important;\n  color: var(--red-down) !important;\n}\n.buttons:not(.vertical) > .basic.red.button:not(:first-child) {\n  margin-left: var(--basic-colored-border-size);\n}\n.inverted.red.buttons .button,\n.inverted.red.button {\n  background-color: transparent;\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-red) inset !important;\n  color: var(--light-red);\n}\n.inverted.red.buttons .button:hover,\n.inverted.red.button:hover,\n.inverted.red.buttons .button:focus,\n.inverted.red.button:focus,\n.inverted.red.buttons .button.active,\n.inverted.red.button.active,\n.inverted.red.buttons .button:active,\n.inverted.red.button:active {\n  box-shadow: none !important;\n  color: var(--light-red-text-color);\n}\n.inverted.red.buttons .button:hover,\n.inverted.red.button:hover {\n  background-color: var(--light-red-hover);\n}\n.inverted.red.buttons .button:focus,\n.inverted.red.button:focus {\n  background-color: var(--light-red-focus);\n}\n.inverted.red.buttons .active.button,\n.inverted.red.active.button {\n  background-color: var(--light-red-active);\n}\n.inverted.red.buttons .button:active,\n.inverted.red.button:active {\n  background-color: var(--light-red-down);\n}\n.inverted.red.basic.buttons .button,\n.inverted.red.buttons .basic.button,\n.inverted.red.basic.button {\n  background-color: transparent;\n  box-shadow: var(--basic-inverted-box-shadow) !important;\n  color: var(--white) !important;\n}\n.inverted.red.basic.buttons .button:hover,\n.inverted.red.buttons .basic.button:hover,\n.inverted.red.basic.button:hover {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-red-hover) inset !important;\n  color: var(--light-red) !important;\n}\n.inverted.red.basic.buttons .button:focus,\n.inverted.red.basic.buttons .button:focus,\n.inverted.red.basic.button:focus {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-red-focus) inset !important;\n  color: var(--light-red) !important;\n}\n.inverted.red.basic.buttons .active.button,\n.inverted.red.buttons .basic.active.button,\n.inverted.red.basic.active.button {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-red-active) inset !important;\n  color: var(--light-red) !important;\n}\n.inverted.red.basic.buttons .button:active,\n.inverted.red.buttons .basic.button:active,\n.inverted.red.basic.button:active {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-red-down) inset !important;\n  color: var(--light-red) !important;\n}\n.teal.buttons .button,\n.teal.button {\n  background-color: var(--teal);\n  color: var(--teal-text-color);\n  text-shadow: var(--teal-text-shadow);\n  background-image: var(--colored-background-image);\n}\n.teal.button {\n  box-shadow: var(--colored-box-shadow);\n}\n.teal.buttons .button:hover,\n.teal.button:hover {\n  background-color: var(--teal-hover);\n  color: var(--teal-text-color);\n  text-shadow: var(--teal-text-shadow);\n}\n.teal.buttons .button:focus,\n.teal.button:focus {\n  background-color: var(--teal-focus);\n  color: var(--teal-text-color);\n  text-shadow: var(--teal-text-shadow);\n}\n.teal.buttons .button:active,\n.teal.button:active {\n  background-color: var(--teal-down);\n  color: var(--teal-text-color);\n  text-shadow: var(--teal-text-shadow);\n}\n.teal.buttons .active.button,\n.teal.buttons .active.button:active,\n.teal.active.button,\n.teal.button .active.button:active {\n  background-color: var(--teal-active);\n  color: var(--teal-text-color);\n  text-shadow: var(--teal-text-shadow);\n}\n.basic.teal.buttons .button,\n.basic.teal.button {\n  box-shadow: 0px 0px 0px var(--basic-border-size) var(--teal) inset !important;\n  color: var(--teal) !important;\n}\n.basic.teal.buttons .button:hover,\n.basic.teal.button:hover {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--teal-hover) inset !important;\n  color: var(--teal-hover) !important;\n}\n.basic.teal.buttons .button:focus,\n.basic.teal.button:focus {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--teal-focus) inset !important;\n  color: var(--teal-hover) !important;\n}\n.basic.teal.buttons .active.button,\n.basic.teal.active.button {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--teal-active) inset !important;\n  color: var(--teal-down) !important;\n}\n.basic.teal.buttons .button:active,\n.basic.teal.button:active {\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--teal-down) inset !important;\n  color: var(--teal-down) !important;\n}\n.buttons:not(.vertical) > .basic.teal.button:not(:first-child) {\n  margin-left: var(--basic-colored-border-size);\n}\n.inverted.teal.buttons .button,\n.inverted.teal.button {\n  background-color: transparent;\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-teal) inset !important;\n  color: var(--light-teal);\n}\n.inverted.teal.buttons .button:hover,\n.inverted.teal.button:hover,\n.inverted.teal.buttons .button:focus,\n.inverted.teal.button:focus,\n.inverted.teal.buttons .button.active,\n.inverted.teal.button.active,\n.inverted.teal.buttons .button:active,\n.inverted.teal.button:active {\n  box-shadow: none !important;\n  color: var(--light-teal-text-color);\n}\n.inverted.teal.buttons .button:hover,\n.inverted.teal.button:hover {\n  background-color: var(--light-teal-hover);\n}\n.inverted.teal.buttons .button:focus,\n.inverted.teal.button:focus {\n  background-color: var(--light-teal-focus);\n}\n.inverted.teal.buttons .active.button,\n.inverted.teal.active.button {\n  background-color: var(--light-teal-active);\n}\n.inverted.teal.buttons .button:active,\n.inverted.teal.button:active {\n  background-color: var(--light-teal-down);\n}\n.inverted.teal.basic.buttons .button,\n.inverted.teal.buttons .basic.button,\n.inverted.teal.basic.button {\n  background-color: transparent;\n  box-shadow: var(--basic-inverted-box-shadow) !important;\n  color: var(--white) !important;\n}\n.inverted.teal.basic.buttons .button:hover,\n.inverted.teal.buttons .basic.button:hover,\n.inverted.teal.basic.button:hover {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-teal-hover) inset !important;\n  color: var(--light-teal) !important;\n}\n.inverted.teal.basic.buttons .button:focus,\n.inverted.teal.basic.buttons .button:focus,\n.inverted.teal.basic.button:focus {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-teal-focus) inset !important;\n  color: var(--light-teal) !important;\n}\n.inverted.teal.basic.buttons .active.button,\n.inverted.teal.buttons .basic.active.button,\n.inverted.teal.basic.active.button {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-teal-active) inset !important;\n  color: var(--light-teal) !important;\n}\n.inverted.teal.basic.buttons .button:active,\n.inverted.teal.buttons .basic.button:active,\n.inverted.teal.basic.button:active {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-teal-down) inset !important;\n  color: var(--light-teal) !important;\n}\n.olive.buttons .button,\n.olive.button {\n  background-color: var(--olive);\n  color: var(--olive-text-color);\n  text-shadow: var(--olive-text-shadow);\n  background-image: var(--colored-background-image);\n}\n.olive.button {\n  box-shadow: var(--colored-box-shadow);\n}\n.olive.buttons .button:hover,\n.olive.button:hover {\n  background-color: var(--olive-hover);\n  color: var(--olive-text-color);\n  text-shadow: var(--olive-text-shadow);\n}\n.olive.buttons .button:focus,\n.olive.button:focus {\n  background-color: var(--olive-focus);\n  color: var(--olive-text-color);\n  text-shadow: var(--olive-text-shadow);\n}\n.olive.buttons .button:active,\n.olive.button:active {\n  background-color: var(--olive-down);\n  color: var(--olive-text-color);\n  text-shadow: var(--olive-text-shadow);\n}\n.olive.buttons .active.button,\n.olive.buttons .active.button:active,\n.olive.active.button,\n.olive.button .active.button:active {\n  background-color: var(--olive-active);\n  color: var(--olive-text-color);\n  text-shadow: var(--olive-text-shadow);\n}\n.basic.olive.buttons .button,\n.basic.olive.button {\n  box-shadow: 0px 0px 0px var(--basic-border-size) var(--olive) inset !important;\n  color: var(--olive) !important;\n}\n.basic.olive.buttons .button:hover,\n.basic.olive.button:hover {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--olive-hover) inset !important;\n  color: var(--olive-hover) !important;\n}\n.basic.olive.buttons .button:focus,\n.basic.olive.button:focus {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--olive-focus) inset !important;\n  color: var(--olive-hover) !important;\n}\n.basic.olive.buttons .active.button,\n.basic.olive.active.button {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--olive-active) inset !important;\n  color: var(--olive-down) !important;\n}\n.basic.olive.buttons .button:active,\n.basic.olive.button:active {\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--olive-down) inset !important;\n  color: var(--olive-down) !important;\n}\n.buttons:not(.vertical) > .basic.olive.button:not(:first-child) {\n  margin-left: var(--basic-colored-border-size);\n}\n.inverted.olive.buttons .button,\n.inverted.olive.button {\n  background-color: transparent;\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-olive) inset !important;\n  color: var(--light-olive);\n}\n.inverted.olive.buttons .button:hover,\n.inverted.olive.button:hover,\n.inverted.olive.buttons .button:focus,\n.inverted.olive.button:focus,\n.inverted.olive.buttons .button.active,\n.inverted.olive.button.active,\n.inverted.olive.buttons .button:active,\n.inverted.olive.button:active {\n  box-shadow: none !important;\n  color: var(--light-olive-text-color);\n}\n.inverted.olive.buttons .button:hover,\n.inverted.olive.button:hover {\n  background-color: var(--light-olive-hover);\n}\n.inverted.olive.buttons .button:focus,\n.inverted.olive.button:focus {\n  background-color: var(--light-olive-focus);\n}\n.inverted.olive.buttons .active.button,\n.inverted.olive.active.button {\n  background-color: var(--light-olive-active);\n}\n.inverted.olive.buttons .button:active,\n.inverted.olive.button:active {\n  background-color: var(--light-olive-down);\n}\n.inverted.olive.basic.buttons .button,\n.inverted.olive.buttons .basic.button,\n.inverted.olive.basic.button {\n  background-color: transparent;\n  box-shadow: var(--basic-inverted-box-shadow) !important;\n  color: var(--white) !important;\n}\n.inverted.olive.basic.buttons .button:hover,\n.inverted.olive.buttons .basic.button:hover,\n.inverted.olive.basic.button:hover {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-olive-hover) inset !important;\n  color: var(--light-olive) !important;\n}\n.inverted.olive.basic.buttons .button:focus,\n.inverted.olive.basic.buttons .button:focus,\n.inverted.olive.basic.button:focus {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-olive-focus) inset !important;\n  color: var(--light-olive) !important;\n}\n.inverted.olive.basic.buttons .active.button,\n.inverted.olive.buttons .basic.active.button,\n.inverted.olive.basic.active.button {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-olive-active) inset !important;\n  color: var(--light-olive) !important;\n}\n.inverted.olive.basic.buttons .button:active,\n.inverted.olive.buttons .basic.button:active,\n.inverted.olive.basic.button:active {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-olive-down) inset !important;\n  color: var(--light-olive) !important;\n}\n.yellow.buttons .button,\n.yellow.button {\n  background-color: var(--yellow);\n  color: var(--yellow-text-color);\n  text-shadow: var(--yellow-text-shadow);\n  background-image: var(--colored-background-image);\n}\n.yellow.button {\n  box-shadow: var(--colored-box-shadow);\n}\n.yellow.buttons .button:hover,\n.yellow.button:hover {\n  background-color: var(--yellow-hover);\n  color: var(--yellow-text-color);\n  text-shadow: var(--yellow-text-shadow);\n}\n.yellow.buttons .button:focus,\n.yellow.button:focus {\n  background-color: var(--yellow-focus);\n  color: var(--yellow-text-color);\n  text-shadow: var(--yellow-text-shadow);\n}\n.yellow.buttons .button:active,\n.yellow.button:active {\n  background-color: var(--yellow-down);\n  color: var(--yellow-text-color);\n  text-shadow: var(--yellow-text-shadow);\n}\n.yellow.buttons .active.button,\n.yellow.buttons .active.button:active,\n.yellow.active.button,\n.yellow.button .active.button:active {\n  background-color: var(--yellow-active);\n  color: var(--yellow-text-color);\n  text-shadow: var(--yellow-text-shadow);\n}\n.basic.yellow.buttons .button,\n.basic.yellow.button {\n  box-shadow: 0px 0px 0px var(--basic-border-size) var(--yellow) inset !important;\n  color: var(--yellow) !important;\n}\n.basic.yellow.buttons .button:hover,\n.basic.yellow.button:hover {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--yellow-hover) inset !important;\n  color: var(--yellow-hover) !important;\n}\n.basic.yellow.buttons .button:focus,\n.basic.yellow.button:focus {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--yellow-focus) inset !important;\n  color: var(--yellow-hover) !important;\n}\n.basic.yellow.buttons .active.button,\n.basic.yellow.active.button {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--yellow-active) inset !important;\n  color: var(--yellow-down) !important;\n}\n.basic.yellow.buttons .button:active,\n.basic.yellow.button:active {\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--yellow-down) inset !important;\n  color: var(--yellow-down) !important;\n}\n.buttons:not(.vertical) > .basic.yellow.button:not(:first-child) {\n  margin-left: var(--basic-colored-border-size);\n}\n.inverted.yellow.buttons .button,\n.inverted.yellow.button {\n  background-color: transparent;\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-yellow) inset !important;\n  color: var(--light-yellow);\n}\n.inverted.yellow.buttons .button:hover,\n.inverted.yellow.button:hover,\n.inverted.yellow.buttons .button:focus,\n.inverted.yellow.button:focus,\n.inverted.yellow.buttons .button.active,\n.inverted.yellow.button.active,\n.inverted.yellow.buttons .button:active,\n.inverted.yellow.button:active {\n  box-shadow: none !important;\n  color: var(--light-yellow-text-color);\n}\n.inverted.yellow.buttons .button:hover,\n.inverted.yellow.button:hover {\n  background-color: var(--light-yellow-hover);\n}\n.inverted.yellow.buttons .button:focus,\n.inverted.yellow.button:focus {\n  background-color: var(--light-yellow-focus);\n}\n.inverted.yellow.buttons .active.button,\n.inverted.yellow.active.button {\n  background-color: var(--light-yellow-active);\n}\n.inverted.yellow.buttons .button:active,\n.inverted.yellow.button:active {\n  background-color: var(--light-yellow-down);\n}\n.inverted.yellow.basic.buttons .button,\n.inverted.yellow.buttons .basic.button,\n.inverted.yellow.basic.button {\n  background-color: transparent;\n  box-shadow: var(--basic-inverted-box-shadow) !important;\n  color: var(--white) !important;\n}\n.inverted.yellow.basic.buttons .button:hover,\n.inverted.yellow.buttons .basic.button:hover,\n.inverted.yellow.basic.button:hover {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-yellow-hover) inset !important;\n  color: var(--light-yellow) !important;\n}\n.inverted.yellow.basic.buttons .button:focus,\n.inverted.yellow.basic.buttons .button:focus,\n.inverted.yellow.basic.button:focus {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-yellow-focus) inset !important;\n  color: var(--light-yellow) !important;\n}\n.inverted.yellow.basic.buttons .active.button,\n.inverted.yellow.buttons .basic.active.button,\n.inverted.yellow.basic.active.button {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-yellow-active) inset !important;\n  color: var(--light-yellow) !important;\n}\n.inverted.yellow.basic.buttons .button:active,\n.inverted.yellow.buttons .basic.button:active,\n.inverted.yellow.basic.button:active {\n  box-shadow: 0px 0px 0px var(--inverted-border-size) var(--light-yellow-down) inset !important;\n  color: var(--light-yellow) !important;\n}\n\n/* src/button/css/variations/compact.css */\n.compact.buttons .button,\n.compact.button {\n  padding: var(--compact-vertical-padding) var(--compact-horizontal-padding) (var(--compact-vertical-padding) + var(--shadow-offset));\n}\n.compact.icon.buttons .button,\n.compact.icon.button {\n  padding: var(--compact-vertical-padding) var(--compact-vertical-padding) (var(--compact-vertical-padding) + var(--shadow-offset));\n}\n.compact.labeled.icon.buttons .button,\n.compact.labeled.icon.button {\n  padding: var(--compact-vertical-padding) (var(--compact-horizontal-padding) + var(--labeled-icon-width)) (var(--compact-vertical-padding) + var(--shadow-offset));\n}\n\n/* src/button/css/variations/floated.css */\n[class*="left floated"].buttons,\n[class*="left floated"].button {\n  float: left;\n  margin-left: 0em;\n  margin-right: var(--floated-margin);\n}\n[class*="right floated"].buttons,\n[class*="right floated"].button {\n  float: right;\n  margin-right: 0em;\n  margin-left: var(--floated-margin);\n}\n\n/* src/button/css/variations/fluid.css */\n.fluid.buttons,\n.fluid.button {\n  width: 100%;\n}\n.fluid.button {\n  display: block;\n}\n.two.buttons {\n  width: 100%;\n}\n.two.buttons > .button {\n  width: 50%;\n}\n.three.buttons {\n  width: 100%;\n}\n.three.buttons > .button {\n  width: 33.333%;\n}\n.four.buttons {\n  width: 100%;\n}\n.four.buttons > .button {\n  width: 25%;\n}\n.five.buttons {\n  width: 100%;\n}\n.five.buttons > .button {\n  width: 20%;\n}\n.six.buttons {\n  width: 100%;\n}\n.six.buttons > .button {\n  width: 16.666%;\n}\n.seven.buttons {\n  width: 100%;\n}\n.seven.buttons > .button {\n  width: 14.285%;\n}\n.eight.buttons {\n  width: 100%;\n}\n.eight.buttons > .button {\n  width: 12.500%;\n}\n.nine.buttons {\n  width: 100%;\n}\n.nine.buttons > .button {\n  width: 11.11%;\n}\n.ten.buttons {\n  width: 100%;\n}\n.ten.buttons > .button {\n  width: 10%;\n}\n.eleven.buttons {\n  width: 100%;\n}\n.eleven.buttons > .button {\n  width: 9.09%;\n}\n.twelve.buttons {\n  width: 100%;\n}\n.twelve.buttons > .button {\n  width: 8.3333%;\n}\n.fluid.vertical.buttons,\n.fluid.vertical.buttons > .button {\n  display: flex;\n  width: auto;\n}\n.two.vertical.buttons > .button {\n  height: 50%;\n}\n.three.vertical.buttons > .button {\n  height: 33.333%;\n}\n.four.vertical.buttons > .button {\n  height: 25%;\n}\n.five.vertical.buttons > .button {\n  height: 20%;\n}\n.six.vertical.buttons > .button {\n  height: 16.666%;\n}\n.seven.vertical.buttons > .button {\n  height: 14.285%;\n}\n.eight.vertical.buttons > .button {\n  height: 12.500%;\n}\n.nine.vertical.buttons > .button {\n  height: 11.11%;\n}\n.ten.vertical.buttons > .button {\n  height: 10%;\n}\n.eleven.vertical.buttons > .button {\n  height: 9.09%;\n}\n.twelve.vertical.buttons > .button {\n  height: 8.3333%;\n}\n\n/* src/button/css/variations/negative.css */\n.negative.buttons .button,\n.negative.button {\n  background-color: var(--negative-color);\n  color: var(--negative-text-color);\n  text-shadow: var(--negative-text-shadow);\n  background-image: var(--colored-background-image);\n}\n.negative.button {\n  box-shadow: var(--colored-box-shadow);\n}\n.negative.buttons .button:hover,\n.negative.button:hover {\n  background-color: var(--negative-color-hover);\n  color: var(--negative-text-color);\n  text-shadow: var(--negative-text-shadow);\n}\n.negative.buttons .button:focus,\n.negative.button:focus {\n  background-color: var(--negative-color-focus);\n  color: var(--negative-text-color);\n  text-shadow: var(--negative-text-shadow);\n}\n.negative.buttons .button:active,\n.negative.button:active {\n  background-color: var(--negative-color-down);\n  color: var(--negative-text-color);\n  text-shadow: var(--negative-text-shadow);\n}\n.negative.buttons .active.button,\n.negative.buttons .active.button:active,\n.negative.active.button,\n.negative.button .active.button:active {\n  background-color: var(--negative-color-active);\n  color: var(--negative-text-color);\n  text-shadow: var(--negative-text-shadow);\n}\n.basic.negative.buttons .button,\n.basic.negative.button {\n  box-shadow: 0px 0px 0px var(--basic-border-size) var(--negative-color) inset !important;\n  color: var(--negative-color) !important;\n}\n.basic.negative.buttons .button:hover,\n.basic.negative.button:hover {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--negative-color-hover) inset !important;\n  color: var(--negative-color-hover) !important;\n}\n.basic.negative.buttons .button:focus,\n.basic.negative.button:focus {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--negative-color-focus) inset !important;\n  color: var(--negative-color-hover) !important;\n}\n.basic.negative.buttons .active.button,\n.basic.negative.active.button {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--negative-color-active) inset !important;\n  color: var(--negative-color-down) !important;\n}\n.basic.negative.buttons .button:active,\n.basic.negative.button:active {\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--negative-color-down) inset !important;\n  color: var(--negative-color-down) !important;\n}\n.buttons:not(.vertical) > .basic.primary.button:not(:first-child) {\n  margin-left: var(--basic-colored-border-size);\n}\n\n/* src/button/css/variations/positive.css */\n.positive.buttons .button,\n.positive.button {\n  background-color: var(--positive-color);\n  color: var(--positive-text-color);\n  text-shadow: var(--positive-text-shadow);\n  background-image: var(--colored-background-image);\n}\n.positive.button {\n  box-shadow: var(--colored-box-shadow);\n}\n.positive.buttons .button:hover,\n.positive.button:hover {\n  background-color: var(--positive-color-hover);\n  color: var(--positive-text-color);\n  text-shadow: var(--positive-text-shadow);\n}\n.positive.buttons .button:focus,\n.positive.button:focus {\n  background-color: var(--positive-color-focus);\n  color: var(--positive-text-color);\n  text-shadow: var(--positive-text-shadow);\n}\n.positive.buttons .button:active,\n.positive.button:active {\n  background-color: var(--positive-color-down);\n  color: var(--positive-text-color);\n  text-shadow: var(--positive-text-shadow);\n}\n.positive.buttons .active.button,\n.positive.buttons .active.button:active,\n.positive.active.button,\n.positive.button .active.button:active {\n  background-color: var(--positive-color-active);\n  color: var(--positive-text-color);\n  text-shadow: var(--positive-text-shadow);\n}\n.basic.positive.buttons .button,\n.basic.positive.button {\n  box-shadow: 0px 0px 0px var(--basic-border-size) var(--positive-color) inset !important;\n  color: var(--positive-color) !important;\n}\n.basic.positive.buttons .button:hover,\n.basic.positive.button:hover {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--positive-color-hover) inset !important;\n  color: var(--positive-color-hover) !important;\n}\n.basic.positive.buttons .button:focus,\n.basic.positive.button:focus {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--positive-color-focus) inset !important;\n  color: var(--positive-color-hover) !important;\n}\n.basic.positive.buttons .active.button,\n.basic.positive.active.button {\n  background: transparent !important;\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--positive-color-active) inset !important;\n  color: var(--positive-color-down) !important;\n}\n.basic.positive.buttons .button:active,\n.basic.positive.button:active {\n  box-shadow: 0px 0px 0px var(--basic-colored-border-size) var(--positive-color-down) inset !important;\n  color: var(--positive-color-down) !important;\n}\n.buttons:not(.vertical) > .basic.primary.button:not(:first-child) {\n  margin-left: var(--basic-colored-border-size);\n}\n\n/* src/button/css/variations/sizing.css */\n.mini.buttons .button,\n.mini.buttons .or,\n.mini.button {\n  font-size: var(--mini);\n}\n.tiny.buttons .button,\n.tiny.buttons .or,\n.tiny.button {\n  font-size: var(--tiny);\n}\n.small.buttons .button,\n.small.buttons .or,\n.small.button {\n  font-size: var(--small);\n}\n.buttons .button,\n.buttons .or,\n.button {\n  font-size: var(--medium);\n}\n.large.buttons .button,\n.large.buttons .or,\n.large.button {\n  font-size: var(--large);\n}\n.big.buttons .button,\n.big.buttons .or,\n.big.button {\n  font-size: var(--big);\n}\n.huge.buttons .button,\n.huge.buttons .or,\n.huge.button {\n  font-size: var(--huge);\n}\n.massive.buttons .button,\n.massive.buttons .or,\n.massive.button {\n  font-size: var(--massive);\n}\n\n/* src/button/css/variations/social.css */\n.facebook.button {\n  background-color: var(--facebook-color);\n  color: var(--inverted-text-color);\n  text-shadow: var(--inverted-text-shadow);\n  background-image: var(--colored-background-image);\n  box-shadow: var(--colored-box-shadow);\n}\n.facebook.button:hover {\n  background-color: var(--facebook-hover-color);\n  color: var(--inverted-text-color);\n  text-shadow: var(--inverted-text-shadow);\n}\n.facebook.button:active {\n  background-color: var(--facebook-down-color);\n  color: var(--inverted-text-color);\n  text-shadow: var(--inverted-text-shadow);\n}\n.twitter.button {\n  background-color: var(--twitter-color);\n  color: var(--inverted-text-color);\n  text-shadow: var(--inverted-text-shadow);\n  background-image: var(--colored-background-image);\n  box-shadow: var(--colored-box-shadow);\n}\n.twitter.button:hover {\n  background-color: var(--twitter-hover-color);\n  color: var(--inverted-text-color);\n  text-shadow: var(--inverted-text-shadow);\n}\n.twitter.button:active {\n  background-color: var(--twitter-down-color);\n  color: var(--inverted-text-color);\n  text-shadow: var(--inverted-text-shadow);\n}\n.google.plus.button {\n  background-color: var(--google-plus-color);\n  color: var(--inverted-text-color);\n  text-shadow: var(--inverted-text-shadow);\n  background-image: var(--colored-background-image);\n  box-shadow: var(--colored-box-shadow);\n}\n.google.plus.button:hover {\n  background-color: var(--google-plus-hover-color);\n  color: var(--inverted-text-color);\n  text-shadow: var(--inverted-text-shadow);\n}\n.google.plus.button:active {\n  background-color: var(--google-plus-down-color);\n  color: var(--inverted-text-color);\n  text-shadow: var(--inverted-text-shadow);\n}\n.linkedin.button {\n  background-color: var(--linked-in-color);\n  color: var(--inverted-text-color);\n  text-shadow: var(--inverted-text-shadow);\n}\n.linkedin.button:hover {\n  background-color: var(--linked-in-hover-color);\n  color: var(--inverted-text-color);\n  text-shadow: var(--inverted-text-shadow);\n}\n.linkedin.button:active {\n  background-color: var(--linked-in-down-color);\n  color: var(--inverted-text-color);\n  text-shadow: var(--inverted-text-shadow);\n}\n.youtube.button {\n  background-color: var(--youtube-color);\n  color: var(--inverted-text-color);\n  text-shadow: var(--inverted-text-shadow);\n  background-image: var(--colored-background-image);\n  box-shadow: var(--colored-box-shadow);\n}\n.youtube.button:hover {\n  background-color: var(--youtube-hover-color);\n  color: var(--inverted-text-color);\n  text-shadow: var(--inverted-text-shadow);\n}\n.youtube.button:active {\n  background-color: var(--youtube-down-color);\n  color: var(--inverted-text-color);\n  text-shadow: var(--inverted-text-shadow);\n}\n.instagram.button {\n  background-color: var(--instagram-color);\n  color: var(--inverted-text-color);\n  text-shadow: var(--inverted-text-shadow);\n  background-image: var(--colored-background-image);\n  box-shadow: var(--colored-box-shadow);\n}\n.instagram.button:hover {\n  background-color: var(--instagram-hover-color);\n  color: var(--inverted-text-color);\n  text-shadow: var(--inverted-text-shadow);\n}\n.instagram.button:active {\n  background-color: var(--instagram-down-color);\n  color: var(--inverted-text-color);\n  text-shadow: var(--inverted-text-shadow);\n}\n.pinterest.button {\n  background-color: var(--pinterest-color);\n  color: var(--inverted-text-color);\n  text-shadow: var(--inverted-text-shadow);\n  background-image: var(--colored-background-image);\n  box-shadow: var(--colored-box-shadow);\n}\n.pinterest.button:hover {\n  background-color: var(--pinterest-hover-color);\n  color: var(--inverted-text-color);\n  text-shadow: var(--inverted-text-shadow);\n}\n.pinterest.button:active {\n  background-color: var(--pinterest-down-color);\n  color: var(--inverted-text-color);\n  text-shadow: var(--inverted-text-shadow);\n}\n.vk.button {\n  background-color: var(--vk-color);\n  color: var(--white);\n  background-image: var(--colored-background-image);\n  box-shadow: var(--colored-box-shadow);\n}\n.vk.button:hover {\n  background-color: var(--vk-hover-color);\n  color: var(--white);\n}\n.vk.button:active {\n  background-color: var(--vk-down-color);\n  color: var(--white);\n}\n\n/* src/button/css/variations/vertical.css */\n.vertical.buttons {\n  display: inline-flex;\n  flex-direction: column;\n}\n.vertical.buttons .button {\n  display: block;\n  float: none;\n  width: 100%;\n  margin: var(--vertical-group-offset);\n  box-shadow: var(--vertical-box-shadow);\n  border-radius: 0em;\n}\n.vertical.buttons .button:first-child {\n  border-top-left-radius: var(--border-radius);\n  border-top-right-radius: var(--border-radius);\n}\n.vertical.buttons .button:last-child {\n  margin-bottom: 0px;\n  border-bottom-left-radius: var(--border-radius);\n  border-bottom-right-radius: var(--border-radius);\n}\n.vertical.buttons .button:only-child {\n  border-radius: var(--border-radius);\n}\n\n/* src/button/css/button.css */\n';

// node_modules/@lit/reactive-element/css-tag.js
var t = globalThis;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = Symbol();
var o = /* @__PURE__ */ new WeakMap();
var n = class {
  constructor(t5, e7, o5) {
    if (this._$cssResult$ = true, o5 !== s)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t5, this.t = e7;
  }
  get styleSheet() {
    let t5 = this.o;
    const s4 = this.t;
    if (e && void 0 === t5) {
      const e7 = void 0 !== s4 && 1 === s4.length;
      e7 && (t5 = o.get(s4)), void 0 === t5 && ((this.o = t5 = new CSSStyleSheet()).replaceSync(this.cssText), e7 && o.set(s4, t5));
    }
    return t5;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t5) => new n("string" == typeof t5 ? t5 : t5 + "", void 0, s);
var S = (s4, o5) => {
  if (e)
    s4.adoptedStyleSheets = o5.map((t5) => t5 instanceof CSSStyleSheet ? t5 : t5.styleSheet);
  else
    for (const e7 of o5) {
      const o6 = document.createElement("style"), n5 = t.litNonce;
      void 0 !== n5 && o6.setAttribute("nonce", n5), o6.textContent = e7.cssText, s4.appendChild(o6);
    }
};
var c = e ? (t5) => t5 : (t5) => t5 instanceof CSSStyleSheet ? ((t6) => {
  let e7 = "";
  for (const s4 of t6.cssRules)
    e7 += s4.cssText;
  return r(e7);
})(t5) : t5;

// node_modules/@lit/reactive-element/reactive-element.js
var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: r2, getOwnPropertyNames: h, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
var a = globalThis;
var c2 = a.trustedTypes;
var l = c2 ? c2.emptyScript : "";
var p = a.reactiveElementPolyfillSupport;
var d = (t5, s4) => t5;
var u = { toAttribute(t5, s4) {
  switch (s4) {
    case Boolean:
      t5 = t5 ? l : null;
      break;
    case Object:
    case Array:
      t5 = null == t5 ? t5 : JSON.stringify(t5);
  }
  return t5;
}, fromAttribute(t5, s4) {
  let i5 = t5;
  switch (s4) {
    case Boolean:
      i5 = null !== t5;
      break;
    case Number:
      i5 = null === t5 ? null : Number(t5);
      break;
    case Object:
    case Array:
      try {
        i5 = JSON.parse(t5);
      } catch (t6) {
        i5 = null;
      }
  }
  return i5;
} };
var f = (t5, s4) => !i2(t5, s4);
var y = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
Symbol.metadata ??= Symbol("metadata"), a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var b = class extends HTMLElement {
  static addInitializer(t5) {
    this._$Ei(), (this.l ??= []).push(t5);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t5, s4 = y) {
    if (s4.state && (s4.attribute = false), this._$Ei(), this.elementProperties.set(t5, s4), !s4.noAccessor) {
      const i5 = Symbol(), r6 = this.getPropertyDescriptor(t5, i5, s4);
      void 0 !== r6 && e2(this.prototype, t5, r6);
    }
  }
  static getPropertyDescriptor(t5, s4, i5) {
    const { get: e7, set: h3 } = r2(this.prototype, t5) ?? { get() {
      return this[s4];
    }, set(t6) {
      this[s4] = t6;
    } };
    return { get() {
      return e7?.call(this);
    }, set(s5) {
      const r6 = e7?.call(this);
      h3.call(this, s5), this.requestUpdate(t5, r6, i5);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t5) {
    return this.elementProperties.get(t5) ?? y;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d("elementProperties")))
      return;
    const t5 = n2(this);
    t5.finalize(), void 0 !== t5.l && (this.l = [...t5.l]), this.elementProperties = new Map(t5.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d("finalized")))
      return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
      const t6 = this.properties, s4 = [...h(t6), ...o2(t6)];
      for (const i5 of s4)
        this.createProperty(i5, t6[i5]);
    }
    const t5 = this[Symbol.metadata];
    if (null !== t5) {
      const s4 = litPropertyMetadata.get(t5);
      if (void 0 !== s4)
        for (const [t6, i5] of s4)
          this.elementProperties.set(t6, i5);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t6, s4] of this.elementProperties) {
      const i5 = this._$Eu(t6, s4);
      void 0 !== i5 && this._$Eh.set(i5, t6);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s4) {
    const i5 = [];
    if (Array.isArray(s4)) {
      const e7 = new Set(s4.flat(1 / 0).reverse());
      for (const s5 of e7)
        i5.unshift(c(s5));
    } else
      void 0 !== s4 && i5.push(c(s4));
    return i5;
  }
  static _$Eu(t5, s4) {
    const i5 = s4.attribute;
    return false === i5 ? void 0 : "string" == typeof i5 ? i5 : "string" == typeof t5 ? t5.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$Eg = new Promise((t5) => this.enableUpdating = t5), this._$AL = /* @__PURE__ */ new Map(), this._$ES(), this.requestUpdate(), this.constructor.l?.forEach((t5) => t5(this));
  }
  addController(t5) {
    (this._$E_ ??= /* @__PURE__ */ new Set()).add(t5), void 0 !== this.renderRoot && this.isConnected && t5.hostConnected?.();
  }
  removeController(t5) {
    this._$E_?.delete(t5);
  }
  _$ES() {
    const t5 = /* @__PURE__ */ new Map(), s4 = this.constructor.elementProperties;
    for (const i5 of s4.keys())
      this.hasOwnProperty(i5) && (t5.set(i5, this[i5]), delete this[i5]);
    t5.size > 0 && (this._$Ep = t5);
  }
  createRenderRoot() {
    const t5 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S(t5, this.constructor.elementStyles), t5;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$E_?.forEach((t5) => t5.hostConnected?.());
  }
  enableUpdating(t5) {
  }
  disconnectedCallback() {
    this._$E_?.forEach((t5) => t5.hostDisconnected?.());
  }
  attributeChangedCallback(t5, s4, i5) {
    this._$AK(t5, i5);
  }
  _$EO(t5, s4) {
    const i5 = this.constructor.elementProperties.get(t5), e7 = this.constructor._$Eu(t5, i5);
    if (void 0 !== e7 && true === i5.reflect) {
      const r6 = (void 0 !== i5.converter?.toAttribute ? i5.converter : u).toAttribute(s4, i5.type);
      this._$Em = t5, null == r6 ? this.removeAttribute(e7) : this.setAttribute(e7, r6), this._$Em = null;
    }
  }
  _$AK(t5, s4) {
    const i5 = this.constructor, e7 = i5._$Eh.get(t5);
    if (void 0 !== e7 && this._$Em !== e7) {
      const t6 = i5.getPropertyOptions(e7), r6 = "function" == typeof t6.converter ? { fromAttribute: t6.converter } : void 0 !== t6.converter?.fromAttribute ? t6.converter : u;
      this._$Em = e7, this[e7] = r6.fromAttribute(s4, t6.type), this._$Em = null;
    }
  }
  requestUpdate(t5, s4, i5, e7 = false, r6) {
    if (void 0 !== t5) {
      if (i5 ??= this.constructor.getPropertyOptions(t5), !(i5.hasChanged ?? f)(e7 ? r6 : this[t5], s4))
        return;
      this.C(t5, s4, i5);
    }
    false === this.isUpdatePending && (this._$Eg = this._$EP());
  }
  C(t5, s4, i5) {
    this._$AL.has(t5) || this._$AL.set(t5, s4), true === i5.reflect && this._$Em !== t5 && (this._$Ej ??= /* @__PURE__ */ new Set()).add(t5);
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$Eg;
    } catch (t6) {
      Promise.reject(t6);
    }
    const t5 = this.scheduleUpdate();
    return null != t5 && await t5, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending)
      return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [t7, s5] of this._$Ep)
          this[t7] = s5;
        this._$Ep = void 0;
      }
      const t6 = this.constructor.elementProperties;
      if (t6.size > 0)
        for (const [s5, i5] of t6)
          true !== i5.wrapped || this._$AL.has(s5) || void 0 === this[s5] || this.C(s5, this[s5], i5);
    }
    let t5 = false;
    const s4 = this._$AL;
    try {
      t5 = this.shouldUpdate(s4), t5 ? (this.willUpdate(s4), this._$E_?.forEach((t6) => t6.hostUpdate?.()), this.update(s4)) : this._$ET();
    } catch (s5) {
      throw t5 = false, this._$ET(), s5;
    }
    t5 && this._$AE(s4);
  }
  willUpdate(t5) {
  }
  _$AE(t5) {
    this._$E_?.forEach((t6) => t6.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t5)), this.updated(t5);
  }
  _$ET() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$Eg;
  }
  shouldUpdate(t5) {
    return true;
  }
  update(t5) {
    this._$Ej &&= this._$Ej.forEach((t6) => this._$EO(t6, this[t6])), this._$ET();
  }
  updated(t5) {
  }
  firstUpdated(t5) {
  }
};
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[d("elementProperties")] = /* @__PURE__ */ new Map(), b[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: b }), (a.reactiveElementVersions ??= []).push("2.0.2");

// node_modules/lit-html/lit-html.js
var t2 = globalThis;
var i3 = t2.trustedTypes;
var s2 = i3 ? i3.createPolicy("lit-html", { createHTML: (t5) => t5 }) : void 0;
var e3 = "$lit$";
var h2 = `lit$${(Math.random() + "").slice(9)}$`;
var o3 = "?" + h2;
var n3 = `<${o3}>`;
var r3 = document;
var l2 = () => r3.createComment("");
var c3 = (t5) => null === t5 || "object" != typeof t5 && "function" != typeof t5;
var a2 = Array.isArray;
var u2 = (t5) => a2(t5) || "function" == typeof t5?.[Symbol.iterator];
var d2 = "[ 	\n\f\r]";
var f2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var v = /-->/g;
var _ = />/g;
var m = RegExp(`>|${d2}(?:([^\\s"'>=/]+)(${d2}*=${d2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var p2 = /'/g;
var g = /"/g;
var $2 = /^(?:script|style|textarea|title)$/i;
var y2 = (t5) => (i5, ...s4) => ({ _$litType$: t5, strings: i5, values: s4 });
var x = y2(1);
var b2 = y2(2);
var w = Symbol.for("lit-noChange");
var T = Symbol.for("lit-nothing");
var A = /* @__PURE__ */ new WeakMap();
var E = r3.createTreeWalker(r3, 129);
function C(t5, i5) {
  if (!Array.isArray(t5) || !t5.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return void 0 !== s2 ? s2.createHTML(i5) : i5;
}
var P = (t5, i5) => {
  const s4 = t5.length - 1, o5 = [];
  let r6, l3 = 2 === i5 ? "<svg>" : "", c4 = f2;
  for (let i6 = 0; i6 < s4; i6++) {
    const s5 = t5[i6];
    let a3, u3, d3 = -1, y3 = 0;
    for (; y3 < s5.length && (c4.lastIndex = y3, u3 = c4.exec(s5), null !== u3); )
      y3 = c4.lastIndex, c4 === f2 ? "!--" === u3[1] ? c4 = v : void 0 !== u3[1] ? c4 = _ : void 0 !== u3[2] ? ($2.test(u3[2]) && (r6 = RegExp("</" + u3[2], "g")), c4 = m) : void 0 !== u3[3] && (c4 = m) : c4 === m ? ">" === u3[0] ? (c4 = r6 ?? f2, d3 = -1) : void 0 === u3[1] ? d3 = -2 : (d3 = c4.lastIndex - u3[2].length, a3 = u3[1], c4 = void 0 === u3[3] ? m : '"' === u3[3] ? g : p2) : c4 === g || c4 === p2 ? c4 = m : c4 === v || c4 === _ ? c4 = f2 : (c4 = m, r6 = void 0);
    const x2 = c4 === m && t5[i6 + 1].startsWith("/>") ? " " : "";
    l3 += c4 === f2 ? s5 + n3 : d3 >= 0 ? (o5.push(a3), s5.slice(0, d3) + e3 + s5.slice(d3) + h2 + x2) : s5 + h2 + (-2 === d3 ? i6 : x2);
  }
  return [C(t5, l3 + (t5[s4] || "<?>") + (2 === i5 ? "</svg>" : "")), o5];
};
var V = class _V {
  constructor({ strings: t5, _$litType$: s4 }, n5) {
    let r6;
    this.parts = [];
    let c4 = 0, a3 = 0;
    const u3 = t5.length - 1, d3 = this.parts, [f3, v2] = P(t5, s4);
    if (this.el = _V.createElement(f3, n5), E.currentNode = this.el.content, 2 === s4) {
      const t6 = this.el.content.firstChild;
      t6.replaceWith(...t6.childNodes);
    }
    for (; null !== (r6 = E.nextNode()) && d3.length < u3; ) {
      if (1 === r6.nodeType) {
        if (r6.hasAttributes())
          for (const t6 of r6.getAttributeNames())
            if (t6.endsWith(e3)) {
              const i5 = v2[a3++], s5 = r6.getAttribute(t6).split(h2), e7 = /([.?@])?(.*)/.exec(i5);
              d3.push({ type: 1, index: c4, name: e7[2], strings: s5, ctor: "." === e7[1] ? k : "?" === e7[1] ? H : "@" === e7[1] ? I : R }), r6.removeAttribute(t6);
            } else
              t6.startsWith(h2) && (d3.push({ type: 6, index: c4 }), r6.removeAttribute(t6));
        if ($2.test(r6.tagName)) {
          const t6 = r6.textContent.split(h2), s5 = t6.length - 1;
          if (s5 > 0) {
            r6.textContent = i3 ? i3.emptyScript : "";
            for (let i5 = 0; i5 < s5; i5++)
              r6.append(t6[i5], l2()), E.nextNode(), d3.push({ type: 2, index: ++c4 });
            r6.append(t6[s5], l2());
          }
        }
      } else if (8 === r6.nodeType)
        if (r6.data === o3)
          d3.push({ type: 2, index: c4 });
        else {
          let t6 = -1;
          for (; -1 !== (t6 = r6.data.indexOf(h2, t6 + 1)); )
            d3.push({ type: 7, index: c4 }), t6 += h2.length - 1;
        }
      c4++;
    }
  }
  static createElement(t5, i5) {
    const s4 = r3.createElement("template");
    return s4.innerHTML = t5, s4;
  }
};
function N(t5, i5, s4 = t5, e7) {
  if (i5 === w)
    return i5;
  let h3 = void 0 !== e7 ? s4._$Co?.[e7] : s4._$Cl;
  const o5 = c3(i5) ? void 0 : i5._$litDirective$;
  return h3?.constructor !== o5 && (h3?._$AO?.(false), void 0 === o5 ? h3 = void 0 : (h3 = new o5(t5), h3._$AT(t5, s4, e7)), void 0 !== e7 ? (s4._$Co ??= [])[e7] = h3 : s4._$Cl = h3), void 0 !== h3 && (i5 = N(t5, h3._$AS(t5, i5.values), h3, e7)), i5;
}
var S2 = class {
  constructor(t5, i5) {
    this._$AV = [], this._$AN = void 0, this._$AD = t5, this._$AM = i5;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t5) {
    const { el: { content: i5 }, parts: s4 } = this._$AD, e7 = (t5?.creationScope ?? r3).importNode(i5, true);
    E.currentNode = e7;
    let h3 = E.nextNode(), o5 = 0, n5 = 0, l3 = s4[0];
    for (; void 0 !== l3; ) {
      if (o5 === l3.index) {
        let i6;
        2 === l3.type ? i6 = new M(h3, h3.nextSibling, this, t5) : 1 === l3.type ? i6 = new l3.ctor(h3, l3.name, l3.strings, this, t5) : 6 === l3.type && (i6 = new L(h3, this, t5)), this._$AV.push(i6), l3 = s4[++n5];
      }
      o5 !== l3?.index && (h3 = E.nextNode(), o5++);
    }
    return E.currentNode = r3, e7;
  }
  p(t5) {
    let i5 = 0;
    for (const s4 of this._$AV)
      void 0 !== s4 && (void 0 !== s4.strings ? (s4._$AI(t5, s4, i5), i5 += s4.strings.length - 2) : s4._$AI(t5[i5])), i5++;
  }
};
var M = class _M {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t5, i5, s4, e7) {
    this.type = 2, this._$AH = T, this._$AN = void 0, this._$AA = t5, this._$AB = i5, this._$AM = s4, this.options = e7, this._$Cv = e7?.isConnected ?? true;
  }
  get parentNode() {
    let t5 = this._$AA.parentNode;
    const i5 = this._$AM;
    return void 0 !== i5 && 11 === t5?.nodeType && (t5 = i5.parentNode), t5;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t5, i5 = this) {
    t5 = N(this, t5, i5), c3(t5) ? t5 === T || null == t5 || "" === t5 ? (this._$AH !== T && this._$AR(), this._$AH = T) : t5 !== this._$AH && t5 !== w && this._(t5) : void 0 !== t5._$litType$ ? this.g(t5) : void 0 !== t5.nodeType ? this.$(t5) : u2(t5) ? this.T(t5) : this._(t5);
  }
  k(t5) {
    return this._$AA.parentNode.insertBefore(t5, this._$AB);
  }
  $(t5) {
    this._$AH !== t5 && (this._$AR(), this._$AH = this.k(t5));
  }
  _(t5) {
    this._$AH !== T && c3(this._$AH) ? this._$AA.nextSibling.data = t5 : this.$(r3.createTextNode(t5)), this._$AH = t5;
  }
  g(t5) {
    const { values: i5, _$litType$: s4 } = t5, e7 = "number" == typeof s4 ? this._$AC(t5) : (void 0 === s4.el && (s4.el = V.createElement(C(s4.h, s4.h[0]), this.options)), s4);
    if (this._$AH?._$AD === e7)
      this._$AH.p(i5);
    else {
      const t6 = new S2(e7, this), s5 = t6.u(this.options);
      t6.p(i5), this.$(s5), this._$AH = t6;
    }
  }
  _$AC(t5) {
    let i5 = A.get(t5.strings);
    return void 0 === i5 && A.set(t5.strings, i5 = new V(t5)), i5;
  }
  T(t5) {
    a2(this._$AH) || (this._$AH = [], this._$AR());
    const i5 = this._$AH;
    let s4, e7 = 0;
    for (const h3 of t5)
      e7 === i5.length ? i5.push(s4 = new _M(this.k(l2()), this.k(l2()), this, this.options)) : s4 = i5[e7], s4._$AI(h3), e7++;
    e7 < i5.length && (this._$AR(s4 && s4._$AB.nextSibling, e7), i5.length = e7);
  }
  _$AR(t5 = this._$AA.nextSibling, i5) {
    for (this._$AP?.(false, true, i5); t5 && t5 !== this._$AB; ) {
      const i6 = t5.nextSibling;
      t5.remove(), t5 = i6;
    }
  }
  setConnected(t5) {
    void 0 === this._$AM && (this._$Cv = t5, this._$AP?.(t5));
  }
};
var R = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t5, i5, s4, e7, h3) {
    this.type = 1, this._$AH = T, this._$AN = void 0, this.element = t5, this.name = i5, this._$AM = e7, this.options = h3, s4.length > 2 || "" !== s4[0] || "" !== s4[1] ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = T;
  }
  _$AI(t5, i5 = this, s4, e7) {
    const h3 = this.strings;
    let o5 = false;
    if (void 0 === h3)
      t5 = N(this, t5, i5, 0), o5 = !c3(t5) || t5 !== this._$AH && t5 !== w, o5 && (this._$AH = t5);
    else {
      const e8 = t5;
      let n5, r6;
      for (t5 = h3[0], n5 = 0; n5 < h3.length - 1; n5++)
        r6 = N(this, e8[s4 + n5], i5, n5), r6 === w && (r6 = this._$AH[n5]), o5 ||= !c3(r6) || r6 !== this._$AH[n5], r6 === T ? t5 = T : t5 !== T && (t5 += (r6 ?? "") + h3[n5 + 1]), this._$AH[n5] = r6;
    }
    o5 && !e7 && this.O(t5);
  }
  O(t5) {
    t5 === T ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t5 ?? "");
  }
};
var k = class extends R {
  constructor() {
    super(...arguments), this.type = 3;
  }
  O(t5) {
    this.element[this.name] = t5 === T ? void 0 : t5;
  }
};
var H = class extends R {
  constructor() {
    super(...arguments), this.type = 4;
  }
  O(t5) {
    this.element.toggleAttribute(this.name, !!t5 && t5 !== T);
  }
};
var I = class extends R {
  constructor(t5, i5, s4, e7, h3) {
    super(t5, i5, s4, e7, h3), this.type = 5;
  }
  _$AI(t5, i5 = this) {
    if ((t5 = N(this, t5, i5, 0) ?? T) === w)
      return;
    const s4 = this._$AH, e7 = t5 === T && s4 !== T || t5.capture !== s4.capture || t5.once !== s4.once || t5.passive !== s4.passive, h3 = t5 !== T && (s4 === T || e7);
    e7 && this.element.removeEventListener(this.name, this, s4), h3 && this.element.addEventListener(this.name, this, t5), this._$AH = t5;
  }
  handleEvent(t5) {
    "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t5) : this._$AH.handleEvent(t5);
  }
};
var L = class {
  constructor(t5, i5, s4) {
    this.element = t5, this.type = 6, this._$AN = void 0, this._$AM = i5, this.options = s4;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t5) {
    N(this, t5);
  }
};
var Z = t2.litHtmlPolyfillSupport;
Z?.(V, M), (t2.litHtmlVersions ??= []).push("3.1.0");
var j = (t5, i5, s4) => {
  const e7 = s4?.renderBefore ?? i5;
  let h3 = e7._$litPart$;
  if (void 0 === h3) {
    const t6 = s4?.renderBefore ?? null;
    e7._$litPart$ = h3 = new M(i5.insertBefore(l2(), t6), t6, void 0, s4 ?? {});
  }
  return h3._$AI(t5), h3;
};

// node_modules/lit-element/lit-element.js
var s3 = class extends b {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t5 = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t5.firstChild, t5;
  }
  update(t5) {
    const i5 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t5), this._$Do = j(i5, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(true);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(false);
  }
  render() {
    return w;
  }
};
s3._$litElement$ = true, s3["finalized", "finalized"] = true, globalThis.litElementHydrateSupport?.({ LitElement: s3 });
var r4 = globalThis.litElementPolyfillSupport;
r4?.({ LitElement: s3 });
(globalThis.litElementVersions ??= []).push("4.0.2");

// node_modules/@lit/reactive-element/decorators/custom-element.js
var t3 = (t5) => (e7, o5) => {
  void 0 !== o5 ? o5.addInitializer(() => {
    customElements.define(t5, e7);
  }) : customElements.define(t5, e7);
};

// node_modules/@lit/reactive-element/decorators/property.js
var o4 = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
var r5 = (t5 = o4, e7, r6) => {
  const { kind: n5, metadata: i5 } = r6;
  let s4 = globalThis.litPropertyMetadata.get(i5);
  if (void 0 === s4 && globalThis.litPropertyMetadata.set(i5, s4 = /* @__PURE__ */ new Map()), s4.set(r6.name, t5), "accessor" === n5) {
    const { name: o5 } = r6;
    return { set(r7) {
      const n6 = e7.get.call(this);
      e7.set.call(this, r7), this.requestUpdate(o5, n6, t5);
    }, init(e8) {
      return void 0 !== e8 && this.C(o5, void 0, t5), e8;
    } };
  }
  if ("setter" === n5) {
    const { name: o5 } = r6;
    return function(r7) {
      const n6 = this[o5];
      e7.call(this, r7), this.requestUpdate(o5, n6, t5);
    };
  }
  throw Error("Unsupported decorator location: " + n5);
};
function n4(t5) {
  return (e7, o5) => "object" == typeof o5 ? r5(t5, e7, o5) : ((t6, e8, o6) => {
    const r6 = e8.hasOwnProperty(o6);
    return e8.constructor.createProperty(o6, r6 ? { ...t6, wrapped: true } : t6), r6 ? Object.getOwnPropertyDescriptor(e8, o6) : void 0;
  })(t5, e7, o5);
}

// node_modules/lit-html/directive.js
var t4 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
var e5 = (t5) => (...e7) => ({ _$litDirective$: t5, values: e7 });
var i4 = class {
  constructor(t5) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t5, e7, i5) {
    this._$Ct = t5, this._$AM = e7, this._$Ci = i5;
  }
  _$AS(t5, e7) {
    return this.update(t5, e7);
  }
  update(t5, e7) {
    return this.render(...e7);
  }
};

// node_modules/lit-html/directives/class-map.js
var e6 = e5(class extends i4 {
  constructor(t5) {
    if (super(t5), t5.type !== t4.ATTRIBUTE || "class" !== t5.name || t5.strings?.length > 2)
      throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(t5) {
    return " " + Object.keys(t5).filter((s4) => t5[s4]).join(" ") + " ";
  }
  update(s4, [i5]) {
    if (void 0 === this.it) {
      this.it = /* @__PURE__ */ new Set(), void 0 !== s4.strings && (this.st = new Set(s4.strings.join(" ").split(/\s/).filter((t5) => "" !== t5)));
      for (const t5 in i5)
        i5[t5] && !this.st?.has(t5) && this.it.add(t5);
      return this.render(i5);
    }
    const r6 = s4.element.classList;
    for (const t5 of this.it)
      t5 in i5 || (r6.remove(t5), this.it.delete(t5));
    for (const t5 in i5) {
      const s5 = !!i5[t5];
      s5 === this.it.has(t5) || this.st?.has(t5) || (s5 ? (r6.add(t5), this.it.add(t5)) : (r6.remove(t5), this.it.delete(t5)));
    }
    return w;
  }
});

// src/lib/utils.js
var isFunction = (obj) => {
  return typeof obj == "function" || false;
};

// src/lib/ui-component.js
var UIComponent = class extends s3 {
  /*******************************
              Lifecycle
  *******************************/
  // callback when initialized
  constructor() {
    super();
    if (isFunction(this.on?.created)) {
      this.on?.created.apply(this);
    }
  }
  // callback when added to dom
  connectedCallback() {
    super.connectedCallback();
    if (isFunction(this.on?.rendered)) {
      this.on?.rendered.apply(this);
    }
  }
  // callback if removed from dom
  disconnectedCallback() {
    if (isFunction(this.on?.destroyed)) {
      this.on?.created.apply(this);
    }
  }
  // callback if moves doc
  adoptedCallback() {
    if (isFunction(this.on?.moved)) {
      this.on?.destroyed.apply(this);
    }
  }
  attributeChangedCallback(attribute, oldValue, newValue) {
    console.log("attribute change: ", name, newVal);
    if (isFunction(this.on?.settingChanged)) {
      this.on?.settingChanged.call(this, {
        attribute,
        oldValue,
        newValue
      });
    }
  }
  /*
    SUI lets you specify if you want to use light dom via attribute
  */
  createRenderRoot() {
    const useLight = false;
    if (useLight) {
      return this;
    } else {
      const renderRoot = super.createRenderRoot();
      return renderRoot;
    }
  }
  /*******************************
              CSS
  *******************************/
  /*******************************
         Settings / Attrs
  *******************************/
  get defaultSettings() {
    return {};
  }
  /*******************************
           DOM Helpers
  *******************************/
  queryScoped(selector) {
    return this.shadowRoot.querySelector(selector);
  }
  queryAllScoped(selector) {
    return this.shadowRoot.querySelectorAll(selector);
  }
  // Shadow DOM
  $(selector) {
    return $(selector, this.shadowRoot);
  }
  // DOM
  $$(selector) {
    return $(selector, this);
  }
};

// src/button/button.ts
var UIButton = class extends UIComponent {
  constructor() {
    super(...arguments);
    this.settings = {
      size: "medium",
      emphasis: "primary",
      icon: false,
      text: true
    };
    this.on = {
      created() {
        console.log("on created");
      },
      settingChanged(...params) {
        console.log("on attribute change", params);
      },
      rendered() {
        setTimeout(() => {
          console.log("test");
          this.settings.emphasis = "primary";
        }, 600);
      },
      moved() {
        console.log("moved from DOM");
      },
      destroyed() {
        console.log("on destroy");
      }
    };
    this.get = {
      buttonClass() {
        const settings = this.settings;
        return e6({
          primary: settings.emphasis == "primary",
          secondary: settings.emphasis == "secondary",
          icon: false
        });
      }
    };
  }
  static get styles() {
    return r(button_default);
  }
  template() {
    console.log("template");
  }
  render() {
    let icon;
    let text;
    let label;
    if (this.settings?.icon) {
      icon = x`
        <span class="icon">
          <slot name="icon"></slot>
        </span>
      `;
    }
    if (this.settings?.text) {
      text = x`
        <span class="text" name="text">
          <slot></slot>
        </span>
      `;
    }
    if (this.settings?.label) {
      label = x`
        <span class="label">
          <slot name="label"></slot>
        </span>
      `;
    }
    return x`
      <div class="${this.get.buttonClass.apply(this)} button" name="button" tabindex="0">
        ${icon}
        ${text}
        ${label}
      </div>
    `;
  }
};
__decorateClass([
  n4({
    attribute: false,
    type: Object,
    hasChanged: (a3, b3) => {
      console.log("has changed?", a3, b3);
      return true;
    }
  })
], UIButton.prototype, "settings", 2);
UIButton = __decorateClass([
  t3("ui-button")
], UIButton);
export {
  UIButton
};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/class-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=semantic-ui.js.map
