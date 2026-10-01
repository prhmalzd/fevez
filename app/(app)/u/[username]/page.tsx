import { notFound } from "next/navigation";
import { ProfileView } from "@/components/profile-view";
import { currentUser, people } from "@/lib/demo-data";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const person = [currentUser, ...people].find((entry) => entry.username === username);
  return { title: person?.name ?? "Profile", description: person?.bio };
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const person = [currentUser, ...people].find((entry) => entry.username === username);
  if (!person) notFound();
  return <ProfileView person={person} />;
}
