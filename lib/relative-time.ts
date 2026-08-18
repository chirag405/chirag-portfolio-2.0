export function relativeTime(iso: string | number): string {
  const ms = Date.now() - (typeof iso === "number" ? iso : new Date(iso).getTime());
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
