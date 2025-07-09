// 🔥【このファイルの目的】
// Firebase の初期化を行い、Auth（認証）と Firestore（データベース）をエクスポートする設定ファイル。
// プロジェクト全体で Firebase の各機能を簡単に使えるようにするための共通エントリーポイント。

// --------------------- ✅ Firebaseの各機能をインポート ---------------------
import { initializeApp } from "firebase/app"; // Firebase アプリ初期化用
import { getAuth } from "firebase/auth"; // 認証（ログイン・登録）機能
import { getFirestore } from "firebase/firestore"; // Cloud Firestore データベース

// --------------------- 🔐 Firebaseプロジェクトの設定情報 ---------------------
const firebaseConfig = {
  apiKey: "AIzaSyCIwvF2XLD_bhizdcyE4kk6qrjhlV-iu38", // 🔑 APIキー（セキュリティに注意）
  authDomain: "aswell-firebase-login.firebaseapp.com", // 認証用ドメイン
  projectId: "aswell-firebase-login", // FirebaseプロジェクトのID
  storageBucket: "aswell-firebase-login.appspot.com", // ストレージバケット（画像など保存用）
  messagingSenderId: "791823600670", // メッセージング送信者ID（通知機能用）
  appId: "1:791823600670:web:b8bbcb5f78a681ffe9f20f", // アプリ固有のID
};

// --------------------- 🚀 Firebaseを初期化 ---------------------
const app = initializeApp(firebaseConfig); // Firebaseアプリ全体の初期化処理

// --------------------- 🔐 認証サービスの初期化 ---------------------
const auth = getAuth(app); // Firebase Authentication（ログイン/登録処理）に使用

// --------------------- 🗃 Firestore（NoSQLデータベース）の初期化 ---------------------
const db = getFirestore(app); // Firestore のデータベースインスタンスを作成

// ✅ 必要に応じて別名エクスポート（firestore も個別に使えるように）
export const firestore = getFirestore(app);

// --------------------- 📦 外部で使えるようにエクスポート ---------------------
export { auth, db }; // 認証（auth）とデータベース（db）をアプリ内で利用可能にする
