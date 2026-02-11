// app/page.tsx
import { redirect } from "next/navigation";

export default function RootPage() {
  // Force la redirection vers la langue par défaut
  redirect("/fr");
}
