import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "your-app-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-app-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Hàm lấy imageUrl từ Firebase Storage
export const getImageUrl = async (filePath) => {
    const fileRef = ref(storage, filePath);
    const imageUrl = await getDownloadURL(fileRef);
    return imageUrl;
};
