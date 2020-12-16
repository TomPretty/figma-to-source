/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/code.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/code.ts":
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

const parsePriority = (priority) => {
    if (priority === 'Primary') {
        return 'primary';
    }
    else if (priority === 'Secondary') {
        return 'secondary';
    }
    else if (priority === 'Tertiary') {
        return 'tertiary';
    }
    else {
        return 'subdued';
    }
};
const parseSize = (size) => {
    if (size === 'md') {
        return 'default';
    }
    else if (size === 'sm') {
        return 'small';
    }
    else {
        return 'xsmall';
    }
};
const parseIconPosition = (iconPosition) => {
    if (iconPosition === "icon-left" || iconPosition === "icon-right" || iconPosition === "icon") {
        return iconPosition;
    }
    return null;
};
const parseIconType = (node) => {
    const vectorNode = node.findAll(node => node.type === "VECTOR")[0];
    if (!vectorNode) {
        return null;
    }
    const name = vectorNode.name;
    if (name === "Tick") {
        return "Checkmark";
    }
    else if (name === "Arrows right") {
        return "ArrowRightStraight";
    }
    else if (name === "Close") {
        return "Cross";
    }
    return null;
};
const NAME_REGEX = /\d\. (Primary|Secondary|Tertiary|Subdued) (md|sm|xsm)(?: (icon-left|icon-right|icon))?/;
const parseText = (node) => {
    const textNode = node.findAll(node => node.type === "TEXT")[0];
    if (!textNode) {
        return '';
    }
    return textNode.characters;
};
const parseNode = (node) => {
    const name = node.name;
    const match = name.match(NAME_REGEX);
    const priority = parsePriority(match[1]);
    const size = parseSize(match[2]);
    let icon;
    const iconPosition = parseIconPosition(match[3]);
    const iconType = parseIconType(node);
    if (iconPosition && iconType) {
        icon = { position: iconPosition, type: iconType };
    }
    const text = parseText(node);
    return { priority, size, icon, text };
};
const getSourceIconCode = (icon) => {
    let svgCode = "";
    if (icon.type === 'Checkmark') {
        svgCode = "icon={<SvgCheckmark />}";
    }
    else if (icon.type === 'ArrowRightStraight') {
        svgCode = "icon={<SvgArrowRightStraight />}";
    }
    else if (icon.type === 'Cross') {
        svgCode = "icon={<SvgCross />}";
    }
    let iconSideCode = "";
    if (icon.position === "icon-left") {
        iconSideCode = "iconSide=\"left\"";
    }
    else if (icon.position === "icon-right") {
        iconSideCode = "iconSide=\"right\"";
    }
    else if (icon.position === "icon") {
        iconSideCode = "hideLabel={true}";
    }
    return `${svgCode}\n  ${iconSideCode}`;
};
const getSourceButtonCode = (info) => {
    return (`
<Button
  priority="${info.priority}"
  size="${info.size}"
  ${!!info.icon ? getSourceIconCode(info.icon) : ''}
>
  ${info.text}
</Button>`);
};
const sendCodeToUi = (text) => {
    figma.ui.postMessage({ type: "code", code: text });
};
figma.showUI(__html__);
figma.ui.onmessage = msg => {
    if (msg.type === "generate") {
        const nodes = figma.currentPage.selection;
        const node = nodes[0];
        const info = parseNode(node);
        const code = getSourceButtonCode(info);
        sendCodeToUi(code);
        console.log(info);
    }
};


/***/ })

/******/ });