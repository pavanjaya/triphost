export default function SectionHeader({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#475569] mb-2 px-4">
      {label}
    </p>
  );
}
