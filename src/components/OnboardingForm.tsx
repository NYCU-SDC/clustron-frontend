import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
      toast.success(t("onboarding.toastSuccess"));
      navigate("/");
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl whitespace-nowrap font-bold">
              {t("onboarding.title")}
            </h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="User"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      {t("onboarding.nameLabel")} *
                    </FormLabel>
                    <FormControl className="text-sm">
                      <Input
                        {...field}
                        placeholder={t("onboarding.namePlaceholder")}
                      />
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
                      {t("onboarding.usernameLabel")}
                    </FormLabel>
                    <FormControl className="text-sm">
                      <Input
                        {...field}
                        placeholder={t("onboarding.usernamePlaceholder")}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      {t("onboarding.usernameDescription")}
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
                    <FormLabel className="font-bold">
                      {t("onboarding.publicKeyLabel")}
                    </FormLabel>
                    <FormControl className="text-sm">
                      <Input
                        {...field}
                        placeholder={t("onboarding.publicKeyPlaceholder")}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      {t("onboarding.publicKeyDescription")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="inline-flex w-24 ml-auto bg-black text-white hover:bg-gray-700 active:bg-gray-800 transition-colors"
                >
                  {t("onboarding.submitButton")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
