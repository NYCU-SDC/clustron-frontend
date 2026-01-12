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
import { useNavigate, useSearchParams } from "react-router";
import { getPublicKey } from "@/lib/request/getPublicKey";
import { deletePublicKey } from "@/lib/request/deletePublicKey";
import { importPublicKeys } from "@/lib/request/importPublicKeys";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, TriangleAlert, Loader2Icon } from "lucide-react";

export default function SettingKeyTable() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const length = 30;
  const PUBLIC_KEYS_QUERY_KEY = ["publicKeys", length] as const;

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const importedCount = searchParams.get("imported");
    const duplicateCount = searchParams.get("duplicates");

    if (importedCount !== null || duplicateCount !== null) {
      const success = parseInt(importedCount || "0", 10);
      const dups = parseInt(duplicateCount || "0", 10);

      if (success > 0 && dups === 0) {
        toast.info(
          t("settingKeyTable.importSuccessMsg", {
            success: success,
            moreThanOne: success > 1 ? "s" : "",
          }),
        );
      } else if (success > 0 && dups > 0) {
        toast.info(
          t("settingKeyTable.importWithDuplicateMsg", {
            success: success,
            duplicate: dups,
          }),
        );
      } else if (success === 0 && dups > 0) {
        toast.warning(
          t("settingKeyTable.importWithAllDuplicateMsg", {
            duplicate: dups,
            moreThanOne: dups > 1 ? "s" : "",
          }),
        );
      } else if (success === 0 && dups === 0) {
        toast.warning(t("settingKeyTable.importNothingMsg"));
      }

      const newParams = new URLSearchParams(searchParams);
      newParams.delete("imported");
      newParams.delete("duplicates");
      newParams.delete("r");

      navigate({ search: newParams.toString() }, { replace: true });
    }
  }, [searchParams, navigate, t]);

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
    mutationFn: (id: string) => deletePublicKey(id),
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
        <div className="flex gap-4">
          <Button
            className="py-5 cursor-pointer"
            onClick={() => navigate("/setting/add-new-key")}
          >
            {t("settingKeyTable.addNewKeyBtn")}
          </Button>
          <Button
            className="py-5 cursor-pointer"
            onClick={async () => {
              try {
                const response = await importPublicKeys();
                if (response && response.url) {
                  window.location.href = response.url;
                } else {
                  toast.error(
                    t("settingKeyTable.importFromGitHubError") ??
                      "Failed to import keys from GitHub.",
                  );
                }
              } catch (error) {
                console.error("Failed to import public keys:", error);
                toast.error(
                  t("settingKeyTable.importFromGitHubError") ??
                    "Failed to import keys from GitHub.",
                );
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="mr-1"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
            </svg>
            {t("settingKeyTable.importFromGitHubBtn")}
          </Button>
        </div>
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
                <TableRow key={key.id}>
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
                              onClick={() => deleteMutation.mutate(key.id)}
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
