import LoginForm from "@/components/LoginForm";
import Navbar from "@/components/Navbar";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-col flex-1 items-center justify-evenly">
        <div className="text-5xl font-extrabold">Clustron</div>
        <div className="w-full max-w-lg">
          <LoginForm />
        </div>
        <div className="size-1"></div>
      </div>
    </div>
  );
}
