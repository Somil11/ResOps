import ModuleList from "../components/NodeCard";
import CreateModuleForm from "../components/CreateModuleForm";
import ModuleCard from "../components/ModuleCard";
export default function ModulesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Modules Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="md:col-span-3">
          <ModuleCard />
        </div>
        <div>
          <CreateModuleForm />
        </div>
      </div>
    </div>
  );
}
