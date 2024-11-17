import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import axios from "axios";
import toast from "react-hot-toast";

export default function Auth() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginData.email) {
      toast.error("Please enter your email");
      return;
    }
    if (!loginData.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!loginData.password) {
      toast.error("Please enter your password");
      return;
    }
    if (loginData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/auth/login`,
        { email: loginData.email, password: loginData.password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUserInfo(response.data.user);
        navigate("/profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!registerData.email) {
      toast.error("Please enter your email");
      return;
    }
    if (!registerData.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!registerData.password) {
      toast.error("Please enter a password");
      return;
    }
    if (registerData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (!registerData.confirmPassword) {
      toast.error("Please confirm your password");
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/auth/register`,
        { email: registerData.email, password: registerData.password },
        { withCredentials: true }
      );
      if (response.data.user.id) {
        setUserInfo(response.data.user);
        if (response.data.user.profileSetup) {
          navigate("/chat");
        } else {
          navigate("/profile");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1f2229]">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2 bg-[#2d323c]">
          <TabsTrigger
            value="login"
            className="data-[state=active]:bg-[#E9EDEF] data-[state=active]:text-[#1f2229]"
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            value="register"
            className="data-[state=active]:bg-[#E9EDEF] data-[state=active]:text-[#1f2229]"
          >
            Register
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card className="bg-[#2d323c] border-none text-[#E9EDEF]">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription className="text-gray-400">
                Access your account here.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#E9EDEF]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="bg-[#1f2229] border-none text-[#E9EDEF] placeholder:text-gray-500"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#E9EDEF]">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="bg-[#1f2229] border-none text-[#E9EDEF] placeholder:text-gray-500"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-[#E9EDEF] text-[#1f2229] hover:bg-gray-200"
                >
                  Login
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card className="bg-[#2d323c] border-none text-[#E9EDEF]">
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription className="text-gray-400">
                Create a new account here.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-[#E9EDEF]">
                    Email
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    className="bg-[#1f2229] border-none text-[#E9EDEF] placeholder:text-gray-500"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-[#E9EDEF]">
                    Password
                  </Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Enter your password"
                    className="bg-[#1f2229] border-none text-[#E9EDEF] placeholder:text-gray-500"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-[#E9EDEF]">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    className="bg-[#1f2229] border-none text-[#E9EDEF] placeholder:text-gray-500"
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-[#E9EDEF] text-[#1f2229] hover:bg-gray-200"
                >
                  Register
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
