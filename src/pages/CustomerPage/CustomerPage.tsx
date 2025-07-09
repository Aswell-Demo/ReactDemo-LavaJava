// 🧾【このファイルの目的】
// 顧客ページのルートコンポーネント。
// ・ログインユーザーの情報（氏名・カナ）をFirestoreから取得
// ・「新規注文」と「注文履歴」の表示を切り替え
// ・注文フォームからのデータを受け取り、Firestoreに保存
import { useEffect, useState } from "react";
import NewOrderForm from "./components/NewOrderForm"; // 新規注文フォーム
import HeaderBar from "./components/HeaderBar"; // 上部ナビゲーション（名前・切り替え・ログアウト）
import OrderHistory from "./components/OrderHistory"; // 注文履歴表示
import { useAuth } from "../../context/AuthContext"; // ユーザー認証情報（Context）
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "../../firebase"; // Firebase Firestoreインスタンス

// --------------------- 🖼 顧客ページ本体 ---------------------
const CustomerPage = () => {
  const { user, role } = useAuth(); // 認証情報からユーザーとロールを取得

  // 📌 ユーザー情報と表示制御ステート
  const [name, setName] = useState(""); // 氏名
  const [nameKana, setNameKana] = useState(""); // 氏名カナ（未使用だが取得）
  const [customerEmail, setCustomerEmail] = useState(""); // メールアドレス
  const [currentView, setCurrentView] = useState<"new" | "history">("history"); // 表示画面の状態

  // 🔍 Firestoreからログイン中ユーザー情報を取得
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.email) {
        const docRef = doc(firestore, "users", user.email.toLowerCase().trim());
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name); // ユーザー名を設定
          setNameKana(data.namekana); // 氏名カナも一応保持
        }
        setCustomerEmail(user.email); // emailを保持（履歴検索用）
      }
    };
    fetchUserData();
  }, [user]);

  // 📝 注文送信時の処理（NewOrderFormコンポーネントから受け取る）
  const handleSubmitOrder = async (orderData: {
    order_id: string;
    items: string[];
    delivery_address: string;
    payment_method: string;
    notes: string;
  }) => {
    try {
      // 注文データをFirestoreに追加
      await addDoc(collection(firestore, "orders"), {
        ...orderData,
        customer_name: name,
        customer_email: customerEmail,
        status: "受注", // 初期状態：受注
        order_date: serverTimestamp(), // Firestoreのタイムスタンプ
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      alert("注文を保存しました！");
    } catch (err) {
      console.error("注文保存エラー:", err);
      alert("保存に失敗しました");
    }
  };

  // --------------------- 🧱 表示UI（Header + メイン表示の切り替え） ---------------------
  return (
    <div className="customer-page">
      {/* 上部バー：ユーザー名・ロール・画面切り替えボタン・ログアウト */}
      <HeaderBar
        name={name}
        role={role || ""}
        onViewChange={(view) => setCurrentView(view)}
      />

      {/* メインコンテンツエリア */}
      <main className="customer-main">
        {/* 新規注文画面 */}
        {currentView === "new" && (
          <NewOrderForm onSubmitOrder={handleSubmitOrder} />
        )}

        {/* 注文履歴画面 */}
        {currentView === "history" && <OrderHistory email={customerEmail} />}
      </main>
    </div>
  );
};

// 📤 外部ファイルで使用するためのエクスポート
export default CustomerPage;
