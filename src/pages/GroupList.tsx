import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import GroupDescription from "@/components/group/GroupDes";
import { useGetGroups } from "@/hooks/useGetGroups";
import { useGlobalPermissions } from "@/hooks/useGlobalPermissions";
import { setToken, getToken, removeToken } from "@/lib/token";
import { useJwtPayload } from "@/hooks/useJwtPayload";

export default function GroupListPage() {
  const navigate = useNavigate();
  const [inputToken, setInputToken] = useState("");

  const { data, isLoading, isError } = useGetGroups();
  const { canCreateGroup } = useGlobalPermissions();
  const payload = useJwtPayload();

  const handleLogin = () => {
    const token = inputToken.trim();
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      if (!decoded.Role) throw new Error("缺少角色資訊");
      setToken(token);
      window.location.reload(); // 重新掛載以取得角色
    } catch {
      alert("無效 JWT token");
    }
  };

  const handleLogout = () => {
    removeToken();
    window.location.reload();
  };

  if (!getToken()) {
    return (
      <div className="p-10 space-y-4">
        <h1 className="text-2xl font-bold mb-4">請先登入</h1>
        <div className="flex gap-2 flex-col sm:flex-row">
          <input
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            className="border px-3 py-1 rounded w-full"
            placeholder="請貼上 JWT Token"
          />
          <Button onClick={handleLogin}>登入</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-4">
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Courses</h1>
          {payload && (
            <div className="flex items-center gap-4 mt-1">
              <p className="text-sm text-muted-foreground">
                👋 歡迎，{payload.username}（{payload.role}）
              </p>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                登出
              </Button>
            </div>
          )}
        </div>

        {canCreateGroup && (
          <Button
            onClick={() => navigate("/groups/new")}
            className="bg-gray-900 text-white"
          >
            + New Course
          </Button>
        )}
      </div>

      {isLoading ? (
        <p className="text-gray-500">載入中...</p>
      ) : isError ? (
        <p className="text-red-500">載入失敗</p>
      ) : !data || data.items.length === 0 ? (
        <p className="text-gray-500">你尚未加入任何課程。</p>
      ) : (
        <div className="space-y-4">
          {data.items.map((group) => {
            const path = `/groups/${group.id}/settings`;
            return (
              <div
                key={group.id}
                onClick={() => navigate(path)}
                className="cursor-pointer rounded-lg border hover:bg-gray-50 transition"
              >
                <GroupDescription
                  title={group.title}
                  desc={group.description}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
