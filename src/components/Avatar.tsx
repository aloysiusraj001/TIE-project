import { forwardRef } from "react";
import { useApp } from "@/data/store";

export const Avatar = forwardRef<HTMLSpanElement, { userId: string; size?: number }>(
  ({ userId, size = 32 }, ref) => {
    const user = useApp((s) => s.users.find((u) => u.id === userId));
    if (!user) return null;
    const initials = user.name.split(" ").map((n) => n[0]).slice(0, 2).join("");
    return (
      <span
        ref={ref}
        className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-primary-foreground"
        style={{
          backgroundColor: `hsl(${user.avatarColor})`,
          width: size,
          height: size,
          fontSize: size * 0.38,
        }}
        title={user.name}
      >
        {initials}
      </span>
    );
  },
);
Avatar.displayName = "Avatar";
