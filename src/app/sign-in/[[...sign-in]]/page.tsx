import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="screen-center">
      <SignIn />
    </div>
  );
}
