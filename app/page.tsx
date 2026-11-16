import { Suspense } from "react";
import { ApplicationList } from "./ui/application-list";
import ApplicationForm from "./ui/application-form";

export default function Home() {
  return (
    <main>
      <h1>Application list</h1>
      <ApplicationForm />
      <Suspense fallback={<p>Loading the list…</p>}>
        <ApplicationList />
      </Suspense>
    </main>
  );
}
