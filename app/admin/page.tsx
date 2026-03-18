import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AdminBeatForm } from "./AdminBeatForm";

export default function AdminPage() {
  const { userId } = auth();

  if (userId !== process.env.ADMIN_USER_ID) {
    redirect("/");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Add Beat</h1>
        <p className="text-sm text-gray-500 mt-1">Upload a new beat to the store.</p>
      </div>
      <div className="card-surface p-6">
        <AdminBeatForm />
      </div>
    </div>
  );
}
