import LoginModal from "../../components/LoginModal/LoginModal";
import Logo from "../../components/Logo/Logo";

const LoginPage = () => {
  return (
    <>
      <Logo />
      <section className="h-screen w-full flex items-center justify-center">
        <LoginModal />
      </section>
      <footer className="absolute bottom-0 left-0 w-full h-16 bg-gray-800 text-white flex items-center justify-center">
        <p className="text-sm">
          © 2025 OBOM GAUGE TECHNOLOGY CO., LTD All rights reserved.
        </p>
      </footer>
    </>
  );
};

export default LoginPage;
