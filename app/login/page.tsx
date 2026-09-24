import AuthShell from "@/components/AuthShell";
import LoginForm from "@/components/LoginForm";

export const metadata = { title: "Log In — SmartBiz" };

export default function LoginPage() {
  return (
    <AuthShell maxWidth={420}>
      <LoginForm />
    </AuthShell>
  );
}
