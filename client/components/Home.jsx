import { React, useState } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Main from "../components/Main/Main";
import "./Home.css";
import Error from "./Main/Error/Error";

function Home() {
  const [userStatus, setUserStatus] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("userToken"));
  const [userId, setUserId] = useState(localStorage.getItem("userToken"));
  const [error, setError] = useState(false);
  const [temporary, setTemprary] = useState(localStorage.getItem("userToken"));
  const [tempCart, setTempCart] = useState(localStorage.getItem("tempCart"));

  return (
    <div>
      <Header
        setToken={setToken}
        userStatus={userStatus}
        setUserStatus={setUserStatus}
        userId={userId}
        setUserId={setUserId}
        setError={setError}
        temporary={temporary}
        setTemprary={setTemprary}
        tempCart={tempCart}
        setTempCart={setTempCart}
      />

      {error === false ? (
        <Main
          userId={userId}
          setUserId={setUserId}
          userStatus={userStatus}
          setUserStatus={setUserStatus}
          temporary={temporary}
          tempCart={tempCart}
          setTempCart={setTempCart}
        />
      ) : (
        <Error error={error} setError={setError} />
      )}

      <Footer />
    </div>
  );
}

export default Home;
