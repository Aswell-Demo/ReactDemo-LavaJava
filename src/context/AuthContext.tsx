// 🧩【このファイルの目的】
// Firebase Authentication を使ってログイン状態を管理し、
// Firestore から取得したユーザーの「ロール情報」も含めて
// アプリ全体に共有するための「認証コンテキスト」を提供する。

// --------------------- 🛠 ReactとFirebaseの必要機能をインポート ---------------------
import React, { useEffect, useState, createContext, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth"; // 認証状態の監視
import { auth, firestore } from "../firebase"; // Firebase 初期化済みのインスタンス
import { doc, getDoc } from "firebase/firestore"; // Firestore 操作用
import type { User } from "firebase/auth"; // User 型の取り込み

// --------------------- 🧾 コンテキストの型定義 ---------------------
interface AuthContextType {
  user: User | null; // 現在ログイン中の Firebase ユーザー情報
  role: string | null; // Firestore から取得したユーザーの役割（manager/顧客など）
  loading: boolean; // ローディング中かどうか（読み込み中フラグ）
}

// --------------------- 🟡 コンテキスト初期値（まだ何も確定していない状態） ---------------------
const AuthContext = createContext<AuthContextType>({
  user: null, // ユーザー情報は未設定
  role: null, // ロール情報も未設定
  loading: true, // 初期状態では読み込み中とする
});

// --------------------- 🔄 認証状態の変化を監視してコンテキストに反映 ---------------------
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // Firebase 認証ユーザー情報
  const [role, setRole] = useState<string | null>(null); // Firestore のロール情報
  const [loading, setLoading] = useState(true); // 認証読み込み中フラグ

  useEffect(() => {
    // 🔔 Firebase Authentication でログイン状態の変化を監視
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser); // ユーザーを state に保存

      if (firebaseUser?.email) {
        const email = firebaseUser.email.toLowerCase().trim(); // 🔤 Firestore 用にメール整形

        try {
          // 📄 Firestore の users コレクションから該当ユーザーの role を取得
          const docRef = doc(firestore, "users", email);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setRole(docSnap.data().role); // ✅ Firestore にあればロールを取得してセット
          } else {
            setRole("unauthorized"); // ❌ Firestore に登録されていないユーザー
          }
        } catch (error) {
          console.error("ユーザーデータの取得に失敗しました", error);
          setRole("unauthorized"); // 🔴 Firestore エラー時も最低限セット
        }
      } else {
        setRole(null); // ログアウト状態
      }

      setLoading(false); // ⏹️ 最後にローディング終了
    });

    return () => unsubscribe(); // 🧹 アンマウント時に監視解除
  }, []);

  return (
    // 🌐 アプリ全体で user, role, loading を利用できるように提供
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// --------------------- 💡 カスタムフック：useAuth()でコンテキスト取得簡略化 ---------------------
export const useAuth = () => useContext(AuthContext); // 任意のコンポーネント内で使えるようになる
