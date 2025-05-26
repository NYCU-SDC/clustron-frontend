import LoginForm from "@/components/LoginForm";

export default function Login() {
  return (
    <div className="flex flex-col flex-1 items-center justify-evenly">
      <div className="text-5xl font-extrabold">Clustron</div>
      <div className="w-full max-w-lg">
        <LoginForm />
      </div>
      <div className="size-1"></div>
    </div>
  );
}
