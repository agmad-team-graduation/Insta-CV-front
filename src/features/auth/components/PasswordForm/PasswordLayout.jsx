import Icon from "../../../../assets/images/Icon.png";
import backgroundImage from "../../../../assets/images/background.jpg";

export function PasswordLayout({ children }) {
  return (
    <div className="h-screen w-screen m-0 p-0 overflow-hidden">
      <div
        className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-8 md:p-12 flex flex-col items-center">
          <div className="flex flex-col items-center mb-6">
            <img
              src={Icon}
              alt="Logo"
              className="bg-white w-10 h-10 mb-2"
            />
            <h2 className="text-center text-lg font-semibold text-gray-700">
              Unlimited free access to our resources
            </h2>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 