import { Suspense } from "react";
import { ApplicationList } from "./ui/application-list";

export default function Home() {
  return (
    <main>
      <h1>Application list</h1>
      <Suspense fallback={<p>Loading the list…</p>}>
        <ApplicationList />
      </Suspense>
    </main>
  );
}
