export default async function (id: string): Promise<string | null> {
  const res = await fetch("/api/publicKey", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(id),
  });

  if (!res.ok) {
    console.error("Failed to delete public key");
    return null;
  }

  const data = await res.text();
  return data;
}
