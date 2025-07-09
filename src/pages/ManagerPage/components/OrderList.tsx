// 📦【このファイルの目的】
// 管理者ページで表示される注文一覧表コンポーネント。
// ・Firestoreから注文一覧を自分で取得
// ・検索、ページング、状態変更、モーダル表示も内部で処理

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, updateDoc, doc } from "firebase/firestore";
import { firestore } from "../../../firebase";
import OrderDetailModal from "./OrderDetailModal";

// --------------------- 🧾 注文データ型定義 ---------------------
type OrderType = {
  id: string;
  order_id: string;
  customer_name: string;
  items: string[] | string;
  delivery_address: string;
  notes: string;
  status: string;
  created_at: any;
  payment_method?: string;
  customer_email?: string;
};

// --------------------- 📌 Props定義 ---------------------
type Props = {
  currentStatus: string;
  setSelectedOrder: (order: any) => void;
};

const OrderList: React.FC<Props> = ({ currentStatus }) => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      const q = query(collection(firestore, "orders"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as OrderType,
      );

      // 🔽 這裡加上由舊到新排序
      data.sort((a, b) => {
        const dateA = a.created_at?.toDate?.();
        const dateB = b.created_at?.toDate?.();
        return dateA && dateB ? dateA.getTime() - dateB.getTime() : 0;
      });

      setOrders(data);
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateDoc(doc(firestore, "orders", orderId), {
      status: newStatus,
      updated_at: new Date(),
    });
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );
  };

  const filtered = orders
    .filter((order) => order.status === currentStatus)
    .filter((order) =>
      order.customer_name?.toLowerCase().includes(searchKeyword.toLowerCase()),
    );

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  return (
    <>
      <header>
        <div className="search-bar-container">
          <h3 className="order-title">📦 {currentStatus}中の注文一覧</h3>
          <input
            type="text"
            className="search-input"
            placeholder="顧客名で検索"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </header>

      <div className="order-list">
        <table className="order-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>日付</th>
              <th>ステータス変更</th>
              <th>注文ID</th>
              <th>顧客名</th>
              <th>商品</th>
              <th>配送先住所</th>
              <th>備考</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((order, index) => {
              const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
              return (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{rowNumber}</td>
                  <td>
                    {order.created_at?.toDate
                      ? order.created_at.toDate().toLocaleDateString("ja-JP")
                      : ""}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                    >
                      <option value="受注">受注</option>
                      <option value="受注確認">受注確認</option>
                      <option value="発注">発注</option>
                      <option value="納品">納品</option>
                    </select>
                  </td>
                  <td>{order.order_id}</td>
                  <td>{order.customer_name}</td>
                  <td>
                    {Array.isArray(order.items)
                      ? order.items.join(", ")
                      : order.items}
                  </td>
                  <td>{order.delivery_address}</td>
                  <td>{order.notes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            ← 前のページ
          </button>
          <span style={{ margin: "0 10px" }}>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage >= totalPages}
          >
            次のページ →
          </button>
        </div>
      </div>

      {/* モーダル */}
      {selectedOrder && (
        <OrderDetailModal
          order={{
            ...selectedOrder,
            payment_method: selectedOrder.payment_method ?? "", // ⬅️ 保證不為 undefined
            customer_email: selectedOrder.customer_email ?? "",
          }}
          onClose={() => setSelectedOrder(null)}
          onRefresh={async () => {
            const snapshot = await getDocs(collection(firestore, "orders"));
            const data = snapshot.docs.map(
              (doc) => ({ id: doc.id, ...doc.data() }) as OrderType,
            );

            // 🔽 這裡也排序（同樣舊到新）
            data.sort((a, b) => {
              const dateA = a.created_at?.toDate?.();
              const dateB = b.created_at?.toDate?.();
              return dateA && dateB ? dateA.getTime() - dateB.getTime() : 0;
            });

            setOrders(data);
          }}
        />
      )}
    </>
  );
};

export default OrderList;
