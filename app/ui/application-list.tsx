import ApplicationStageForm from "./stage-form";
import { listApplications } from "@/app/lib/applications";

export async function ApplicationList() {
    const applications = await listApplications();

    if (applications.length === 0) {
        return <p>No applications yet.</p>;
    }

    return (
        <ul>
            {applications.map((application) => (
                <li key={application.id}>
                    {application.title}, by {application.company}
                    <ApplicationStageForm id={application.id} stage={application.stage} />
                </li>
            ))}
        </ul>
    );
}