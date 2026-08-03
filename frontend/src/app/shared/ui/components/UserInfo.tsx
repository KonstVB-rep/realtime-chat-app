'use client';
import { useUser, useAuth } from "@clerk/nextjs";

export default function UserInfo() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth(); // Хук для получения токена

  if (!isLoaded || !isSignedIn) return null;

  const handleTestRequest = async () => {
    const token = await getToken();
    console.log("JWT Token for Backend:", token);
    // Здесь мы будем делать fetch к нашему Express-серверу
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="font-bold">Привет, {user.firstName}!</h2>
      <button 
        onClick={handleTestRequest}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Проверить токен в консоли
      </button>
    </div>
  );
}