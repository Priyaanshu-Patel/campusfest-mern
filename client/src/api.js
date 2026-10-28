// Small helpers to talk to our Express backend

export async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Could not load data from the server');
  return res.json();
}

export async function postJSON(url, data) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || 'Something went wrong');
  return body;
}
