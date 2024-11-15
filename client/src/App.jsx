import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth/page";
import Chat from "./pages/chat/page";
import Profile from "./pages/profile/page";

function App() {
  return (
    <>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </>
  );
}

export default App;
