import CenteredForm from "@/app/components/CenteredForm";
import { ReactNode } from "react";

export default function ModuleLayout({ 
  children,
  params 
}: { 
  children: ReactNode;
  params: { slug: string };
}) {
  return <CenteredForm />;
}