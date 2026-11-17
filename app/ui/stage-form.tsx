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
        <form action={formAction}>
            <input type="hidden" name="id" value={id} />

            <label htmlFor={`stage-${id}`}>Stage</label>
            <select
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

            <button type="submit" disabled={pending}>
                {pending ? "Saving…" : "Update"}
            </button>

            <p aria-live="polite">{state.message}</p>
        </form>
    );
}