// 🧾【このファイルの目的】
// ユーザーがアカウントを新規作成するための入力フォーム。
// ・メールアドレス、パスワード、氏名、カナを入力
// ・パスワードの表示/非表示を切り替え可能
// ・登録ボタンで送信（Firebase Auth + Firestore書き込み）
// ・ログイン画面に戻るボタンあり

// --------------------- 🔧 ReactやFirebase関連の読み込み ---------------------
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

// --------------------- 📌 このコンポーネントで受け取る Props の型定義 ---------------------
type Props = {
  onLoginClick: () => void; // 「ログインへ戻る」クリック時の処理
};

// --------------------- 🖼 新規登録フォームの表示本体 ---------------------
const RegisterForm: React.FC<Props> = ({ onLoginClick }) => {
  // ✏️ 入力フィールド用ステート
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nameKana, setNameKana] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // 🚀 登録処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      alert("パスワードは6文字以上で入力してください。");
      return;
    }
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(firestore, "users", email), {
        email,
        name,
        namekana: nameKana,
        role: "顧客",
        createdAt: serverTimestamp(),
        status: "active",
      });
      alert("登録が完了しました！");
      navigate("/");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        alert("このメールアドレスはすでに登録されています。");
      } else {
        alert("登録に失敗しました：" + error.message);
      }
    }
  };

  return (
    <div className="register-container" style={{ padding: "2rem" }}>
      {/* 📝 タイトル */}
      <h2 className="register-title">新規登録</h2>

      {/* 📋 入力フォーム本体 */}
      <form className="register-form" onSubmit={handleSubmit}>
        {/* 📧 メールアドレス入力 */}
        <div className="register-field">
          <label className="register-label">メールアドレス：</label>
          <input
            className="register-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* 🔐 パスワード入力 + 表示切替 */}
        <div className="register-field">
          <label className="register-label">パスワード：</label>
          <div
            className="register-password-wrapper"
            style={{ display: "flex", alignItems: "center" }}
          >
            <input
              className="register-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password-button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{ marginLeft: "8px" }}
            >
              {showPassword ? "非表示" : "表示"}
            </button>
          </div>
        </div>

        {/* 🧑 氏名入力 */}
        <div className="register-field">
          <label className="register-label">名前：</label>
          <input
            className="register-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* 🅰️ カナ入力 */}
        <div className="register-field">
          <label className="register-label">カナ：</label>
          <input
            className="register-input"
            type="text"
            value={nameKana}
            onChange={(e) => setNameKana(e.target.value)}
            required
          />
        </div>

        {/* 🚀 登録ボタン */}
        <button className="register-button" type="submit">
          登録
        </button>
      </form>

      {/* 🔁 ログイン画面への戻るリンク */}
      <p className="register-login-link" style={{ marginTop: "1rem" }}>
        すでにアカウントをお持ちの方：
        <button className="login-button" onClick={onLoginClick}>
          ログインへ戻る
        </button>
      </p>
    </div>
  );
};

export default RegisterForm;
