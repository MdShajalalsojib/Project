export default function InputField({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-slate-500">{label}</label>}
      <input className="border rounded px-3 py-2 w-full" {...props} />
    </div>
  );
}