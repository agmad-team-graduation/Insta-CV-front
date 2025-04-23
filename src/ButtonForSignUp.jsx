import { FcGoogle } from "react-icons/fc"; // use Google's official look
import { Button } from "@/components/ui/button";

export function GoogleSignUpButton() {
  return (
    <Button
      className="w-90 justify-center gap-3 rounded-xl text-white hover:bg-[#4750a0] text-base font-medium shadow-sm"
      style={{ background: "#505ABB" }}
    >
      <FcGoogle className="w-5 h-5" />
      Sign up with your Google account
    </Button>
  );
}
