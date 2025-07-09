// 🛡️【このファイルの目的】
// 特定のロール（例：manager、顧客など）を持つユーザーだけがアクセスできるようにするためのルート保護コンポーネント。
// 認証されていない場合やロールが一致しない場合は "/"（ログインページ）にリダイレクトする。

// --------------------- 🔧 必要なモジュールをインポート ---------------------
import React from "react";
import { Navigate } from "react-router-dom"; // ページ遷移を制御するためのコンポーネント
import { useAuth } from "../context/AuthContext"; // 認証情報を取得するためのカスタムフック

// --------------------- 📌 コンポーネントのprops型定義 ---------------------
interface ProtectedRouteProps {
  children: React.ReactElement; // 保護したいコンポーネント（表示対象）
  requiredRole: "manager" | "employee" | "顧客"; // アクセスに必要なロール
}

// --------------------- 🛡️ ルート保護コンポーネント本体 ---------------------
const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, role, loading } = useAuth(); // 現在のログイン状態とロールを取得

  // 🐛 デバッグ用ログ（本番では削除可能）
  console.log("ProtectedRoute: loading =", loading);
  console.log("ProtectedRoute: user =", user);
  console.log("ProtectedRoute: role =", role);
  console.log("ProtectedRoute: requiredRole =", requiredRole);

  // ⏳ 認証状態がまだ読み込み中なら「読み込み中」メッセージを表示
  if (loading) return <p>載入中...</p>;

  // ❌ 未ログイン または ロール不一致 の場合は "/" にリダイレクト
  if (!user || role !== requiredRole) return <Navigate to="/" replace />;

  // ✅ ログイン済みかつロール一致 → 子コンポーネントを表示
  return children;
};

export default ProtectedRoute;
