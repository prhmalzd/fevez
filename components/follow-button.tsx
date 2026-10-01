"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function FollowButton({ initial = false, username }: { initial?: boolean; username?: string }) {
  const router = useRouter();
  const [following, setFollowing] = useState(initial);
  async function toggle() {
    const previous = following;
    setFollowing(!previous);
    if (!username) return;
    try {
      const response = await fetch("/api/social/follow", { method: previous ? "DELETE" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username }) });
      if (response.status === 401) { router.push(`/auth/sign-in?next=/u/${username}`); return; }
      if (!response.ok) throw new Error("Follow failed");
    } catch { setFollowing(previous); }
  }
  return <button aria-pressed={following} onClick={toggle} className={following ? "secondary-button" : "primary-button"}>{following ? "Following" : "Follow"}</button>;
}
