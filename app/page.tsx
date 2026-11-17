import { Suspense } from "react";
import { ApplicationList } from "./ui/application-list";
import ApplicationForm from "./ui/application-form";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 p-6">
      <h1 className="text-2xl font-bold">Job Application Tracker</h1>

      <ApplicationForm />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Applications</h2>

        <Suspense fallback={<p className="text-green-700">Loading applications…</p>}>
          <ApplicationList />
        </Suspense>
      </section>
    </main>
  );
}
