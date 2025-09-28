export async function getTemplate(id: number) {
  const res = await fetch(`/api/template/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch template");
  }
  return res.json();
}

export async function getSpec(id: number) {
  const res = await fetch(`/api/spec/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch template");
  }
  return res.json();
}
