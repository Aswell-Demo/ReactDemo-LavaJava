// 🧾【このファイルの目的】
// ログインフォームコンポーネント。
// ・メールアドレスとパスワードを入力
// ・パスワードの表示/非表示を切り替え可能
// ・ログインボタンで認証処理を実行
// ・新規登録画面への誘導リンクも含む

// --------------------- 🔧 ReactとProps型定義の読み込み ---------------------
// --------------------- 🔧 ReactとFirebaseの読み込み ---------------------
import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase";

// --------------------- 🖼 ログインフォームコンポーネント本体 ---------------------
const LoginForm: React.FC<{
  loginError?: string; // 🔸 這一行是關鍵！
  onLogin: (email: string, password: string) => void;
  onRegisterClick: () => void;
}> = ({ onLogin, onRegisterClick, loginError }) => {
  // 📥 入力状態
  const [isLoading, setIsLoading] = useState(false); // 🔄 ローディング状態
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // 🔁 リセットメール用
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  // ✅ 通常ログイン処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔍 入力チェック
    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください。");
      return;
    }

    setError("");
    setIsLoading(true); // ⏳ ローディング状態開始

    try {
      await onLogin(email, password); // 🔐 Firebase 認証呼び出し
    } finally {
      setIsLoading(false); // ✅ 認証終了後はローディングを終了（成功・失敗問わず）
    }
  };

  // 🔐 パスワードリセット送信
  // 🔐 パスワードリセットメール送信処理
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault(); // 🔁 フォームのデフォルト動作を無効化

    try {
      // 📩 Firebase Auth 経由でリセットメールを送信（カスタムURLを指定）
      await sendPasswordResetEmail(auth, resetEmail, {
        url: "https://react-demo-lava-java.vercel.app/reset-password", // 🔗 自作ページに遷移させる
        handleCodeInApp: true, // ✅ この設定がないと Firebase のデフォ画面が表示される
      });

      // ✅ 成功メッセージ表示
      setResetMessage(
        "パスワードリセット用のメールを送信しました。<br />ご確認ください。",
      );
    } catch (error: any) {
      // ❌ 失敗時のエラーメッセージ
      setResetMessage("送信に失敗しました：" + error.message);
    }
  };

  return (
    <div
      className="login-container"
      style={{ padding: "2rem", position: "relative" }}
    >
      {/* 🏷 タイトル */}
      <h2 className="login-title">ログイン</h2>

      {/* 📝 ログインフォーム */}
      <form className="login-form" onSubmit={handleSubmit}>
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

        <div className="login-field">
          <label className="login-label">パスワード：</label>
          <div
            className="login-password-wrapper"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              className="login-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", paddingRight: "2.5rem" }}
            />
            <i
              className={`bx ${showPassword ? "bx-show" : "bx-hide"}`}
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "1.2rem",
                color: "#888",
              }}
            ></i>
          </div>
        </div>

        {/* ❌ エラーメッセージ（パスワードの下、ボタンの上） */}
        {(error || loginError) && (
          <p
            className="login-error"
            style={{
              color: "red",
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            {error || loginError}
          </p>
        )}

        <button
          className="login-button"
          type="submit"
          disabled={isLoading}
          style={{
            opacity: isLoading ? 0.6 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem", // ← 文字與icon之間的間距
          }}
        >
          {isLoading ? (
            <>
              <i className="bx bx-loader-circle bx-spin"></i>
              ログイン中...
            </>
          ) : (
            "ログイン"
          )}
        </button>

        {/* 🔁 パスワード忘れたリンク */}
        <p
          className="login-reset-link"
          style={{ marginTop: "1rem", cursor: "pointer", color: "#007bff" }}
          onClick={() => setShowResetForm(true)}
        >
          パスワードをお忘れですか？
        </p>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p className="login-register-link" style={{ marginTop: "1rem" }}>
        アカウントをお持ちでない方はこちら：
        <button className="register-button" onClick={onRegisterClick}>
          新規登録
        </button>
      </p>

      {/* 🔒 パスワードリセットフォーム（重ねて表示） */}
      {showResetForm && (
        <div
          className="reset-form-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255,255,255,0.95)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            zIndex: 10,
            padding: "2rem",
          }}
        >
          <h3>🔁 パスワード再設定</h3>
          <form
            onSubmit={handlePasswordReset}
            style={{ width: "100%", maxWidth: "360px" }}
          >
            <input
              className="login-input"
              type="email"
              placeholder="メールアドレスを入力"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
              style={{ marginBottom: "1rem" }}
            />
            <button type="submit" className="login-button">
              リセットメール送信
            </button>
          </form>
          {resetMessage && (
            <p
              style={{ marginTop: "1rem", color: "green", textAlign: "center" }}
              dangerouslySetInnerHTML={{ __html: resetMessage }}
            />
          )}{" "}
          <button
            className="passwordResetForm-button"
            onClick={() => setShowResetForm(false)}
            style={{ marginTop: "1rem" ,}}
          >
            戻る
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
