export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-screen overflow-hidden bg-zinc-50">{children}</div>;
}
