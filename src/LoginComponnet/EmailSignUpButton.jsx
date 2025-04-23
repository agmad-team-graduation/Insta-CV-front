import { MdEmail } from "react-icons/md"; // email icon
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function EmailSignupButton() {
      const navigate = useNavigate();

  return (
    <Button 
      variant="outline"
      className=" w-70 pt-4 pb-4 justify-center gap-2 rounded-3xl border-gray-300 text-gray-800 hover:bg-gray-100 text-sm font-medium shadow-sm px-4 py-2"
      onClick={() => navigate("/signup")} 

    >
      <MdEmail className="w-4 h-4 shrink-0 align-middle" />
      Sign up with Email
    </Button>
  );
}
