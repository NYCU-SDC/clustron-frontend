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
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Textarea } from "@/components/ui/textarea";

export default function SettingAddKeyForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Title</CardTitle>
            <CardDescription>Give your public key a name</CardDescription>
          </CardHeader>
          <CardContent>
            <Input type="text" placeholder="My Laptop" required />
          </CardContent>
          <Separator />
          <CardHeader>
            <CardTitle className="text-2xl">Key</CardTitle>
            <CardDescription>
              Paste your public key here NOT private key. The file name should
              end with <code>.pub</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <Textarea
                placeholder="Begins with 'ssh-rsa', 'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', 'ecdsa-sha2-nistp521', 'ssh-ed25519', 'sk-ecdsa-sha2-nistp256@openssh.com', or 'sk-ssh-ed25519@openssh.com'"
                required
              />
              <Button type="submit" className="w-full">
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
