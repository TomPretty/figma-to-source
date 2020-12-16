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
