// 🧾【このファイルの目的】
// 顧客が新しい注文を作成するためのフォームコンポーネント。
// ・商品名、配送先住所、支払方法、備考を入力
// ・送信ボタン押下時に注文データを作成して親コンポーネントに渡す

import React, { useState } from "react";

// --------------------- 📌 Props定義（親コンポーネントに渡す関数） ---------------------
// ・onSubmitOrder：入力された注文データを親へ送信するための関数
type Props = {
  onSubmitOrder: (orderData: {
    order_id: string;
    items: string[];
    delivery_address: string;
    payment_method: string;
    notes: string;
  }) => void;
};

// --------------------- 🖼 新規注文フォームコンポーネント ---------------------
const NewOrderForm: React.FC<Props> = ({ onSubmitOrder }) => {
  // 🧾 各入力項目の状態管理
  const [items, setItems] = useState(""); // 商品名（カンマ区切り）
  const [deliveryAddress, setDeliveryAddress] = useState(""); // 配送先住所
  const [paymentMethod, setPaymentMethod] = useState("クレカ"); // 支払方法（初期値：クレカ）
  const [notes, setNotes] = useState(""); // 備考

  // 🔢 注文IDの自動生成（ランダムな8桁の英数字）
  const generateOrderId = () =>
    Math.random().toString(36).substring(2, 10).padEnd(8, "0");

  // 📤 フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // ページリロード防止

    // 入力値から注文データを構築
    const orderData = {
      order_id: generateOrderId(),
      items: items.split(",").map((item) => item.trim()), // カンマ区切りで配列化
      delivery_address: deliveryAddress,
      payment_method: paymentMethod,
      notes: notes,
    };

    // 親コンポーネントに注文データを送信
    onSubmitOrder(orderData);

    // 📦 入力欄のリセット
    setItems("");
    setDeliveryAddress("");
    setPaymentMethod("クレカ");
    setNotes("");
  };

  // --------------------- 🧱 フォームUIの描画 ---------------------
  return (
    <div className="new-order-container">
      <form className="new-order-form" onSubmit={handleSubmit}>
        <h3 className="form-title">📝 新規注文</h3>

        {/* 商品名の入力欄 */}
        <div className="form-group">
          <label className="form-label">商品</label>
          <input
            className="form-input"
            value={items}
            onChange={(e) => setItems(e.target.value)}
            required
          />
        </div>

        {/* 配送先住所の入力欄 */}
        <div className="form-group">
          <label className="form-label">配送先住所</label>
          <input
            className="form-input"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            required
          />
        </div>

        {/* 支払方法のセレクトボックス */}
        <div className="form-group">
          <label className="form-label">支払方法</label>
          <select
            className="form-select"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="クレカ">クレカ</option>
            <option value="銀行振込">銀行振込</option>
            <option value="代引き">代引き</option>
          </select>
        </div>

        {/* 備考の入力欄（テキストエリア） */}
        <div className="form-group">
          <label className="form-label">備考</label>
          <textarea
            className="form-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* 送信ボタン */}
        <button className="submit-button" type="submit">
          注文を送信
        </button>
      </form>
    </div>
  );
};

// 📤 このコンポーネントを外部に公開
export default NewOrderForm;
