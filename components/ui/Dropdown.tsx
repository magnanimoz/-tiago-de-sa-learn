"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type DropdownProps = {
  trigger: ReactNode;
  children: ReactNode;
  width?: string;
  align?: "left" | "right";
  className?: string;
};

type DropdownContextType = {
  close: () => void;
};

const DropdownContext = createContext<DropdownContextType | null>(null);

type DropdownItemProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};

function DropdownItem({
  children,
  onClick,
  className = "",
}: DropdownItemProps) {
  const dropdown = useContext(DropdownContext);

  return (
    <button
      type="button"
      onClick={() => {
        onClick?.();
        dropdown?.close();
      }}
      className={`
        flex w-full items-center justify-between
        px-4 py-3
        text-left
        transition-colors
        hover:bg-white/5
        ${className}
      `}
    >
      {children}
    </button>
  );
}

interface DropdownComponent {
  (props: DropdownProps): React.ReactElement;
  Item: typeof DropdownItem;
}

const Dropdown: DropdownComponent = function Dropdown({
  trigger,
  children,
  width = "w-44",
  align = "right",
  className = "",
}: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const contextValue: DropdownContextType = {
    close: () => setOpen(false),
  };

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setOpen]);

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen((value) => !value)}>{trigger}</div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{
              duration: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`
                absolute
                mt-3
                overflow-hidden
                rounded-xl
                border
                border-border
                bg-surface
                shadow-xl
                ${align === "right" ? "right-0" : "left-0"}
                ${width}
                ${className}
            `}
          >
            <DropdownContext.Provider value={contextValue}>
              {children}
            </DropdownContext.Provider>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

Dropdown.Item = DropdownItem;

export default Dropdown;
