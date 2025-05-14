const Logo = () => {
  return (
    <a href="/" className="relative flex items-center justify-center">
      {" "}
      <img
        src="/Logo.png"
        className="w-25 absolute left-1 top-1 select-none cursor-pointer"
        width={100}
        draggable={false}
        height={100}
        alt="logo"
      />
    </a>
  );
};

export default Logo;
