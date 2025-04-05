import React, { useState, useRef, useEffect } from "react";
import "../styles/Home.css";
import PixelCard from "../components/PixelCard/PixelCard";
import GooeyNav from "../components/GooeyNav/GooeyNav";
import { useTranslation } from "react-i18next";

function Home() {
  const [markdown, setMarkdown] = useState("");
  const [files, setFiles] = useState([]);
  const [excludedItems, setExcludedItems] = useState({
    ".git": false,
    ".DS_Store": false,
    node_modules: false,
  });
  const [customExcludesExact, setCustomExcludesExact] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [allNames, setAllNames] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const textRef = useRef(null);
  const fileInputRef = useRef(null);
  const [rootFolderName, setRootFolderName] = useState("directory_tree");
  const { t, i18n } = useTranslation();
  const languageItems = [
    { label: "繁體中文", language: "zhhant", href: "#" },
    { label: "简体中文", language: "zhhans", href: "#" },
    { label: "English", language: "en", href: "#" },
    { label: "日本語", language: "ja", href: "#" },
    { label: "한국어", language: "ko", href: "#" },
    { label: "Español", language: "es", href: "#" },
    { label: "Français", language: "fr", href: "#" },
    { label: "Deutsch", language: "de", href: "#" },
    { label: "हिंदी", language: "hi", href: "#" },
  ];

  useEffect(() => {
    if (files.length > 0) {
      const uniqueNames = new Set();
      files.forEach((file) => {
        const parts = file.path.split("/");
        parts.forEach((p) => uniqueNames.add(p));
      });
      setAllNames(Array.from(uniqueNames));

      const activeExcludes = [
        ...Object.entries(excludedItems)
          .filter(([_, isActive]) => isActive)
          .map(([item]) => item),
        ...customExcludesExact,
      ];

      const filteredFiles = files.filter((file) => {
        const parts = file.path.split("/");
        return !parts.some((part) => activeExcludes.includes(part));
      });

      processFiles(filteredFiles);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excludedItems, customExcludesExact, files]);

  const handleDrop = async (e) => {
    e.preventDefault();
    const items = e.dataTransfer.items;
    if (!items) return;

    const filesArray = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i].webkitGetAsEntry();
      if (item) {
        await traverseFileTree(item, "", filesArray);
      }
    }
    setFiles(filesArray);
  };

  const handleFileSelect = async (e) => {
    const fileList = Array.from(e.target.files);
    const filesArray = fileList.map((file) => ({
      path: file.webkitRelativePath,
    }));
    setFiles(filesArray);
  };

  const traverseFileTree = async (item, path, result) => {
    return new Promise((resolve) => {
      if (item.isFile) {
        item.file((file) => {
          result.push({ path: path + file.name });
          resolve();
        });
      } else if (item.isDirectory) {
        const dirReader = item.createReader();
        dirReader.readEntries(async (entries) => {
          for (const entry of entries) {
            await traverseFileTree(entry, path + item.name + "/", result);
          }
          resolve();
        });
      }
    });
  };

  const processFiles = (files) => {
    files.sort((a, b) => {
      const aParts = a.path.split("/");
      const bParts = b.path.split("/");
      return aParts.length === bParts.length
        ? a.path.localeCompare(b.path)
        : aParts.length - bParts.length;
    });

    const tree = buildTree(files);
    const md = renderTree(tree);
    setMarkdown(md);
  };

  const buildTree = (files) => {
    const root = {};
    if (files.length > 0) {
      const firstPath = files[0].path;
      const parts = firstPath.split("/");
      if (parts.length > 1) {
        setRootFolderName(parts[0]);
      }
    }

    for (const file of files) {
      const parts = file.path.split("/");
      let current = root;
      parts.forEach((part, i) => {
        const isFolder = i !== parts.length - 1;
        const key = isFolder ? part + "/" : part;
        if (!current[key]) {
          current[key] = isFolder ? {} : null;
        }
        current = current[key];
      });
    }
    return root;
  };

  const renderTree = (tree, indent = "", isRoot = true) => {
    let md = "";
    const entries = Object.entries(tree).sort(([a], [b]) => {
      const isDirA = tree[a] !== null;
      const isDirB = tree[b] !== null;
      if (isDirA !== isDirB) return isDirA ? -1 : 1;
      return a.localeCompare(b);
    });

    entries.forEach(([key, value], idx) => {
      const isLast = idx === entries.length - 1;
      const prefix = isRoot ? "" : indent + (isLast ? "└── " : "├── ");
      md += prefix + key + "\n";
      if (value !== null) {
        const deeperIndent = isRoot ? "" : indent + (isLast ? "    " : "│   ");
        md += renderTree(value, deeperIndent, false);
      }
    });

    return md;
  };

  const copyToClipboard = () => {
    if (textRef.current) {
      navigator.clipboard.writeText(markdown);
    }
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const filename = `${rootFolderName}.md`;
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClickZone = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const filteredSuggestions = allNames
    .filter(
      (name) =>
        name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !customExcludesExact.includes(name)
    )
    .slice(0, 10);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      const selected = filteredSuggestions[highlightIndex];
      if (selected) {
        setCustomExcludesExact([...customExcludesExact, selected]);
        setInputValue("");
        setHighlightIndex(-1);
      }
    }
  };

  return (
    <div className="container">
      <h1>{t("title")}</h1>

      <div className="checkbox">
        <span>{t("hideLabel")}</span>
        {Object.keys(excludedItems).map((item) => (
          <button
            key={item}
            onClick={() =>
              setExcludedItems((prev) => ({
                ...prev,
                [item]: !prev[item],
              }))
            }
            className={`exclude-button ${excludedItems[item] ? "active" : ""}`}
          >
            {item}
          </button>
        ))}

        <div className="custom-input-wrapper">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setHighlightIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            placeholder={t("inputPlaceholder")}
            className="custom-input"
          />
          {inputValue && (
            <div className="suggestion-list">
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((name, index) => (
                  <div
                    key={name}
                    onClick={() => {
                      setCustomExcludesExact([...customExcludesExact, name]);
                      setInputValue("");
                      setHighlightIndex(-1);
                    }}
                    className={`suggestion-item ${
                      highlightIndex === index ? "highlighted" : ""
                    } ${index % 2 === 0 ? "even" : "odd"}`}
                  >
                    {name}
                  </div>
                ))
              ) : (
                <div className="no-suggestions">{t("noSuggestions")}</div>
              )}
            </div>
          )}
        </div>

        {customExcludesExact.length > 0 && (
          <div className="custom-excludes">
            {customExcludesExact.map((name) => (
              <span
                key={name}
                onClick={() =>
                  setCustomExcludesExact(
                    customExcludesExact.filter((n) => n !== name)
                  )
                }
                className="exclude-tag"
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        webkitdirectory="true"
        directory=""
        multiple
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleClickZone}
      >
        <PixelCard variant="blue" />
        <div className="drop-text">{t("dropZoneText")}</div>
      </div>

      <div className="output-container">
        <div className="output-header">
          <span>Markdown</span>
          <div className="button-group">
            <button onClick={copyToClipboard}>
              <img
                src={`${process.env.PUBLIC_URL}/images/copy-solid.png`}
                alt="copy"
                className="icon"
              />
              {t("copy")}
            </button>
            <button onClick={downloadMarkdown}>
              <img
                src={`${process.env.PUBLIC_URL}/images/download-solid.png`}
                alt="download"
                className="icon"
              />
              {t("download")}
            </button>
          </div>
        </div>
        <pre className="output" ref={textRef}>
          {markdown}
        </pre>
      </div>

      <p className="note">
        {t("note")
          .split("\n")
          .map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
      </p>
      <div className="languageItems">
        <GooeyNav
          items={languageItems}
          animationTime={600}
          pCount={15}
          minDistance={20}
          maxDistance={42}
          maxRotate={75}
          colors={[1, 2, 3, 1, 2, 3, 1, 4]}
          timeVariance={300}
          onItemClick={(item) => i18n.changeLanguage(item.language)}
        />
      </div>
    </div>
  );
}

export default Home;
