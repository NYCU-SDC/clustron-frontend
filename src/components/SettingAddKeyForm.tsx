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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Separator as CardSeperator } from "@radix-ui/react-dropdown-menu";
import { Separator } from "./ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { savePublicKey } from "@/lib/request/savePublicKey";
import { toast } from "sonner";

const PUBLIC_KEYS_QUERY_KEY = ["publicKeys"];

export default function SettingAddKeyForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [title, setTitle] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const addMutation = useMutation({
    mutationFn: (payload: { title: string; publicKey: string }) =>
      savePublicKey(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PUBLIC_KEYS_QUERY_KEY });
      toast.success("Save successful");
      navigate("/setting/ssh");
    },
    onError: (error: Error) => {
      if (error.name === "BadKeyError") {
        toast.error("Public key format error");
      } else {
        toast.error("Failed to save public key");
      }
    },
  });

  const SaveBtnIsDisabled = addMutation.isPending || !title || !publicKey;
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
                className="w-2/5 m-5 cursor-pointer"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <TooltipProvider>
                {SaveBtnIsDisabled ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        disabled
                        className="w-2/5 m-5 disabled:cursor-not-allowed disabled:pointer-events-auto"
                      >
                        Save
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      align="center"
                      className="max-w-xs break-all whitespace-normal"
                    >
                      Please fill in both Title and Public Key
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    className="w-2/5 m-5 cursor-pointer"
                    onClick={() => addMutation.mutate({ title, publicKey })}
                  >
                    Save
                  </Button>
                )}
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
