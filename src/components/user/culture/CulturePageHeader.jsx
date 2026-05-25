export default function CulturePageHeader({
  eyebrow,
  icon: Icon,
  title,
  description,
}) {
  return (
    <header className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 flex items-center gap-1.5">
        {Icon && <Icon size={14} />}
        {eyebrow}
      </p>
      <h1
        className="mt-2 text-3xl font-semibold text-stone-900 sm:text-4xl"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {title}
      </h1>
      <p className="mt-3 text-sm leading-6 text-stone-500 max-w-2xl">
        {description}
      </p>
    </header>
  );
}
