import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

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

export default function SettingKeyTable() {
  const navigate = useNavigate();
  const [keys, setKeys] = useState<
    { id: string; title: string; publicKey: string }[]
  >([]);

  useEffect(() => {
    async function fetchKeys() {
      const res = await getPublicKey();
      if (res) {
        console.log(res);
        setKeys(res);
      }
    }
    fetchKeys();
  }, []);

  return (
    <Card>
      <CardHeader className="py-5 flex justify-between">
        <CardTitle className="text-2xl">SSH Keys</CardTitle>
        <Button onClick={() => navigate("/Setting/addNewKey")}>
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
                  {key.publicKey && key.publicKey.length > 10
                    ? `${key.publicKey.slice(0, 10)}...`
                    : key.publicKey}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={async () => {
                      await deletePublicKey(key.id);
                      setKeys((prev) => prev.filter((k) => k.id !== key.id));
                      console.log("id:", key.id);
                    }}
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
