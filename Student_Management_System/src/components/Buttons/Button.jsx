export default function Button({ children, variant = "primary", ...props }) {
  const variants = {
    primary: "bg-primary text-white",
    success: "bg-success text-white",
    danger: "bg-danger text-white",
    outline: "border border-primary text-primary bg-white",
  };
  return (
    <button
      className={`rounded px-4 py-2 font-medium transition hover:opacity-90 ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}