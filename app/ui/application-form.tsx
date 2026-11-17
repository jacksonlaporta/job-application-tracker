"use client";

import { useActionState } from "react";
import { createApplication, type ApplicationFormState } from "@/app/lib/actions";

const initialState: ApplicationFormState = {
    errors: {},
    message: null,
    values: { title: "", company: "", url: "" },
};
const labelClass = "block text-sm";
const inputClass =
    "mt-1 block w-full rounded-md border border-gray-500 px-3 py-2";
const errorClass = "mt-1 text-sm text-red-700";

export default function ApplicationForm() {
    const [state, formAction, pending] = useActionState(createApplication, initialState);

    return (
        <form action={formAction}
            className="space-y-4 rounded-lg border border-gray-300 p-4"
        >
            <div>
                <label htmlFor="title" className={labelClass}>Job Title</label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    defaultValue={state.values.title}
                    className={inputClass}
                />
                {state.errors.title && <p className={errorClass}>{state.errors.title}</p>}
            </div>

            <div>
                <label htmlFor="company" className={labelClass}>Company Name</label>
                <input
                    id="company"
                    name="company"
                    type="text"
                    defaultValue={state.values.company}
                    className={inputClass}
                />
                {state.errors.company && <p className={errorClass}>{state.errors.company}</p>}
            </div>

            <div>
                <label htmlFor="url" className={labelClass}>URL (optional)</label>
                <input
                    id="url"
                    name="url"
                    type="text"
                    defaultValue={state.values.url}
                    className={inputClass}
                />
                {state.errors.url && <p className={errorClass}>{state.errors.url}</p>}
            </div>

            <p aria-live="polite">{state.message}</p>

            <button
                type="submit"
                disabled={pending}
                className="rounded-md bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 disabled:opacity-60"
            >
                {pending ? "Saving…" : "Add application"}
            </button>
        </form>
    );
}