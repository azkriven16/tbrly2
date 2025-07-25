import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="fixed inset-0 flex items-center justify-center bg-red-500">
      <SignUp />
    </section>
  );
}
