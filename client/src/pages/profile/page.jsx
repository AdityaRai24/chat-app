import { useAppStore } from "@/store";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, User } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Profile = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [formData, setFormData] = useState({
    firstName: userInfo?.firstName || "",
    lastName: userInfo?.lastName || "",
    email: userInfo?.email || "",
    profilePic: userInfo?.profilePic || "",
  });
  const [showAvatars, setShowAvatars] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const avatars = [
    "https://res.cloudinary.com/dhanvyweu/image/upload/v1731868427/avatar1_dn7qte.png",
    "https://res.cloudinary.com/dhanvyweu/image/upload/v1731868427/avatar6_ixk7gl.png",
    "https://res.cloudinary.com/dhanvyweu/image/upload/v1731868427/avatar4_uecmq1.png",
    "https://res.cloudinary.com/dhanvyweu/image/upload/v1731868427/avatar5_nh1jzv.png",
    "https://res.cloudinary.com/dhanvyweu/image/upload/v1731868427/avatar3_yj5pce.png",
    "https://res.cloudinary.com/dhanvyweu/image/upload/v1731868427/avatar2_ab14xk.png",
  ];

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFormData({
        ...formData,
        firstName: userInfo?.firstName,
        lastName: userInfo?.lastName,
        profilePic: userInfo?.profilePic,
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const loadingToast = toast.loading("Uploading image...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "chat-app");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dhanvyweu/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        profilePic: data.secure_url,
      }));
      toast.dismiss(loadingToast);
      toast.success("Image uploaded successfully");
      setShowAvatars(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to upload image");
    }
  };

  const handleAvatarSelect = (avatarUrl, e) => {
    e.preventDefault(); // Prevent form submission
    setFormData((prev) => ({
      ...prev,
      profilePic: avatarUrl,
    }));
    setShowAvatars(false);
  };

  const toggleAvatars = (e) => {
    e.preventDefault(); // Prevent form submission
    setShowAvatars(!showAvatars);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/updateProfile`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          profilePic: formData.profilePic,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setUserInfo({
          ...userInfo,
          ...formData,
          profileSetup: true,
        });
        toast.success("Profile updated successfully");
        navigate("/chat");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response.data.msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1f2229] p-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-[#2d323c] p-6">
          <h2 className="mb-2 text-xl text-[#E9EDEF]">Complete Your Profile</h2>
          <p className="mb-6 text-sm text-gray-400">
            Set up your account details
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="h-24 w-24 overflow-hidden rounded-full bg-[#1f2229]">
                  {formData.profilePic ? (
                    <img
                      src={formData.profilePic}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 transform space-x-2">
                  <div className="flex items-center justify-center rounded-full bg-[#E9EDEF] p-2 cursor-pointer hover:bg-gray-200 transition-all duration-300">
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <label
                            htmlFor="profile-pic"
                            className="cursor-pointer"
                          >
                            <Camera className="h-4 w-4 text-[#2d323c]" />
                          </label>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Upload a custom image</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <input
                      type="file"
                      id="profile-pic"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      onClick={(e) => e.stopPropagation()} // Prevent event bubbling
                    />
                  </div>
                  <button
                    type="button" // Explicitly set button type
                    onClick={toggleAvatars}
                    className="flex items-center justify-center rounded-full bg-[#E9EDEF] p-2 hover:bg-gray-200 transition-all duration-300"
                  >
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger>
                          <User className="h-4 w-4 text-[#2d323c]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Choose an avatar</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </button>
                </div>
              </div>
            </div>

            {showAvatars && (
              <div className="grid grid-cols-3 gap-4 mt-8">
                {avatars.map((avatar, index) => (
                  <button
                    key={index}
                    type="button" // Explicitly set button type
                    onClick={(e) => handleAvatarSelect(avatar, e)}
                    className={`relative rounded-full aspect-square transition-all duration-300
                    ${
                      formData.profilePic === avatar
                        ? "ring-2 ring-[#E9EDEF] ring-offset-2 ring-offset-[#2d323c]"
                        : "hover:ring-2 hover:ring-[#E9EDEF] hover:ring-offset-2 hover:ring-offset-[#2d323c]"
                    }`}
                  >
                    <img
                      src={avatar}
                      alt={`Avatar ${index + 1}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-[#E9EDEF]" htmlFor="firstName">
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter your first name"
                className="rounded bg-[#1f2229] text-[#E9EDEF] outline-none border-gray-600 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#E9EDEF]" htmlFor="lastName">
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
                className="rounded bg-[#1f2229] text-[#E9EDEF] outline-none border-gray-600 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#E9EDEF]" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                readOnly
                className="rounded bg-[#1f2229] text-[#E9EDEF] border-gray-600 outline-none"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded bg-[#E9EDEF] p-3 text-[#2d323c] hover:bg-gray-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
