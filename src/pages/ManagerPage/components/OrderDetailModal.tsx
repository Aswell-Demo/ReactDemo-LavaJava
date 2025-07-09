// 🧾【このファイルの目的】
// 管理者用の注文詳細モーダルコンポーネント。
// ・注文内容の確認表示
// ・編集モードでの内容修正と保存
// ・削除ボタンによる注文データの削除
// ・保存／削除後に画面更新やモーダル閉じ処理を親に通知

import React, { useState } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore"; // Firestore操作用関数
import { firestore } from "../../../firebase"; // Firebase構成ファイル

// 🔖 注文データ型定義（Firestoreから取得する1件分の構造）
type Order = {
  id: string; // FirestoreドキュメントID（編集・削除に使用）
  order_id: string;
  customer_name: string;
  items: string[] | string;
  delivery_address: string;
  payment_method: string;
  notes: string;
  customer_email: string;
  created_at: any;
};

// 📌 Props定義
// ・order：表示対象の注文データ
// ・onClose：モーダルを閉じるコールバック関数
// ・onRefresh：保存または削除後に親コンポーネントで再取得するための任意関数
type Props = {
  order: Order;
  onClose: () => void;
  onRefresh?: () => void;
};

// --------------------- 🖼 注文詳細モーダル本体 ---------------------
const OrderDetailModal: React.FC<Props> = ({ order, onClose, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false); // 編集モード切替用ステート
  const [editedOrder, setEditedOrder] = useState<Order>({ ...order }); // 編集中の内容保持

  // 💾 保存処理（Firestoreの該当ドキュメントを更新）
  const handleSave = async () => {
    try {
      await updateDoc(doc(firestore, "orders", order.id), {
        ...editedOrder,
        updated_at: new Date(), // 更新日時をセット
      });
      alert("保存しました！");
      setIsEditing(false); // 編集モード終了
      onRefresh?.(); // 親に再取得を依頼（省略可能）
      onClose(); // モーダルを閉じる
    } catch (e) {
      alert("保存失敗：" + String(e));
    }
  };

  // 🗑 削除処理（確認後にFirestoreの該当ドキュメントを削除）
  const handleDelete = async () => {
    const confirmed = window.confirm("本当に削除しますか？"); // 確認ダイアログ
    if (!confirmed) return;
    try {
      await deleteDoc(doc(firestore, "orders", order.id));
      alert("削除しました！");
      onRefresh?.(); // 親に再取得依頼
      onClose(); // モーダルを閉じる
    } catch (e) {
      alert("削除失敗：" + String(e));
    }
  };

  // --------------------- 🧱 JSX描画（モーダルUI） ---------------------
  return (
    <div className="order-detail-modal">
      <h4>🧾 注文詳細</h4>

      {/* ✏️ 編集モード表示 */}
      {isEditing ? (
        <>
          <p>
            <strong>注文ID：</strong>
            {order.order_id}
          </p>

          {/* 編集可能なフィールドを一括ループで生成 */}
          {[
            "customer_name",
            "items",
            "delivery_address",
            "payment_method",
            "notes",
            "customer_email",
          ].map((key) => (
            <p key={key}>
              <strong>
                {key === "customer_name"
                  ? "顧客名"
                  : key === "items"
                    ? "商品"
                    : key === "delivery_address"
                      ? "住所"
                      : key === "payment_method"
                        ? "支払方法"
                        : key === "notes"
                          ? "備考"
                          : "Email"}
                ：
              </strong>
              <input
                className="editable-input"
                value={(editedOrder as any)[key]} // anyで動的プロパティ対応
                onChange={(e) =>
                  setEditedOrder({ ...editedOrder, [key]: e.target.value })
                }
              />
            </p>
          ))}

          <p>
            <strong>作成日：</strong>
            {order.created_at?.toDate().toLocaleString("ja-JP")}
          </p>

          {/* ✅ 保存・キャンセルボタン */}
          <div className="order-edit-buttons">
            <button className="save-button" onClick={handleSave}>
              保存
            </button>
            <button className="back-button" onClick={() => setIsEditing(false)}>
              キャンセル
            </button>
          </div>
        </>
      ) : (
        // 📖 閲覧モード表示（編集不可）
        <>
          <p>
            <strong>注文ID：</strong>
            {order.order_id}
          </p>
          <p>
            <strong>顧客名：</strong>
            {order.customer_name}
          </p>
          <p>
            <strong>商品：</strong>
            {Array.isArray(order.items) ? order.items.join(", ") : order.items}
          </p>
          <p>
            <strong>住所：</strong>
            {order.delivery_address}
          </p>
          <p>
            <strong>支払方法：</strong>
            {order.payment_method}
          </p>
          <p>
            <strong>備考：</strong>
            {order.notes}
          </p>
          <p>
            <strong>Email：</strong>
            {order.customer_email}
          </p>
          <p>
            <strong>作成日：</strong>
            {order.created_at?.toDate().toLocaleString("ja-JP")}
          </p>

          {/* 🧭 編集・削除・戻るボタン */}
          <div className="order-detail-buttons">
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              編集
            </button>
            <button className="delete-button" onClick={handleDelete}>
              削除
            </button>
            <button className="back-button" onClick={onClose}>
              ← 閉じる
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// 📤 このモーダルを外部から使用可能にするためエクスポート
export default OrderDetailModal;
