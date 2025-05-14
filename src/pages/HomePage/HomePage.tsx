const HomePage = () => {
  const userFromStorage = localStorage.getItem("user");
  const user = userFromStorage ? JSON.parse(userFromStorage) : null;
  return (
    <div className="flex flex-row h-full justify-center p-5">
      {user ? (
        <p>สวัสดี {user?.username} !</p>
      ) : (
        <p>Failed to fetch username</p>
      )}
    </div>
  );
};

export default HomePage;
