import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth/page";
import Chat from "./pages/chat/page";
import Profile from "./pages/profile/page";
import { useAppStore } from "./store";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2Icon, LoaderIcon } from "lucide-react";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/getUserInfo`,
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        setUserInfo(undefined);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center  h-screen w-full text-white text-3xl font-bold capitalize bg-[#1f2229]">
        <div className="flex items-center justify-center gap-2">
          <h1>Loading</h1>
          <Loader2Icon className="animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </>
  );
}

export default App;
