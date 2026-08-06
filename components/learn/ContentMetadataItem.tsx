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
    <div className="flex items-center gap-3 text-[13px] font-normal text-white/52">
      <div
        className="
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-full
          bg-white/[0.025]
          border
          border-white/[0.05]
        "
      >
        <Icon className="h-3.5 w-3.5 text-white/34" />
      </div>

      <span>{children}</span>
    </div>
  );
}
