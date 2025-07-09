// 🧾【このファイルの目的】
// 新規登録ページのロジックを担当するメインコンポーネント。
// ・Firebase Authenticationでユーザーを作成
// ・Firestoreに顧客情報を保存（名前・カナ・ロールなど）
// ・登録完了後にログイン画面へ遷移
// ・UI表示は RegisterForm に委任

// --------------------- 🔧 必要なライブラリ・機能のインポート ---------------------
import { useNavigate } from "react-router-dom"; // ページ遷移
import RegisterForm from "./components/RegisterForm"; // 登録フォームのUI部分

// --------------------- 🖼 新規登録ページの本体 ---------------------
const Register = () => {
  const navigate = useNavigate(); // ページ遷移フック

  // --------------------- 🖥 RegisterForm を表示（UIロジックをフォームに任せる） ---------------------
  return <RegisterForm onLoginClick={() => navigate("/")} />;
};

export default Register;
