import * as React from "react";
import * as ReactDOM from "react-dom";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github.css";
import "./ui.css";

const App: React.FC = () => {
  const [code, setCode] = React.useState("// nothing here yet...");
  const [highlightedCode, setHighlightedCode] = React.useState("");

  React.useEffect(() => {
    window.onmessage = (msg) => {
      const pluginMsg = msg.data.pluginMessage;
      if (pluginMsg.type === "code") {
        setCode(pluginMsg.code);
      }
    };
  });

  React.useEffect(() => {
    hljs.registerLanguage("javascript", javascript);
  }, []);

  React.useEffect(() => {
    setHighlightedCode(hljs.highlight("javascript", code).value);
  }, [code]);

  const onGenerateClick = () => {
    window.parent.postMessage({ pluginMessage: { type: "generate" } }, "*");
  };

  return (
    <>
      <div>
        <h2>figma &#8594; source</h2>
        <button className="button-primary" onClick={onGenerateClick}>
          Generate
        </button>
        <pre
          className="code"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </div>
      <script></script>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("react-page"));
