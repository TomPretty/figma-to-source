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
const NAME_REGEX = /\d\. (Primary|Secondary|Tertiary|Subdued) (md|sm|xsm)/;
const parseText = (node, priority) => {
    let frameNode;
    if (priority === 'primary') {
        frameNode = node.children[0];
    }
    else {
        frameNode = node.children[0].children[0];
    }
    const textNode = frameNode.children[0];
    return textNode.characters;
};
const parseNode = (node) => {
    const name = node.name;
    const match = name.match(NAME_REGEX);
    const priority = parsePriority(match[1]);
    const size = parseSize(match[2]);
    const text = parseText(node, priority);
    return { priority, size, text };
};
const getSourceButtonCode = (info) => {
    return (`
<Button
  priority="${info.priority}"
  size="${info.size}"
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
    }
};
