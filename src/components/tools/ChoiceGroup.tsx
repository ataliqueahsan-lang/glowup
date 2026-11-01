"use client";

type Choice = { id: string; label: string; hint?: string };

/** Accessible single-choice control (native radio inputs, styled as pills or a list). */
export default function ChoiceGroup({
  legend,
  name,
  options,
  value,
  onChange,
  layout = "pills",
  disabled = false,
}: {
  legend: string;
  name: string;
  options: readonly Choice[];
  value: string;
  onChange: (id: string) => void;
  layout?: "pills" | "list";
  disabled?: boolean;
}) {
  return (
    <fieldset className="choice" disabled={disabled}>
      <legend className="eyebrow">{legend}</legend>
      <div className={layout === "list" ? "choice-list" : "choice-pills"}>
        {options.map((o) => (
          <label key={o.id} className="choice-item">
            <input
              type="radio"
              name={name}
              value={o.id}
              checked={value === o.id}
              onChange={() => onChange(o.id)}
              className="sr-only"
            />
            {o.label}
            {o.hint ? <small>{o.hint}</small> : null}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
