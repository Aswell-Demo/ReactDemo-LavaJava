// 🌐【このファイルの目的】
// アプリ全体のルーティング（ページ遷移）を管理するエントリーポイント。
// また、ログイン状態とユーザーの権限情報（顧客 or 管理者）を `AuthProvider` で全体に提供している。

// --------------------- 🔄 ルーティング関連のインポート ---------------------
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// --------------------- 🔐 認証コンテキストのラップ ---------------------
// ユーザーのログイン状態やロール情報（役割）を全体に共有するためのコンテキスト
import { AuthProvider } from "./context/AuthContext";

// --------------------- 🔒 ページアクセスの保護コンポーネント ---------------------
// 権限が一致しない場合はリダイレクトさせるラッパー（顧客専用・管理者専用ページの保護用）
import ProtectedRoute from "./components/ProtectedRoute";

// --------------------- 📄 ページ単位のコンポーネント ---------------------
import Login from "./pages/LoginPage/Login"; // ログインページ
import Register from "./pages/Register/Register"; // 新規登録ページ
import CustomerPage from "./pages/CustomerPage/CustomerPage"; // 顧客用ページ
import ManagerPage from "./pages/ManagerPage/ManagerPage"; // 管理者用ページ
import ResetPassword from "./pages/ResetPassword/ResetPassword"; // 📥 你的 reset password 頁面


// --------------------- 🚪 アプリのルート定義とラップ構成 ---------------------
function App() {
  return (
    // 🌍 アプリ全体を認証コンテキストでラップ（どのページでもログイン情報を取得可能）
    <AuthProvider>
      {/* 🌐 ブラウザルーターでルーティングを管理 */}
      <Router>
        <Routes>
          {/* 🏠 ルート（"/"）はログインページ */}
          <Route path="/" element={<Login />} />

          {/* 📝 新規登録ページ */}
          <Route path="/register" element={<Register />} />

          {/* 👤 顧客専用ページ（ログイン＋ロールが「顧客」の場合のみアクセス可） */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute requiredRole="顧客">
                <CustomerPage />
              </ProtectedRoute>
            }
          />

          {/* 🛠 管理者専用ページ（ログイン＋ロールが「manager」の場合のみアクセス可） */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute requiredRole="manager">
                <ManagerPage />
              </ProtectedRoute>
            }
          />

        <Route path="/reset-password" element={<ResetPassword />} /> {/* 🆕 忘記密碼變更畫面 */}

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
