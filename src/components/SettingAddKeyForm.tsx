import { useState } from "react";
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
import { Separator as CardSeperator } from "@radix-ui/react-dropdown-menu";
import { Separator } from "./ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router";
import { savePublicKey } from "@/lib/request/savePublicKey";

export default function SettingAddKeyForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [title, setTitle] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!title || !publicKey) {
      alert("pls input tile and publicKey");
      return;
    }
    const res = await savePublicKey({ title, publicKey });
    console.log(res);
    if (res) {
      navigate("/setting/ssh");
    } else {
      alert("fail");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Title</CardTitle>
          <CardDescription>Give your public key a name</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="My Laptop"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </CardContent>
        <CardSeperator />
        <CardHeader>
          <CardTitle className="text-2xl">Key</CardTitle>
          <CardDescription>
            Paste your public key here NOT private key. The file name should end
            with <code>.pub</code>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <Textarea
              placeholder="Begins with 'ssh-rsa', 'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', 'ecdsa-sha2-nistp521', 'ssh-ed25519', 'sk-ecdsa-sha2-nistp256@openssh.com', or 'sk-ssh-ed25519@openssh.com'"
              onChange={(e) => setPublicKey(e.target.value)}
              className="h-32"
            />
            <Separator />
            <div className="flex justify-center">
              <Button
                variant="destructive"
                className="w-2/5 m-5"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-2/5 m-5" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
