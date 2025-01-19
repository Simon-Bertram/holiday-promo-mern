import { RegistrationForm } from "./RegistrationForm";

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center mx-auto max-w-2xl py-10 mt-12 border-2 border-blue-500">
      <h1>The Best Holiday Promotions</h1>
      <RegistrationForm />
    </div>
  );
}
