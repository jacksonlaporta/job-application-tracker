import ApplicationStageForm from "./stage-form";
import { listApplications } from "@/app/lib/applications";

export async function ApplicationList() {
    const applications = await listApplications();

    if (applications.length === 0) {
        return (
            <p className="text-gray-700">
                No applications yet. Add the first one with the form above.
            </p>
        );
    }

    return (
        <ul className="space-y-3">
            {applications.map((application) => (
                <li key={application.id} className="rounded-lg border border-gray-300 p-4">
                    <p className="font-semibold">{application.title}</p>
                    <p className="text-sm text-green-500">{application.company}</p>
                    <ApplicationStageForm id={application.id} stage={application.stage} />
                </li>
            ))}
        </ul>
    );
}