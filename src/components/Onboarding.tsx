import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  User: z.string().nonempty("不得為空"),
  PublicKeyName: z.string(),
  PublicKey: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  defaultData: {
    User?: string;
    PublicKeyName?: string;
    PublicKey?: string;
  };
};

export function Onboarding({ defaultData }: Props) {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      User: defaultData.User || "",
      PublicKeyName: defaultData.PublicKeyName || "",
      PublicKey: defaultData.PublicKey || "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("送出資料：", data);
    setTimeout(() => {
      toast.success("資料儲存成功！");
      navigate("/");
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardContent className="p-6 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-left text-3xl font-bold">請輸入您的基本資料</h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="User"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">姓名 *</FormLabel>
                    <FormControl className="text-sm">
                      <Input {...field} placeholder="您的姓名" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="PublicKeyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      Linux 使用者名稱
                    </FormLabel>
                    <FormControl className="text-sm">
                      <Input {...field} placeholder="使用者名稱" />
                    </FormControl>

                    <FormDescription className="text-xs">
                      用以登入遠端伺服器的使用者名稱
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="PublicKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">公鑰</FormLabel>
                    <FormControl className="text-sm">
                      <Input {...field} placeholder="公鑰" />
                    </FormControl>
                    <FormDescription className="text-xs">
                      用以登入遠端伺服器的公鑰
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 text-right">
                <Button
                  type="submit"
                  className="inline-flex w-24 ml-auto bg-black text-white hover:bg-gray-700 active:bg-gray-800 transition-colors"
                >
                  完成
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
