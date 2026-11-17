"use client";

import { useActionState } from "react";
import { Stage } from "@/app/generated/prisma/enums";
import { changeApplicationStage, type StageFormState } from "@/app/lib/actions";

const initialState: StageFormState = { message: null };

type ApplicationStageFormProps = {
    id: number;
    stage: Stage;
};

export default function ApplicationStageForm({ id, stage }: ApplicationStageFormProps) {
    const [state, formAction, pending] = useActionState(
        changeApplicationStage,
        initialState,
    );

    return (
        <form action={formAction} className="mt-3">
            <input type="hidden" name="id" value={id} />

            <div className="flex items-center gap-2">
                <label htmlFor={`stage-${id}`}>Stage</label>
                <select
                    className="rounded-md border border-gray-500 px-2 py-1 text-sm"
                    key={stage}
                    id={`stage-${id}`}
                    name="stage"
                    defaultValue={stage}
                >
                    {Object.values(Stage).map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

                <button
                    type="submit"
                    disabled={pending}
                    className="rounded-md border border-gray-500 px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-60"
                >
                    {pending ? "Saving…" : "Update"}
                </button>
            </div>

            <p aria-live="polite" className="mt-1 text-sm text-red-700">{state.message}</p>
        </form>
    );
}