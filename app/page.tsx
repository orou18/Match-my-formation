import { redirect } from "next/navigation";

export default function RootPage() {
  // langue par défaut
  redirect("/fr");
}
