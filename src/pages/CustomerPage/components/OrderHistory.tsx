// 🧾【このファイルの目的】
// ログイン中の顧客が、自分の注文履歴を閲覧するためのページコンポーネント。
// ・Firebase Firestoreからemailに紐づく注文データを取得
// ・注文履歴をテーブルで表示し、クリックで詳細モーダルを表示

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../../firebase";

// 🔖 注文データ型定義（Firestoreから取得する構造に対応）
type Order = {
  order_id: string;
  status: string;
  created_at: any; // Firestore Timestamp 型
  items: string[] | string;
  notes: string;
  delivery_address?: string;
  payment_method?: string;
};

// --------------------- 🖼 OrderHistory コンポーネント本体 ---------------------
// Props：email（ログイン中の顧客メールアドレス）に基づき注文履歴を取得
const OrderHistory: React.FC<{ email: string }> = ({ email }) => {
  const [orders, setOrders] = useState<Order[]>([]); // 注文リスト状態
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // モーダル表示対象の注文

  // 📥 Firestoreから注文履歴を取得（emailで絞り込み）
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(firestore, "orders"),
          where("customer_email", "==", email), // 顧客Emailに一致するデータを取得
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => doc.data() as Order);
        setOrders(list); // 成功時は取得データをセット
      } catch (err) {
        console.error("注文履歴取得失敗", err);
        setOrders([]); // エラー時は空配列に
      }
    };
    fetchOrders();
  }, [email]); // emailが変わるたびに再取得

  return (
    <div className="order-history">
      <h3 className="section-title">📄 注文履歴</h3>

      {/* 🗂 データがない場合のメッセージ表示 */}
      {orders.length === 0 ? (
        <p>注文履歴はありません。</p>
      ) : (
        // 📋 注文履歴テーブル（クリックで詳細表示）
        <table className="history-table">
          <thead>
            <tr>
              <th>ステータス</th>
              <th>作成日</th>
              <th>商品</th>
              <th>備考</th>
              <th>注文ID</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={index}
                className="clickable-row"
                onClick={() => setSelectedOrder(order)} // 行クリックでモーダル開く
              >
                <td>{order.status}</td>
                <td>
                  {order.created_at?.toDate().toLocaleString("ja-JP", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>
                  {Array.isArray(order.items)
                    ? order.items.join(", ")
                    : order.items}
                </td>
                <td>{order.notes}</td>
                <td>{order.order_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 🧾 詳細モーダル（注文が選択されている場合のみ表示） */}
      {selectedOrder && (
        <div className="overlay" onClick={() => setSelectedOrder(null)}>
          {/* モーダル本体（クリックで閉じないよう伝播停止） */}
          <div className="order-detail" onClick={(e) => e.stopPropagation()}>
            <h4>🧾 注文詳細</h4>
            <p>
              <strong>注文ID：</strong>
              {selectedOrder.order_id}
            </p>
            <p>
              <strong>商品：</strong>
              {Array.isArray(selectedOrder.items)
                ? selectedOrder.items.join(", ")
                : selectedOrder.items}
            </p>
            <p>
              <strong>住所：</strong>
              {selectedOrder.delivery_address}
            </p>
            <p>
              <strong>支払方法：</strong>
              {selectedOrder.payment_method}
            </p>
            <p>
              <strong>備考：</strong>
              {selectedOrder.notes}
            </p>
            <p>
              <strong>作成日時：</strong>
              {/* 日本時間フォーマットで表示 */}
              {selectedOrder.created_at?.toDate().toLocaleString("ja-JP")}
            </p>
            {/* 閉じるボタン */}
            <button
              className="back-button"
              onClick={() => setSelectedOrder(null)}
            >
              ← 閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 📤 外部で利用するためエクスポート
export default OrderHistory;
