"use client";

import * as React from "react";

type SwitchProps = {
    checked: boolean;
    onCheckedChange: (value: boolean) => void;
    id?: string;
    label?: string;
};

export function Switch({ checked, onCheckedChange, id, label }: SwitchProps) {
    return (
        <div className="flex items-center gap-2">
            <button
                id={id}
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onCheckedChange(!checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                    checked ? "bg-amber-500" : "bg-gray-300"
                }`}
            >
        <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                checked ? "translate-x-6" : "translate-x-1"
            }`}
        />
            </button>
            {label && <label htmlFor={id} className="text-sm">{label}</label>}
        </div>
    );
}
