import { FcGoogle } from "react-icons/fc"; // use Google's official look
import { Button } from "@/components/ui/button";

export function GoogleSignUpButton() {
  return (
    <Button
      variant="outline"
      className="w-90 justify-center gap-3 rounded-xl border-gray-300 text-gray-800 hover:bg-gray-100 text-base font-medium shadow-sm"
    >
      <FcGoogle className="w-5 h-5" />
      Sign up with your Google account
    </Button>
  );
}
