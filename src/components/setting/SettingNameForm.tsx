import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSettings } from "@/lib/request/getSettings";
import { saveSettings } from "@/lib/request/saveSettings";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const PROFILE_QUERY_KEY = ["username"];

export default function SettingNameForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [username, setUsername] = useState("");
  const [linuxUsername, setLinuxUsername] = useState("");
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    data = { username: "", linuxUsername: "" },
    isSuccess,
    isError,
  } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getSettings,
    staleTime: 1000 * 60 * 30,
  });
  const addMutation = useMutation({
    mutationFn: (payload: { username: string; linuxUsername: string }) =>
      saveSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      toast("Save name successfully");
    },
    onError: () => {
      toast.error("Failed to save username");
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setUsername(data.username);
      setLinuxUsername(data.linuxUsername);
    }
    if (isError) {
      toast.error("Failed to get your name");
    }
  }, [isSuccess, isError, data]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Name</CardTitle>
          <CardDescription>
            Your real name to let the group administrator recognize you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <Input
              id="username"
              type="name"
              placeholder="e.g., Wang Jammy"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Separator></Separator>
            <Button
              className="w-full cursor-pointer"
              onClick={() => addMutation.mutate({ username, linuxUsername })}
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
