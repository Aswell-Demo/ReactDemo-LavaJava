// 🧾【このファイルの目的】
// ログイン画面のページコンポーネント。
// ・メールアドレスとパスワードでFirebase認証を行う
// ・ログイン成功後、ユーザーのロールに応じてページをリダイレクト
// ・権限のないユーザーにはエラーメッセージを表示
// ・LoginFormコンポーネントにログイン関数と登録誘導関数のみ渡す（状態管理は子コンポーネント内）

// --------------------- 🔧 必要なライブラリや機能をインポート ---------------------
import { useState, useEffect } from "react"; // ✅ 加 useState
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import LoginForm from "./components/LoginForm";

const Login = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  // ✅ 🔽 這裡是新加的錯誤訊息用的 state
  const [loginError, setLoginError] = useState("");

  // 🔐 ログイン処理
  const handleLogin = async (
    email: string,
    password: string,
  ): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ ログイン成功");
      setLoginError(""); // 成功時清除錯誤訊息
    } catch (err: any) {
      console.error(err.message);
      setLoginError("メールアドレスまたはパスワードが違います");
    }
  };

  // 🚪 ログイン後のリダイレクト
  useEffect(() => {
    if (user && role === "manager") {
      navigate("/manager");
    } else if (user && role === "顧客") {
      navigate("/customer");
    } else if (user && role === "unauthorized") {
      alert("このユーザーにはアクセス権限がありません。");
    }
  }, [user, role]);

  return (
    <LoginForm
      onLogin={handleLogin}
      onRegisterClick={() => navigate("/register")}
      loginError={loginError} // ✅ 傳給子元件
    />
  );
};

export default Login;
