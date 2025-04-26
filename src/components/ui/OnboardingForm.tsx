import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
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

export function OnboardingForm({ defaultData }: Props) {
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
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardContent className="p-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Clustron</h1>
          <p className="text-sm">請設定以下資訊以取得遠端伺服器權限</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="User"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>使用者名稱</FormLabel>
                  <FormControl className="text-sm">
                    <Input {...field} placeholder="您的使用者名稱" />
                  </FormControl>
                  <FormDescription className="text-xs">
                    登入遠端伺服器時的使用者名稱
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="PublicKeyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>公鑰</FormLabel>
                  <FormControl className="text-sm">
                    <Input {...field} placeholder="公鑰名稱" />
                  </FormControl>
                  <FormDescription className="text-xs">
                    為您的公鑰加上便於識別的名稱
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
                  <FormControl className="text-sm">
                    <Input {...field} placeholder="公鑰" />
                  </FormControl>
                  <FormDescription className="text-xs">
                    用於登入遠端伺服器的公鑰
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Link
                to="/"
                className="text-gray-400 items-end text-sm flex-1 inline-flex justify-end underline"
              >
                稍後設定
              </Link>
              <Button
                type="submit"
                className="inline-flex w-24 items-end bg-blue-400 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors"
              >
                完成 →
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
