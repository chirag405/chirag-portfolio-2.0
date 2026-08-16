import { resumeJson } from "@/lib/data/portfolio";

export function downloadResume() {
  const blob = new Blob([resumeJson()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "chirag-singh.resume.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
