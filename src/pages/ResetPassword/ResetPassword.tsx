// 🧾【このファイルの目的】
// パスワード再設定リンクから遷移し、新しいパスワードを入力して再設定する画面
// ・URLからoobCodeを取得
// ・新しいパスワードを2回入力して一致確認
// ・Firebaseにてパスワードを更新

import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
import { auth } from "../../firebase";

const ResetPassword: React.FC = () => {
  // 🔍 URLからoobCodeを取得
  const [searchParams] = useSearchParams();
  const [oobCode, setOobCode] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // ✅ 初回読み込みでコード確認
  useEffect(() => {
    const code = searchParams.get("oobCode");
    if (code) {
      setOobCode(code);
      verifyPasswordResetCode(auth, code)
        .then(() => setConfirmed(true))
        .catch(() =>
          setMessage("リンクが無効、または有効期限が切れています。")
        );
    } else {
      setMessage("無効なリクエストです。");
    }
  }, [searchParams]);

  // 🔄 パスワード再設定処理
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✋ パスワード一致確認
    if (newPassword !== confirmPassword) {
      setMessage("新しいパスワードが一致しません。もう一度ご確認ください。");
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage("✅ パスワードを変更しました。ログイン画面から再度ログインしてください。");
      setConfirmed(false); // フォームを非表示
    } catch (error: any) {
      setMessage("パスワード変更に失敗しました：" + error.message);
    }
  };

  return (
    <div className="reset-container" style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h2 className="reset-title">🔁 パスワード再設定</h2>

      {message && <p style={{ color: "red", marginBottom: "1rem" }}>{message}</p>}

      {/* 🔐 パスワード入力フォーム */}
      {confirmed && (
        <form onSubmit={handleReset}>
          {/* 🆕 新しいパスワード */}
          <div className="reset-field">
            <label>新しいパスワード：</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {/* ✅ 確認用パスワード */}
          <div className="reset-field">
            <label>新しいパスワード（確認）：</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="reset-button">
            パスワードを変更
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
