import React from "react";
import clsx from "clsx";

export default function Input({ label, error, className, id, ...props }) {
  const inputId = id || props.name;
  return (
    <label className="block" htmlFor={inputId}>
      {label && <span className="mb-1.5 block text-sm font-medium text-brand-text/80">{label}</span>}
      <input
        id={inputId}
        className={clsx(
          "w-full rounded-lg border border-brand-text/15 bg-white px-3.5 py-2.5 text-sm text-brand-text placeholder:text-brand-text/35",
          "transition-colors duration-150 focus:border-brand-accent",
          error && "border-red-400",
          className
        )}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}
