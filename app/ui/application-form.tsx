"use client";

import { useActionState } from "react";
import { createApplication, type ApplicationFormState } from "@/app/lib/actions";

const initialState: ApplicationFormState = {
    errors: {},
    message: null,
    values: { title: "", company: "", url: "" },
};

export default function ApplicationForm() {
    const [state, formAction, pending] = useActionState(createApplication, initialState);

    return (
        <form action={formAction}>
            <div>
                <label htmlFor="title">Job Title</label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    defaultValue={state.values.title}
                />
                {state.errors.title && <p>{state.errors.title}</p>}
            </div>

            <div>
                <label htmlFor="company">Company Name</label>
                <input
                    id="company"
                    name="company"
                    type="text"
                    defaultValue={state.values.company}
                />
                {state.errors.company && <p>{state.errors.company}</p>}
            </div>

            <div>
                <label htmlFor="url">URL (optional)</label>
                <input
                    id="url"
                    name="url"
                    type="text"
                    defaultValue={state.values.url}
                />
                {state.errors.url && <p>{state.errors.url}</p>}
            </div>

            <p aria-live="polite">{state.message}</p>

            <button type="submit" disabled={pending}>
                {pending ? "Saving…" : "Add application"}
            </button>
        </form>
    );
}