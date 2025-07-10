// 🧾【このファイルの目的】
// Firebaseのパスワード再設定リンクから遷移し、新しいパスワードを設定する画面
// ・URLのクエリパラメータからoobCodeを取得
// ・新しいパスワードを2回入力し、一致を確認
// ・confirmPasswordResetでFirebaseの認証情報を更新
// ・👁️ パスワード表示/非表示切り替えにも対応

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

  // ✅ oobCode（リセットトークン）をURLから取得し、確認する
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

  // 🔄 パスワード更新処理
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ 入力確認
    if (newPassword !== confirmPassword) {
      setMessage("新しいパスワードが一致しません。もう一度ご確認ください。");
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage("✅ パスワードを変更しました。ログイン画面から再度ログインしてください。");
      setConfirmed(false); // フォーム非表示
    } catch (error: any) {
      setMessage("パスワード変更に失敗しました：" + error.message);
    }
  };

  return (
    <div className="reset-container">
      <h2 className="reset-title">🔁 パスワード再設定</h2>

      {/* 🔔 メッセージ表示 */}
      {message && <p className="reset-message">{message}</p>}

      {/* 🔐 パスワード入力フォーム（oobCodeが有効なとき） */}
      {confirmed && (
        <form onSubmit={handleReset} className="reset-form">
          {/* 🆕 新しいパスワード入力欄 */}
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

          {/* ✅ パスワード確認欄 */}
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

          {/* 🔘 送信ボタン */}
          <button type="submit" className="reset-button">
            パスワードを変更
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
