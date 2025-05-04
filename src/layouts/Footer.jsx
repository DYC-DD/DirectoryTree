import React, { useEffect, useRef, useState } from "react";
import "../styles/Footer.css";

const Footer = () => {
  const footerRef = useRef(null);
  const [visitCount, setVisitCount] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        document.body.classList.toggle("footer-pull", entry.isIntersecting);
      });
    });

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // 判斷是否為開發環境 本地開發時不執行
    const isDev = window.location.hostname === "localhost";
    if (isDev) {
      console.log("開發模式中：不觸發計數器 API");
      return;
    }

    const apiUrl =
      "https://script.google.com/macros/s/AKfycbxykIhtzXWml5oAPiYxpeSP7X380CQ7KBfrtI_XFlu9uo0fJT5lfr2XcdT-8HZYtM3Fkg/exec";
    const storageKey = "last-visit-timestamp";
    const limitMinutes = 5; // 限制間隔 n 分鐘

    const now = Date.now();
    const lastVisit = parseInt(localStorage.getItem(storageKey), 10);

    // 如果是首次或已過 n 分鐘，就記錄一次並更新時間戳
    if (isNaN(lastVisit) || now - lastVisit > limitMinutes * 60 * 1000) {
      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          setVisitCount(data.totalViews);
          localStorage.setItem(storageKey, now.toString());
        })
        .catch((err) => console.error("計數器讀取失敗", err));
    } else {
      // n 分鐘內不再計數 仍顯示目前次數（不會再寫入）
      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => setVisitCount(data.totalViews));
    }
  }, []);

  return (
    <footer id="footer" ref={footerRef} className="animated-footer">
      <p className="VisitCount">
        Total website visits:
        {visitCount !== null
          ? new Intl.NumberFormat().format(visitCount)
          : "Loading..."}
      </p>
      <p>© 2025 DYC. All rights reserved.</p>
      <p>
        Developed and maintained by{" "}
        <a
          href="https://github.com/DYC-DD"
          target="_blank"
          rel="noopener noreferrer"
        >
          DYC-DD
        </a>
      </p>
      <p>
        <a href="mailto:dyccc01@gmail.com">Contact Us</a>
      </p>
    </footer>
  );
};

export default Footer;
