interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="text-center mb-10">
      <h1 className="text-4xl font-bold text-gray-800">
        {title}
      </h1>

      <p className="mt-3 text-gray-500 text-lg">
        {subtitle}
      </p>
    </div>
  );
}