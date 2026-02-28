"use client";

interface Props {
  variant?: "default" | "dark";
}

export function MenuFooter({ variant = "default" }: Props) {
  const isDark = variant === "dark";

  return (
    <footer
      className={`border-t px-4 py-4 text-center ${
        isDark
          ? "border-white/10 bg-zinc-950"
          : "border-border/40"
      }`}
    >
      <p
        className={`text-[10px] ${
          isDark ? "text-zinc-500" : "text-muted-foreground"
        }`}
      >
        Powered by{" "}
        <a
          href="/"
          className={`font-medium hover:underline ${
            isDark ? "text-amber-400" : "text-primary"
          }`}
        >
          QR Menü
        </a>
      </p>
    </footer>
  );
}
