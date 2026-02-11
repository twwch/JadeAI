'use client';

interface FieldWrapperProps {
  children: React.ReactNode;
  columns?: number;
}

export function FieldWrapper({ children, columns = 2 }: FieldWrapperProps) {
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {children}
    </div>
  );
}
