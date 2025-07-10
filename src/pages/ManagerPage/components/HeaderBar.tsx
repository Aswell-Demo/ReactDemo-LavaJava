// 🧾【このファイルの目的】
// 管理者画面の上部ヘッダー部分を表示するコンポーネント。
// ・ログイン中の管理者の氏名と権限（ロール）を表示
// ・ログアウトボタン押下時に Firebase の signOut を実行し、ログイン画面に遷移

import React from "react";
import { signOut } from "firebase/auth"; // Firebase認証からログアウト処理をインポート
import { auth, firestore } from "../../../firebase"; // Firebase構成ファイル（パスはプロジェクトに応じて調整）
import { useNavigate } from "react-router-dom"; // ページ遷移に使用
import { doc, getDoc } from "firebase/firestore"; // Firestoreドキュメント取得用（※このファイルでは未使用）

// 📌 Props定義（親から受け取るデータ）
// ・name：ログイン中の管理者の名前
// ・role：管理者のロール（例：「manager」「admin」など）
type Props = {
  name: string;
  role: string;
};

// --------------------- 🖼 ヘッダーコンポーネント本体 ---------------------
const HeaderBar: React.FC<Props> = ({ name, role }) => {
  const navigate = useNavigate(); // ページ遷移関数（ログアウト後のリダイレクトに使用）

  // 🔓 ログアウト処理（ボタン押下時に実行）
  const handleLogout = async () => {
    await signOut(auth); // Firebaseのセッションを終了
    navigate("/"); // ログイン画面へ戻る
  };

  // --------------------- 🧱 JSX描画部（ヘッダーUI） ---------------------
  return (
    <header className="manager-header">
      {/* 👤 左側：ユーザー氏名とロールの表示 */}
      <div className="manager-header-left">
        <span className="manager-user-name">{name}</span>
        <span className="manager-user-role">権限：{role}</span>
      </div>

      {/* 🔓 右側：ログアウトボタン */}
      <div className="manager-header-right">
        <button className="nav-button logout-button" onClick={handleLogout}>
          <i className="bx bx-log-in"></i> ログアウト
        </button>
      </div>
    </header>
  );
};

// 📤 外部コンポーネントから使用可能にするためエクスポート
export default HeaderBar;
