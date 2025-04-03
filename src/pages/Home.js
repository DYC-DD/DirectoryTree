import React, { useState, useRef } from "react";
import "../styles/Home.css";

function Home() {
  const [markdown, setMarkdown] = useState("拖曳資料夾或點選區塊選擇資料夾");
  const [hideDotfiles, setHideDotfiles] = useState(false);
  const textRef = useRef(null);
  const fileInputRef = useRef(null);
  const [rootFolderName, setRootFolderName] = useState("directory_tree");

  const handleDrop = async (e) => {
    e.preventDefault();
    const items = e.dataTransfer.items;
    if (!items) return;

    const files = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i].webkitGetAsEntry();
      if (item) {
        await traverseFileTree(item, "", files, hideDotfiles);
      }
    }

    processFiles(files);
  };

  const handleFileSelect = async (e) => {
    const fileList = Array.from(e.target.files);

    const filtered = hideDotfiles
      ? fileList.filter((file) => {
          const parts = file.webkitRelativePath.split("/");
          return !parts.some((part) => part.startsWith("."));
        })
      : fileList;

    const files = filtered.map((file) => ({
      path: file.webkitRelativePath,
    }));

    processFiles(files);
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

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClickZone = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const traverseFileTree = async (item, path, result, hide) => {
    return new Promise((resolve) => {
      if (hide && item.name.startsWith(".")) {
        return resolve();
      }

      if (item.isFile) {
        item.file((file) => {
          result.push({ path: path + file.name });
          resolve();
        });
      } else if (item.isDirectory) {
        const dirReader = item.createReader();
        dirReader.readEntries(async (entries) => {
          for (const entry of entries) {
            await traverseFileTree(entry, path + item.name + "/", result, hide);
          }
          resolve();
        });
      }
    });
  };

  const buildTree = (files) => {
    const root = {};
    if (files.length > 0) {
      const firstPath = files[0].path;
      const parts = firstPath.split("/");
      if (parts.length > 1) {
        setRootFolderName(parts[0]); // 只取最上層資料夾名稱
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

  return (
    <div className="container">
      <h1>📁 拖曳或點擊選擇資料夾 ➜ 自動產出 Markdown 目錄樹</h1>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={hideDotfiles}
          onChange={(e) => setHideDotfiles(e.target.checked)}
        />
        隱藏以「.」開頭的檔案或資料夾（如 .git）
      </label>

      {/* 隱藏的資料夾選擇 input */}
      <input
        ref={fileInputRef}
        type="file"
        webkitdirectory="true"
        directory=""
        multiple
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {/* 拖曳與點擊區 */}
      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClickZone}
      >
        📂 請拖曳整個資料夾或點擊此區塊選擇資料夾
      </div>

      <div className="output-container">
        <div className="output-header">
          <span>Markdown</span>
          <div className="button-group">
            <button onClick={copyToClipboard}>
              <img
                src={`${process.env.PUBLIC_URL}/images/copy-solid.png`}
                alt="複製"
                className="icon"
              />
              複製
            </button>
            <button onClick={downloadMarkdown}>
              <img
                src={`${process.env.PUBLIC_URL}/images/download-solid.png`}
                alt="下載"
                className="icon"
              />
              下載
            </button>
          </div>
        </div>
        <pre className="output" ref={textRef}>
          {markdown}
        </pre>
      </div>
    </div>
  );
}

export default Home;
