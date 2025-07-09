// 🧾【このファイルの目的】
// 顧客ページ上部に表示されるヘッダーコンポーネント。
// ・ログイン中のユーザー名とロール（例：「顧客」）の表示
// ・「新規注文」と「注文履歴」の表示切替機能
// ・ログアウトボタンの表示および処理

// --------------------- 🔧 必要なライブラリの読み込み ---------------------
import React from "react";
import { signOut } from "firebase/auth"; // Firebaseのログアウト関数
import { auth } from "../../../firebase"; // Firebaseの認証インスタンス（プロジェクト構成に応じてパス調整）
import { useNavigate } from "react-router-dom"; // ページ遷移用のフック

// --------------------- 📌 Propsの型定義 ---------------------
// ・name：ログイン中ユーザーの名前
// ・role：ユーザーのロール（例：「顧客」）
// ・onViewChange：表示モード切り替え用コールバック関数（親コンポーネントから渡される）
type Props = {
  name: string;
  role: string;
  onViewChange: (view: "new" | "history") => void;
};

// --------------------- 🖼 ヘッダーコンポーネント本体 ---------------------
const HeaderBar: React.FC<Props> = ({ name, role, onViewChange }) => {
  const navigate = useNavigate(); // ページ遷移用フック
  const [currentView, setCurrentView] = React.useState<"new" | "history">(
    "history",
  ); // 現在表示中のモード（初期値は注文履歴）

  // 🧭 表示切り替え処理
  // 「新規注文」または「注文履歴」ボタンを押したときに呼び出される
  // ・currentViewの状態を更新
  // ・親コンポーネントに現在の表示モードを伝える
  const handleSwitch = (view: "new" | "history") => {
    setCurrentView(view);
    onViewChange(view);
  };

  // 🔒 ログアウト処理
  // FirebaseのsignOutを呼び出してセッションを終了し、トップページへリダイレクト
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  // --------------------- 🧱 JSXの描画部分 ---------------------
  return (
    <header className="customer-header">
      {/* 👤 左側：ユーザー名とロールの表示 */}
      <div className="header-left">
        <span className="user-name">{name}</span>
        <span className="user-role">（{role}）</span>
      </div>

      {/* 📌 右側：画面切り替えボタンとログアウトボタン */}
      <div className="header-right">
        {/* 「新規注文」ボタン（選択中はactiveクラス付与） */}
        <button
          className={`nav-button nav-new ${currentView === "new" ? "active" : ""}`}
          onClick={() => handleSwitch("new")}
        >
          新規注文
        </button>

        {/* 「注文履歴」ボタン（選択中はactiveクラス付与） */}
        <button
          className={`nav-button nav-history ${currentView === "history" ? "active" : ""}`}
          onClick={() => handleSwitch("history")}
        >
          注文履歴
        </button>

        {/* ログアウトボタン */}
        <button className="nav-button logout-button" onClick={handleLogout}>
          ログアウト
        </button>
      </div>
    </header>
  );
};

// 📤 外部からこのコンポーネントを使用可能にするためエクスポート
export default HeaderBar;
