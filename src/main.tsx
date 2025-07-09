// 🚀【このファイルの目的】
// アプリケーションのエントリーポイント。
// index.html の <div id="root"> に React アプリ全体（App）を描画する。

// --------------------- 🔧 Reactの基本機能をインポート ---------------------
import { StrictMode } from "react"; // 開発中の問題検出を強化するモード
import { createRoot } from "react-dom/client"; // React 18 以降のレンダリングAPI

// --------------------- 🎨 グローバルCSSの読み込み ---------------------
import "./index.css"; // アプリ全体に適用される共通スタイル

// --------------------- 🌟 メインアプリケーションのインポート ---------------------
import App from "./App.tsx"; // アプリ本体（ルーティングや画面構成）

// --------------------- 📍 DOMの"root"要素にReactアプリをマウント ---------------------
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App /> {/* 🎯 AppをStrictModeでラップして描画 */}
  </StrictMode>,
);
