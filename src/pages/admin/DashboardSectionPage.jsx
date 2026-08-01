export default function DashboardSectionPage({ title, description, children }) {
  return (
    <main className="px-6 py-5">
      <div className="flex items-baseline gap-3">
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-6">
        {children}
      </div>
    </main>
  );
}
