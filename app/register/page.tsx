import AuthShell from "@/components/AuthShell";
import RegisterForm from "@/components/RegisterForm";

export const metadata = { title: "Create Store Account — SmartBiz" };

export default function RegisterPage() {
  return (
    <AuthShell maxWidth={440}>
      <RegisterForm />
    </AuthShell>
  );
}
