// src/components/LoadingScreen.tsx
import { Icon } from "@iconify/react/dist/iconify.js";

const LoadingScreen = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center gap-2">
        <img
          src="./Logo.png"
          className="w-40 animate-pulse "
          width={100}
          alt=""
        />
        <div className="flex flex-col items-center justify-center gap-2">
          {" "}
          <Icon
            icon="mdi:loading"
            className="animate-spin"
            width="40"
            height="40"
          />
          <p>Loading..</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
