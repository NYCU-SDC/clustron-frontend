import { useState, useEffect } from "react";
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
import { getSettings } from "@/lib/request/getSettings";
import { saveSettings } from "@/lib/request/saveSettings";
import { Separator } from "./ui/separator";

export default function SettingUsernameForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [username, setUsername] = useState("");
  const [linuxUsername, setLinuxUsername] = useState("");

  useEffect(() => {
    async function fetchName() {
      const settings = await getSettings();
      if (settings) {
        setUsername(settings.username);
        setLinuxUsername(settings.linuxUsername);
      }
    }
    fetchName();
  }, []);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Linux Username</CardTitle>
          <CardDescription>
            The username to login to the remote server
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <Input
                id="linuxUsername"
                type="name"
                placeholder="e.g., Jammy"
                value={linuxUsername}
                onChange={(e) => setLinuxUsername(e.target.value)}
              />
              <Separator></Separator>
              <Button
                type="submit"
                className="w-full"
                onClick={() => saveSettings(username, linuxUsername)}
              >
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
