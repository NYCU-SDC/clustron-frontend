// src/pages/CourseList.tsx

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/UserContext";
import { useState } from "react";
import { canArchiveGroup } from "@/lib/permission";
import { useGetGroups } from "@/api/queries/useGetGroups";

export default function CourseList() {
  const navigate = useNavigate();
  const { user, login } = useUserContext();
  const isAdmin = user?.accessLevel === "admin";
  const [inputId, setInputId] = useState("");

  const { data, isLoading } = useGetGroups(); // ⬅️ 改用 API
  // console.log("[CourseList] groups data:", data);
  const handleLogin = () => {
    const ok = login(inputId.trim());
    if (!ok) alert("使用者不存在");
  };

  const canCreateCourse =
    isAdmin || (user && canArchiveGroup(user.accessLevel));

  return (
    <div className="p-4 space-y-4">
      {!user ? (
        <div className="flex gap-2">
          <input
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            className="border px-3 py-1 rounded"
            placeholder="輸入學號登入"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            登入
          </button>
        </div>
      ) : (
        <div>
          👋 歡迎，{user.username}（{user.accessLevel}）
        </div>
      )}

      <div className="p-10">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Courses</h1>
          {canCreateCourse && (
            <Button
              onClick={() => navigate("/add-group")}
              className="bg-gray-900 text-white"
            >
              + New Course
            </Button>
          )}
        </div>

        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-4">
            {data?.items
              .filter(
                (group) => isAdmin || group.me.role.accessLevel !== "user",
              )
              .map((group) => {
                const isReadonly = group.me.role.accessLevel === "user";
                const path = isReadonly ? `/${group.id}` : `/group/${group.id}`;

                return (
                  <div
                    key={group.id}
                    onClick={() => navigate(path)}
                    className="cursor-pointer rounded-lg border p-6 hover:bg-gray-50 transition"
                  >
                    <h2 className="text-xl font-semibold mb-2">
                      {group.title}
                    </h2>
                    <p className="text-gray-600 text-sm">{group.description}</p>
                    {isAdmin && (
                      <p className="text-xs text-gray-400">(admin view)</p>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
