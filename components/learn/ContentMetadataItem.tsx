import type { LucideIcon } from "lucide-react";

type ContentMetadataItemProps = {
  icon: LucideIcon;
  children: React.ReactNode;
};

export default function ContentMetadataItem({
  icon: Icon,
  children,
}: ContentMetadataItemProps) {
  return (
    <div className="flex items-center gap-2.5 text-[13px] font-light text-white/45">
      <Icon className="h-4 w-4 shrink-0 text-white/30" />
      <span>{children}</span>
    </div>
  );
}
