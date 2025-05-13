import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/UserContext";
import { useState } from "react";
import { canArchiveGroup } from "@/lib/permission";
import { useGetGroups } from "@/api/queries/useGetGroups";
import { setToken } from "@/lib/token";
import { mockUsers } from "@/lib/userMock";
import type { JwtPayload } from "@/types/jwt";
function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const base64Payload = token.split(".")[1];
    return JSON.parse(atob(base64Payload));
  } catch {
    return null;
  }
}

export default function CourseList() {
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();
  const isAdmin = user?.accessLevel === "admin";
  const [inputToken, setInputToken] = useState("");

  const { data, isLoading } = useGetGroups();

  const handleLogin = () => {
    const decoded = decodeJwtPayload(inputToken.trim());
    if (!decoded) {
      alert("無效 JWT token");
      return;
    }

    const fullUser = mockUsers.find((u) => u.id === decoded.id);
    if (!fullUser) {
      alert("找不到對應的使用者資料");
      return;
    }

    setToken(inputToken.trim());
    setUser(fullUser);
  };

  const canCreateCourse =
    isAdmin || (user && canArchiveGroup(user.accessLevel));

  return (
    <div className="p-4 space-y-4">
      {!user ? (
        <div className="flex gap-2 flex-col sm:flex-row">
          <input
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            className="border px-3 py-1 rounded w-full"
            placeholder="請貼上 JWT Token"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            登入
          </button>
        </div>
      ) : (
        <>
          <div>
            👋 歡迎，{user.username}（{user.accessLevel}）
          </div>

          <div className="p-10">
            <div className="flex justify-between mb-6">
              <h1 className="text-2xl font-bold">Courses</h1>
              {canCreateCourse && (
                <Button
                  onClick={() => navigate("/groups/new")}
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
                {data?.items.map((group) => {
                  const access = group.me?.role?.accessLevel;
                  if (!access) return null;
                  const isReadonly = group.me.role.accessLevel === "user";
                  const path = isReadonly
                    ? `/groups/${group.id}/info`
                    : `/groups/${group.id}`;

                  return (
                    <div
                      key={group.id}
                      onClick={() => navigate(path)}
                      className="cursor-pointer rounded-lg border p-6 hover:bg-gray-50 transition"
                    >
                      <h2 className="text-xl font-semibold mb-2">
                        {group.title}
                      </h2>
                      <p className="text-gray-600 text-sm">
                        {group.description}
                      </p>
                      {isAdmin && (
                        <p className="text-xs text-gray-400">(admin view)</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
