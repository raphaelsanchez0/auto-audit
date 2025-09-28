export async function getTemplate(id: number) {
  const res = await fetch(`/api/template?id=${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch template");
  }
  return res.json();
}
