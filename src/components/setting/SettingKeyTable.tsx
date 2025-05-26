import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { getPublicKey } from "@/lib/request/getPublicKey";
import { deletePublicKey } from "@/lib/request/deletePublicKey";
import { toast } from "sonner";

export default function SettingKeyTable() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const length = 30;
  const PUBLIC_KEYS_QUERY_KEY = ["publicKeys", length] as const;

  const { data: keys = [], isError } = useQuery({
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
        <Button
          className="px-7 py-6 cursor-pointer"
          onClick={() => navigate("/setting/add-new-key")}
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
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.map((key) => (
              <TableRow key={key.id}>
                <TableCell>{key.title}</TableCell>
                <TableCell>
                  {key.publicKey.length < length
                    ? key.publicKey
                    : `${key.publicKey.slice(0, length)}...`}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => deleteMutation.mutate(key.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="!w-5 !h-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
