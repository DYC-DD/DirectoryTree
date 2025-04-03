// // Footer.js
// import React, { useEffect } from "react";
// import "../styles/Footer.css"; // 匯入獨立的 CSS 檔案

// const Footer = () => {
//   useEffect(() => {
//     // 開發者彩蛋：在瀏覽器 Console 顯示訊息
//     console.log(
//       "%c你好，工程師 👋",
//       "color: #16a34a; font-size: 20px; font-weight: bold;"
//     );
//     console.log(
//       "%c本網站為純前端構建，不會上傳或儲存任何資料 🛡️",
//       "color: #4b5563; font-size: 14px;"
//     );
//     console.log(
//       "%c有興趣了解程式碼嗎？歡迎來看看 👉 https://github.com/your-github",
//       "color: #1d4ed8; font-size: 14px;"
//     );
//   }, []);

//   return (
//     <footer className="custom-footer">
//       {/* 版權宣告 */}
//       <p>© 2025 MyWebsite. All rights reserved.</p>

//       {/* 免責聲明 / 警語 */}
//       <p>
//         本網站為純前端應用程式，所有操作皆在瀏覽器中執行，
//         不會上傳或儲存任何資料。本站所提供之內容僅供學習與參考用途，
//         請勿用於商業或非法用途，本站不負任何法律責任。
//       </p>

//       {/* 網站製作 / 開發者資訊 */}
//       <p>
//         網站由{" "}
//         <a
//           href="https://github.com/your-github"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Your Name
//         </a>{" "}
//         開發維護
//       </p>

//       {/* 聯絡方式 */}
//       <p>
//         聯絡我們：<a href="mailto:contact@example.com">contact@example.com</a>
//       </p>
//     </footer>
//   );
// };

// export default Footer;

import React, { useEffect, useRef } from "react";
import "../styles/Footer.css";

const Footer = () => {
  const footerRef = useRef(null);

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
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <footer id="footer" ref={footerRef} className="animated-footer">
      <p>© 2025 DYC. All rights reserved.</p>
      <p>
        This website is a purely frontend application. All operations are
        executed within your browser. No data is uploaded or stored. You can use
        it with confidence.
      </p>
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

      {/* 聯絡方式 */}
      <p>
        <a href="dyccc01@gmail.com">Contact Us</a>
      </p>
    </footer>
  );
};

export default Footer;
