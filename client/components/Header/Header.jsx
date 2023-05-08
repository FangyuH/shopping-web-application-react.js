import { React, useState } from "react";
import "./Header.css";
import SignIn from "../../components/Header/Signin/SignIn";
import Logout from "../../components/Header/Logout/Logout";
import Cart from "../Header/Cart/Cart";

function Header(props) {
  function getInitialPageStatus() {
    const token = localStorage.getItem("userToken");
    if (token !== "temporary") {
      return "logout";
    } else {
      return "signin";
    }
  }
  const [pageStatus, setPageStatus] = useState(getInitialPageStatus());
  return (
    <header>
      <div className="notes">
        <h3>Shopping</h3>
        <h6>website</h6>
      </div>
      <div className="search">
        <input className="searchbar" type="text" />
        <a href="#">
          <img
            id="search-img"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Vector_search_icon.svg/945px-Vector_search_icon.svg.png"
            alt=""
          />
        </a>
      </div>
      <div className="buttons">
        {pageStatus === "signin" ? (
          <SignIn
            setPageStatus={setPageStatus}
            setToken={props.setToken}
            setUserStatus={props.setUserStatus}
            setUserId={props.setUserId}
            temporary={props.temporary}
            tempCart={props.tempCart}
            setTempCart={props.setTempCart}
          />
        ) : (
          <Logout
            setPageStatus={setPageStatus}
            setToken={props.setToken}
            setUserStatus={props.setUserStatus}
            setUserId={props.setUserId}
            userStatus={props.userStatus}
            temporary={props.temporary}
            setTemprary={props.setTemprary}
            tempCart={props.tempCart}
            setTempCart={props.setTempCart}
          />
        )}
        <Cart
          setUserId={props.setUserId}
          userId={props.userId}
          setError={props.setError}
          tempCart={props.tempCart}
          setTempCart={props.setTempCart}
        />
      </div>
    </header>
  );
}

export default Header;
