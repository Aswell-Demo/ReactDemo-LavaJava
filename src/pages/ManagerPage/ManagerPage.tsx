// 🧑‍💼【このファイルの目的】
// 管理者用のメインページコンポーネント。
// ・ログインユーザーの名前とロールを取得して表示
// ・サイドバーで表示モード（受注管理 or 権限管理）を切り替え
// ・注文一覧、注文詳細モーダル、ユーザー管理画面の表示制御

import HeaderBar from "./components/HeaderBar"; // 上部ヘッダー（氏名・ロール・ログアウト）
import SidebarMenu from "./components/SidebarMenu"; // サイドメニュー（注文ステータス切り替え）
import OrderList from "./components/OrderList"; // 注文一覧テーブル
import OrderDetailModal from "./components/OrderDetailModal"; // 注文詳細モーダル
import UserManagement from "./components/UserManagement"; // ユーザー情報管理画面

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // 認証ユーザー情報取得
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase";

// --------------------- 🖼 管理者ページ本体 ---------------------
const ManagerPage = () => {
  const { user, role } = useAuth(); // 現在ログイン中のユーザーとロール取得

  const [currentStatus, setCurrentStatus] = useState("受注"); // 表示中のステータス（受注など）
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null); // 選択中の注文（詳細モーダル用）
  const [name, setName] = useState(""); // Firestoreから取得したユーザー氏名

  // 🔍 Firestoreからログインユーザーの氏名を取得
  useEffect(() => {
    const fetchUserName = async () => {
      if (user?.email) {
        const ref = doc(firestore, "users", user.email); // 「users」コレクションから取得
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setName(data.name || ""); // 💡 Firestoreの name フィールドを表示用にセット
        }
      }
    };
    fetchUserName();
  }, [user]);

  // --------------------- 🧱 画面描画 ---------------------
  return (
    <div className="manager-page">
      {/* 🧾 上部：ヘッダー（氏名・ロール・ログアウト） */}
      <HeaderBar name={name} role={role || ""} />

      {/* 🔽 サイドメニュー＋メイン表示エリア */}
      <div className="manager-content-area">
        {/* 📑 サイドメニュー（ステータス切り替え） */}
        <SidebarMenu
          onStatusChange={(status: string) => setCurrentStatus(status)}
        />

        {/* 📦 メインコンテンツ領域 */}
        <div className="manager-main">
          {/* ✅ 「受注系」のいずれかが選択されているときのみ表示 */}
          {["受注", "受注確認", "発注", "納品"].includes(currentStatus) && (
            <OrderList
              currentStatus={currentStatus}
              setSelectedOrder={setSelectedOrder}
            />
          )}

          {/* 🔍 注文詳細モーダル（注文が選択されている場合） */}
          {selectedOrder && (
            <OrderDetailModal
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
            />
          )}

          {/* 👥 ユーザー管理画面（「権限管理」時のみ表示） */}
          {currentStatus === "権限管理" && <UserManagement />}
        </div>
      </div>
    </div>
  );
};

// 📤 他の画面からこのページを呼び出せるようエクスポート
export default ManagerPage;
