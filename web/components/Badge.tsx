const variants = {
  default: "bg-zinc-800 text-zinc-300 border-zinc-700",
  violet: "bg-violet-950 text-violet-300 border-violet-800",
  blue: "bg-blue-950 text-blue-300 border-blue-800",
  green: "bg-green-950 text-green-300 border-green-800",
  amber: "bg-amber-950 text-amber-300 border-amber-800",
};

type BadgeVariant = keyof typeof variants;

export default function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
