type AccountSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function AccountSection({
  title,
  description,
  children,
}: AccountSectionProps) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">{title}</h2>

        {description && <p className="mt-2 text-white/60">{description}</p>}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 divide-y divide-white/10">
        {children}
      </div>
    </section>
  );
}
