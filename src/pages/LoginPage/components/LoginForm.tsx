// 🧾【このファイルの目的】
// ログインフォームコンポーネント。
// ・メールアドレスとパスワードを入力
// ・パスワードの表示/非表示を切り替え可能
// ・ログインボタンで認証処理を実行
// ・新規登録画面への誘導リンクも含む

// --------------------- 🔧 ReactとProps型定義の読み込み ---------------------
import React, { useState } from "react";

// --------------------- 🖼 ログインフォームコンポーネント本体 ---------------------
const LoginForm: React.FC<{
  onLogin: (email: string, password: string) => void;
  onRegisterClick: () => void;
}> = ({ onLogin, onRegisterClick }) => {
  // 📥 入力状態のローカルステート
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // ✅ フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください。");
      return;
    }
    setError("");
    onLogin(email, password); // 親に処理を委ねる
  };

  return (
    <div className="login-container" style={{ padding: "2rem" }}>
      {/* 🏷 タイトル */}
      <h2 className="login-title">ログイン</h2>

      {/* 📝 ログインフォーム本体 */}
      <form className="login-form" onSubmit={handleSubmit}>
        {/* 📧 メールアドレス入力欄 */}
        <div className="login-field">
          <label className="login-label">メールアドレス：</label>
          <input
            className="login-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* 🔐 パスワード入力欄 + 表示切替ボタン */}
        <div className="login-field">
          <label className="login-label">パスワード：</label>
          <div
            className="login-password-wrapper"
            style={{ display: "flex", alignItems: "center" }}
          >
            <input
              className="login-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password-button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ marginLeft: "8px" }}
            >
              {showPassword ? "非表示" : "表示"}
            </button>
          </div>
        </div>

        {/* 🚪 ログイン送信ボタン */}
        <button className="login-button" type="submit">
          ログイン
        </button>
      </form>

      {/* ❌ 認証エラー表示 */}
      {error && (
        <p className="login-error" style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* ➕ 新規登録リンク */}
      <p className="login-register-link" style={{ marginTop: "1rem" }}>
        アカウントをお持ちでない方はこちら：
        <button className="register-button" onClick={onRegisterClick}>
          新規登録
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
