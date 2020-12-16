type Priority = "primary" | "secondary" | "tertiary" | "subdued";
type Size = "default" | "small" | "xsmall"
interface SourceButtonInfo {
  priority: Priority,
  size: Size,
  text: string,
}

const parsePriority = (priority: string): Priority => {
  if (priority === 'Primary') {
    return 'primary'
  }
  else if (priority === 'Secondary') {
    return 'secondary'
  }
  else if (priority === 'Tertiary') {
    return 'tertiary'
  }
  else {
    return 'subdued'
  }
}

const parseSize = (size: string): Size => {
  if (size === 'md') {
    return 'default'
  } 
  else if (size === 'sm') {
    return 'small'
  }
  else {
    return 'xsmall'
  }
}

const NAME_REGEX = /\d\. (Primary|Secondary|Tertiary|Subdued) (md|sm|xsm)/ 

const parseText = (node: InstanceNode, priority: Priority): string => {
  let frameNode: FrameNode;
  if (priority === 'primary') {
    frameNode = node.children[0] as FrameNode;
  } else {
    frameNode = (node.children[0] as FrameNode).children[0] as FrameNode;
  }
  const textNode = frameNode.children[0] as TextNode;

  return textNode.characters;
}

const parseNode = (node: InstanceNode): SourceButtonInfo => {
  const name = node.name;
  const match = name.match(NAME_REGEX)
  const priority = parsePriority(match[1])
  const size = parseSize(match[2]);
  const text = parseText(node, priority);

  return { priority, size, text }
}

const getSourceButtonCode = (info: SourceButtonInfo): string => {
  return (
  `
<Button
  priority="${info.priority}"
  size="${info.size}"
>
  ${info.text}
</Button>`
  )

}

const sendCodeToUi = (text: string): void => {
  figma.ui.postMessage({ type: "code", code: text})
}

figma.showUI(__html__);

figma.ui.onmessage = msg => {
  if (msg.type === "generate") {
    const nodes = figma.currentPage.selection;
    const node = nodes[0] as InstanceNode;

    const info = parseNode(node);
    const code = getSourceButtonCode(info);

    sendCodeToUi(code);
  }
};
