export default async function getPublicKey(): Promise<{
  id: string;
  title: string;
  publicKey: string;
} | null> {
  const res = await fetch(`/api/publickey`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    console.error("Failed to get public key");
    return null;
  }

  const data = await res.json();
  return {
    id: data.id,
    title: data.title,
    publicKey: data.publicKey,
  };
}
