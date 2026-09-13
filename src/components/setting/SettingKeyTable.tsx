import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DataTable,
  createDataTableColumnHelper,
} from "@/components/ui/data-table";
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
import { Trash2, TriangleAlert, Loader2Icon } from "lucide-react";
import GitHubBlackImg from "@/assets/GitHub_Black.png";
import GitHubWhiteImg from "@/assets/GitHub_White.png";
import type { PublicKeyInfo } from "@/types/settings";

// Number of characters of a public key shown before it is truncated. Also sent
// to the API so it only returns that much of each key.
const KEY_PREVIEW_LENGTH = 30;

const helper = createDataTableColumnHelper<PublicKeyInfo>();

const HEAD_CLASS = "text-gray-500 dark:text-white";

function getColumns({
  t,
  onDelete,
  isDeleting,
}: {
  t: TFunction;
  onDelete: (fingerprint: string) => void;
  isDeleting: boolean;
}) {
  return helper.columns([
    helper.accessor("title", {
      header: t("settingKeyTable.tableHeadForTitle"),
      meta: {
        headClassName: `w-2/5 ${HEAD_CLASS}`,
        cellClassName: "max-w-0 truncate",
      },
    }),
    helper.accessor("publicKey", {
      header: t("settingKeyTable.tableHeadForKey"),
      meta: {
        headClassName: `w-3/5 ${HEAD_CLASS}`,
        cellClassName: "max-w-0 truncate font-mono text-xs",
      },
      cell: ({ getValue }) => {
        const publicKey = getValue();
        return publicKey.length < KEY_PREVIEW_LENGTH
          ? publicKey
          : `${publicKey.slice(0, KEY_PREVIEW_LENGTH)}...`;
      },
    }),
    helper.display({
      id: "actions",
      header: "",
      meta: { cellClassName: "text-right" },
      cell: ({ row }) => (
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
                {t("common.cancel")}
              </AlertDialogCancel>
              {isDeleting ? (
                <AlertDialogAction
                  className="mx-2 bg-destructive text-white shadow-xs disabled:cursor-not-allowed disabled:pointer-events-auto dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
                  disabled
                >
                  <Loader2Icon className="animate-spin" />
                  {t("common.loading")}
                </AlertDialogAction>
              ) : (
                <AlertDialogAction
                  className="cursor-pointer mx-2 bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
                  onClick={() => onDelete(row.original.fingerprint)}
                >
                  {t("common.delete")}
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
    }),
  ]);
}

export default function SettingKeyTable() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const PUBLIC_KEYS_QUERY_KEY = ["publicKeys", KEY_PREVIEW_LENGTH] as const;

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
    mutationFn: (fingerprint: string) => deletePublicKey(fingerprint),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PUBLIC_KEYS_QUERY_KEY });
      toast.success(t("settingKeyTable.successToast"));
    },
    onError: () => {
      toast.error(t("settingKeyTable.deleteFailToast"));
    },
  });

  const columns = useMemo(
    () =>
      getColumns({
        t,
        onDelete: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
      }),
    [t, deleteMutation.mutate, deleteMutation.isPending],
  );

  const handleGithubKeysImport = async () => {
    try {
      const response = await importPublicKeys();
      if (response && response.redirectURL) {
        window.location.href = response.redirectURL;
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
  };

  useEffect(() => {
    if (isError) {
      toast.error(t("settingKeyTable.getFailToast"));
    }
  }, [isError, t]);

  return (
    <Card>
      <CardHeader className="py-5 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <CardTitle className="text-2xl">
          {t("settingKeyTable.cardTitleForKeyTable")}
        </CardTitle>
        <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-3 sm:gap-4">
          <Button
            className="py-5 cursor-pointer w-full sm:w-auto"
            onClick={() => navigate("/setting/ssh/new")}
          >
            {t("settingKeyTable.addNewKeyBtn")}
          </Button>
          <Button
            className="py-5 cursor-pointer w-full sm:w-auto"
            onClick={handleGithubKeysImport}
          >
            <img
              src={GitHubBlackImg}
              className="w-5 h-5 hidden dark:block"
            ></img>
            <img
              src={GitHubWhiteImg}
              className="w-5 h-5 block dark:hidden"
            ></img>
            {t("settingKeyTable.importFromGitHubBtn")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={keys}
          isLoading={isLoading}
          loadingRowCount={1}
          getRowId={(key) => key.fingerprint}
        />
      </CardContent>
    </Card>
  );
}
