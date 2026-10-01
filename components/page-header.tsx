export function PageHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return <header className="page-header"><h1 className="page-title">{title}</h1>{action}</header>;
}
