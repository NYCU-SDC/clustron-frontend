import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { getPublicKey } from "@/lib/request/getPublicKey";
import { deletePublicKey } from "@/lib/request/deletePublicKey";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, TriangleAlert, Loader2Icon } from "lucide-react";

export default function SettingKeyTable() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const length = 30;
  const PUBLIC_KEYS_QUERY_KEY = ["publicKeys", length] as const;

  const {
    data: keys = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: PUBLIC_KEYS_QUERY_KEY,
    queryFn: ({ queryKey }) => {
      const [, length] = queryKey;
      return getPublicKey(length);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (fingerprint: string) => deletePublicKey(fingerprint),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PUBLIC_KEYS_QUERY_KEY });
      toast.success(t("settingKeyTable.successToast"));
    },
    onError: () => {
      toast.error(t("settingKeyTable.deleteFailToast"));
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error(t("settingKeyTable.getFailToast"));
    }
  }, [isError, t]);

  return (
    <Card>
      <CardHeader className="py-5 flex justify-between">
        <CardTitle className="text-2xl">
          {t("settingKeyTable.cardTitleForKeyTable")}
        </CardTitle>
        <Button
          className="px-7 py-5 cursor-pointer"
          onClick={() => navigate("/setting/ssh/new")}
        >
          {t("settingKeyTable.addNewKeyBtn")}
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-2/5 text-gray-500 dark:text-white">
                {t("settingKeyTable.tableHeadForTitle")}
              </TableHead>
              <TableHead className="w-3/5 text-gray-500 dark:text-white">
                {t("settingKeyTable.tableHeadForKey")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              </TableRow>
            ) : (
              keys.map((key) => (
                <TableRow key={key.fingerprint}>
                  <TableCell>{key.title}</TableCell>
                  <TableCell>
                    {key.publicKey.length < length
                      ? key.publicKey
                      : `${key.publicKey.slice(0, length)}...`}
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" className="cursor-pointer">
                          <Trash2 className="!w-5 !h-5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            <div className="flex items-center gap-2">
                              <TriangleAlert className="w-5 h-5" />
                              {t("settingKeyTable.confirmTitle")}
                            </div>
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("settingKeyTable.confirmDescription")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="cursor-pointer mx-2">
                            {t("settingKeyTable.cancelBtn")}
                          </AlertDialogCancel>
                          {deleteMutation.isPending ? (
                            <AlertDialogAction
                              className="mx-2 bg-destructive text-white shadow-xs disabled:cursor-not-allowed disabled:pointer-events-auto dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
                              disabled
                            >
                              <Loader2Icon className="animate-spin" />
                              {t("settingKeyTable.loadingBtn")}
                            </AlertDialogAction>
                          ) : (
                            <AlertDialogAction
                              className="cursor-pointer mx-2 bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
                              onClick={() =>
                                deleteMutation.mutate(key.fingerprint)
                              }
                            >
                              {t("settingKeyTable.confirmBtn")}
                            </AlertDialogAction>
                          )}
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
