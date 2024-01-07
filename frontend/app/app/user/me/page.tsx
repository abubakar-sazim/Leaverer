"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface UserProfile {
  id: number;
  name: string;
  email: string;
}

const Profile = () => {
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        let storedProfileData = localStorage.getItem("profileData");

        if (!storedProfileData && accessToken) {
          const response = await axios.get<UserProfile>(
            "http://localhost:3001/profile",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          setProfileData(response.data);
          setEditedProfile(response.data);
          localStorage.setItem("profileData", JSON.stringify(response.data));
        } else {
          setProfileData(JSON.parse(storedProfileData!));
          setEditedProfile(JSON.parse(storedProfileData!));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfileData();
  }, []);

  const handleEditButtonClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSaveButtonClick = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      if (accessToken && editedProfile) {
        const response = await axios.patch(
          `http://localhost:3001/users/${editedProfile.id}`,
          editedProfile,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setProfileData(response.data);
        setEditedProfile(response.data);
        setIsEditing(false);

        localStorage.setItem("profileData", JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-md shadow-md">
      {profileData ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">
            Welcome, {profileData.name}
          </h1>
          <hr className="mb-4" />
          <div>
            {isEditing ? (
              <div>
                <div className="mb-4">
                  <label htmlFor="name" className="block mb-1 font-semibold">
                    Name:
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-primary-500"
                    value={editedProfile?.name || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block mb-1 font-semibold">
                    Email:
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-primary-500"
                    value={editedProfile?.email || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    className="px-6 py-2 mr-4 text-black bg-blue-300 rounded-md focus:outline-none hover:bg-primary-600"
                    onClick={handleSaveButtonClick}
                  >
                    Save
                  </button>
                  <button
                    className="px-6 py-2 text-black bg-gray-400 rounded-md focus:outline-none hover:bg-gray-600"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="font-semibold">Profile info:</h2>
                <p className="mb-2">UserId: {profileData.id}</p>
                <p className="mb-2">Name: {profileData.name}</p>
                <p className="mb-2">Email: {profileData.email}</p>
                <button
                  className="px-6 py-2 mt-4 text-black bg-green-300 rounded-md focus:outline-none hover:bg-primary-600"
                  onClick={handleEditButtonClick}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
