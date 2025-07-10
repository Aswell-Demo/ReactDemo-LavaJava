// 🧾【このファイルの目的】
// パスワード再設定リンクから遷移し、新しいパスワードを入力して再設定する画面
// ・URLからoobCodeを取得
// ・新しいパスワードを2回入力して一致確認
// ・Firebaseにてパスワードを更新
// ・👁️ パスワード表示/非表示の切り替えも対応

import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
import { auth } from "../../firebase";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [oobCode, setOobCode] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

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

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("新しいパスワードが一致しません。もう一度ご確認ください。");
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage("✅ パスワードを変更しました。ログイン画面から再度ログインしてください。");
      setConfirmed(false);
    } catch (error: any) {
      setMessage("パスワード変更に失敗しました：" + error.message);
    }
  };

  return (
    <div className="reset-container">
      <h2 className="reset-title">🔁 パスワード再設定</h2>

      {message && <p className="reset-message">{message}</p>}

      {confirmed && (
        <form onSubmit={handleReset} className="reset-form">
          {/* 🆕 新しいパスワード */}
          <div className="reset-field">
            <label>新しいパスワード：</label>
            <div className="reset-password-wrapper">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
              <i
                className={`bx ${showNewPassword ? "bx-show" : "bx-hide"}`}
                onClick={() => setShowNewPassword(!showNewPassword)}
              ></i>
            </div>
          </div>

          {/* ✅ 確認用パスワード */}
          <div className="reset-field">
            <label>新しいパスワード（確認）：</label>
            <div className="reset-password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
              <i
                className={`bx ${showConfirmPassword ? "bx-show" : "bx-hide"}`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              ></i>
            </div>
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
