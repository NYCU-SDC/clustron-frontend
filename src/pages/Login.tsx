import LoginForm from "@/components/LoginForm";

export default function Login() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="text-5xl font-extrabold">Clustron</div>

      <LoginForm />
    </div>
  );
}
