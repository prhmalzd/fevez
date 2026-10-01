import { PageHeader } from "@/components/page-header";
import { SettingsView } from "@/components/settings-view";

export const metadata = { title: "Settings" };
export default function SettingsPage() { return <><PageHeader title="Settings" /><SettingsView /></>; }
