// 🧾【このファイルの目的】
// 顧客が過去の注文履歴を確認できるモーダル付きリストコンポーネント。
// ・注文一覧を表形式で表示
// ・行をクリックすると詳細モーダルが開く
// ・モーダル外をクリックすると閉じる

import React, { useState } from "react";

// 🔖 注文データ型定義
// Firebaseなどから取得した注文オブジェクトを表す型
type Order = {
  order_id: string;
  status: string;
  items: string[] | string;
  delivery_address: string;
  payment_method: string;
  notes: string;
  created_at: any; // Firestore Timestamp型などが想定される
};

// 📌 Props 定義（親から受け取る注文一覧）
// ・orders：表示対象の注文データ配列
type Props = {
  orders: Order[];
};

// --------------------- 🖼 注文詳細モーダルコンポーネント ---------------------
const OrderDetailModal: React.FC<Props> = ({ orders }) => {
  // 📌 現在選択されている注文のインデックス（nullなら非選択）
  const [selectedOrderIndex, setSelectedOrderIndex] = useState<number | null>(
    null,
  );

  // ✖️ モーダルを閉じる処理（indexをnullにする）
  const closeModal = () => setSelectedOrderIndex(null);

  // ✔️ 行クリック時に該当インデックスをセット
  const handleRowClick = (index: number) => {
    setSelectedOrderIndex(index);
  };

  // 📦 選択中の注文データ（nullでなければ詳細表示）
  const selectedOrder =
    selectedOrderIndex !== null ? orders[selectedOrderIndex] : null;

  return (
    <>
      {/* 📋 注文履歴リスト（クリックで詳細表示） */}
      <div className="order-list">
        <h3 className="section-title">📄 注文履歴（クリックで詳細）</h3>
        <table className="history-table">
          <thead>
            <tr>
              <th>ステータス</th>
              <th>商品</th>
              <th>注文ID</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr
                key={order.order_id}
                className="clickable-row"
                onClick={() => handleRowClick(idx)} // 行クリックでモーダルを開く
              >
                <td>{order.status}</td>
                <td>
                  {Array.isArray(order.items)
                    ? order.items.join(", ")
                    : order.items}
                </td>
                <td>{order.order_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🧾 注文詳細モーダル（選択中のみ表示） */}
      {selectedOrder && (
        <div className="overlay" onClick={closeModal}>
          {" "}
          {/* 背景クリックでモーダルを閉じる */}
          <div className="order-detail" onClick={(e) => e.stopPropagation()}>
            {" "}
            {/* モーダル内クリックは閉じない */}
            <h4>🧾 注文詳細</h4>
            <p>
              <strong>注文ID：</strong>
              {selectedOrder.order_id}
            </p>
            <p>
              <strong>ステータス：</strong>
              {selectedOrder.status}
            </p>
            <p>
              <strong>商品：</strong>
              {Array.isArray(selectedOrder.items)
                ? selectedOrder.items.join(", ")
                : selectedOrder.items}
            </p>
            <p>
              <strong>配送先住所：</strong>
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
              {/* FirestoreのTimestampを日本時間でフォーマット */}
              {selectedOrder.created_at?.toDate().toLocaleString("ja-JP", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZone: "Asia/Tokyo",
              })}
            </p>
            {/* モーダルを閉じるボタン */}
            <button onClick={closeModal} className="back-button">
              ← 閉じる
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// 📤 外部コンポーネントで使用するためのエクスポート
export default OrderDetailModal;
