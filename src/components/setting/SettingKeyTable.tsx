import { useEffect } from "react";
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

const PUBLIC_KEYS_QUERY_KEY = ["publicKeys"];

export default function SettingKeyTable() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: keys = [], isError } = useQuery({
    queryKey: PUBLIC_KEYS_QUERY_KEY,
    queryFn: getPublicKey,
    staleTime: 1000 * 60 * 30,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePublicKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PUBLIC_KEYS_QUERY_KEY });
      toast("Delete key successful");
    },
    onError: () => {
      toast("Failed to delete public key");
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error("Failed to get public key list");
    }
  }, [isError]);

  return (
    <Card>
      <CardHeader className="py-5 flex justify-between">
        <CardTitle className="text-2xl">SSH Keys</CardTitle>
        <Button
          className="cursor-pointer"
          onClick={() => navigate("/Setting/addNewKey")}
        >
          ＋ New SSH Keys
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-2/5 text-gray-500 dark:text-white">
                Title
              </TableHead>
              <TableHead className="w-3/5 text-gray-500 dark:text-white">
                Key
              </TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.map((key) => (
              <TableRow key={key.id}>
                <TableCell>{key.title}</TableCell>
                <TableCell>
                  {key.publicKey.length >= 10
                    ? `${key.publicKey.slice(0, 10)}...`
                    : key.publicKey}
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
