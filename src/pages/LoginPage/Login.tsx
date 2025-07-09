// 🧾【このファイルの目的】
// ログイン画面のページコンポーネント。
// ・メールアドレスとパスワードでFirebase認証を行う
// ・ログイン成功後、ユーザーのロールに応じてページをリダイレクト
// ・権限のないユーザーにはエラーメッセージを表示
// ・LoginFormコンポーネントにログイン関数と登録誘導関数のみ渡す（状態管理は子コンポーネント内）

// --------------------- 🔧 必要なライブラリや機能をインポート ---------------------
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ページ遷移
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase 認証
import { auth } from "../../firebase"; // Firebase インスタンス
import { useAuth } from "../../context/AuthContext"; // 認証状態とロールを取得
import LoginForm from "./components/LoginForm"; // ログインフォームのUI部分

// --------------------- 🖼 ログインページ本体 ---------------------
const Login = () => {
  const navigate = useNavigate(); // ページ遷移フック
  const { user, role } = useAuth(); // ログイン状態とロール情報を取得

  // --------------------- 🔐 ログイン処理 ---------------------
  const handleLogin = async (
    email: string,
    password: string,
  ): Promise<string | null> => {
    try {
      // Firebase 認証実行
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ ログイン成功");
      return null; // 成功時はエラーなし
    } catch (err: any) {
      console.error(err.message);
      return "ログインに失敗しました。メールアドレスまたはパスワードをご確認ください。";
    }
  };

  // --------------------- 🚪 ログイン後の自動リダイレクト ---------------------
  useEffect(() => {
    if (user && role === "manager") {
      navigate("/manager"); // 管理者ページへ
    } else if (user && role === "顧客") {
      navigate("/customer"); // 顧客ページへ
    } else if (user && role === "unauthorized") {
      alert("このユーザーにはアクセス権限がありません。");
    }
  }, [user, role]);

  // --------------------- 🖥 UIレンダリング ---------------------
  return (
    <LoginForm
      onLogin={handleLogin}
      onRegisterClick={() => navigate("/register")}
    />
  );
};

export default Login;
