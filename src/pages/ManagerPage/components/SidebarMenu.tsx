// 📑【このファイルの目的】
// 管理者ページのサイドメニュー（Sidebar）コンポーネント。
// ・注文ステータスの切り替えボタンを表示（例：受注、発注）
// ・現在選択中の状態をハイライト
// ・親コンポーネントに現在のステータスを通知する

import React, { useState } from "react";

// --------------------- 📌 Props定義 ---------------------
// ・onStatusChange：選択中のステータスを親コンポーネントに渡す関数
type Props = {
  onStatusChange: (status: string) => void;
};

// --------------------- 🖼 SidebarMenu コンポーネント本体 ---------------------
const SidebarMenu: React.FC<Props> = ({ onStatusChange }) => {
  // 🔁 サイドバーに表示するステータス項目（追加時はここを変更）
  const statusOptions = ["受注", "受注確認", "発注", "納品", "権限管理"];

  // ✅ 現在選択中のステータス（初期値は「受注」）
  const [currentStatus, setCurrentStatus] = useState("受注");

  // 🔄 ボタンクリック時の処理
  // ・選択状態を更新し、親に通知
  const handleClick = (status: string) => {
    setCurrentStatus(status); // 選択状態を更新
    onStatusChange(status); // 親コンポーネントに通知
  };

  // --------------------- 🧱 JSX描画部分 ---------------------
  return (
    <nav className="manager-sidebar">
      {/* メニュー見出し */}
      <p className="manager-sidemenu-heading">受注管理</p>

      {/* メニュー項目のループ表示 */}
      {statusOptions.map((status) => (
        <li className="item-list" key={status}>
          <button
            className={`nav-button ${currentStatus === status ? "active" : ""}`}
            onClick={() => handleClick(status)} // 状態変更処理を実行
          >
            {/* 特別な名称置き換え（「権限管理」→「人員管理」） */}
            {status === "権限管理" ? "人員管理" : status}
          </button>
        </li>
      ))}
    </nav>
  );
};

// 📤 外部から使用できるようエクスポート
export default SidebarMenu;
