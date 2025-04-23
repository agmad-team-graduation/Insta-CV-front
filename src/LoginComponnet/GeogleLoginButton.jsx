import { FcGoogle } from "react-icons/fc"; // use Google's official look
import { Button } from "@/components/ui/button";

export function GoogleLoginButton() {
  return (
    <Button
      variant="outline"
      className="w-70 pt-4 pb-4 justify-center gap-2 rounded-3xl border-gray-300 text-gray-800 hover:bg-gray-100 text-sm font-medium shadow-sm px-4 py-2"
    >
      <FcGoogle className="w-4 h-4" />
      Continue with Google
    </Button>
  );
}
