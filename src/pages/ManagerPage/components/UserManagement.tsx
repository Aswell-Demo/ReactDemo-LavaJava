// 🧑‍💼【このファイルの目的】
// 管理者専用のユーザー情報管理コンポーネント。
// ・自分でFirestoreからユーザー一覧を取得
// ・インライン編集＆保存を行う管理画面

import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { firestore } from "../../../firebase";

// --------------------- 📦 ユーザー型定義 ---------------------
// Firestore「users」コレクションのドキュメント構造に対応
type User = {
  id: string; // ドキュメントID
  email: string; // メールアドレス（識別子）
  name: string; // 氏名
  namekana: string; // カナ（フリガナ）
  role: string; // 権限（例：manager、adminなど）
  status: string; // ステータス（アクティブ、停止中など）
};

// --------------------- 🖼 UserManagement コンポーネント本体 ---------------------
const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // Firestoreから取得したユーザー一覧
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // 編集対象の行インデックス

  // 🔄 ユーザー一覧をFirestoreから初回読み込み
  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(firestore, "users")); // 全件取得
      const data = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as User,
      );
      setUsers(data); // 状態にセット
    };
    fetchUsers();
  }, []);

  // ✏️ 入力値変更時の処理（ローカルステートのみ反映）
  const handleChange = (index: number, key: keyof User, value: string) => {
    const updated = [...users];
    updated[index][key] = value;
    setUsers(updated);
  };

  // 💾 Firestoreへ保存（更新）
  const handleSave = async (index: number) => {
    const target = users[index];
    await updateDoc(doc(firestore, "users", target.id), {
      name: target.name,
      namekana: target.namekana,
      role: target.role,
      status: target.status,
    });
    setEditingIndex(null); // 編集モード解除
    alert("保存しました！");
  };

  // --------------------- 🧱 ユーザー一覧表示テーブル ---------------------
  return (
    <div className="user-management">
      <h3>👥 権限管理ページ</h3>
      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>名前</th>
            <th>カナ</th>
            <th>役割</th>
            <th>状態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr key={u.id}>
              {/* 📧 メールアドレス（編集不可） */}
              <td>{u.email}</td>

              {/* 🧑 名前（編集可） */}
              <td>
                {editingIndex === idx ? (
                  <input
                    value={u.name}
                    onChange={(e) => handleChange(idx, "name", e.target.value)}
                  />
                ) : (
                  u.name
                )}
              </td>

              {/* 🎌 カナ（編集可） */}
              <td>
                {editingIndex === idx ? (
                  <input
                    value={u.namekana}
                    onChange={(e) =>
                      handleChange(idx, "namekana", e.target.value)
                    }
                  />
                ) : (
                  u.namekana
                )}
              </td>

              {/* 🛡 役割（編集可） */}
              <td>
                {editingIndex === idx ? (
                  <input
                    value={u.role}
                    onChange={(e) => handleChange(idx, "role", e.target.value)}
                  />
                ) : (
                  u.role
                )}
              </td>

              {/* 🟢 ステータス（編集可） */}
              <td>
                {editingIndex === idx ? (
                  <input
                    value={u.status}
                    onChange={(e) =>
                      handleChange(idx, "status", e.target.value)
                    }
                  />
                ) : (
                  u.status
                )}
              </td>

              {/* ⚙️ 操作（編集 or 保存ボタン） */}
              <td>
                {editingIndex === idx ? (
                  <button
                    className="save-button"
                    onClick={() => handleSave(idx)}
                  >
                    保存
                  </button>
                ) : (
                  <button
                    className="edit-button"
                    onClick={() => setEditingIndex(idx)}
                  >
                    編集
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 📤 外部コンポーネントで利用可能にするためのエクスポート
export default UserManagement;
