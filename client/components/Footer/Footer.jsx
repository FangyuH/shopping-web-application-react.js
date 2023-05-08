import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer>
      <small id="notes-1">© 2023 All Rights Reserved.</small>
      <div className="img-container">
        <img
          className="media-img"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxyEi3DyUYdcPGEAje1AUBh3X8iJDg7FTfww&usqp=CAU"
          alt=""
        />
        <img
          className="media-img"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStxUBmDaJWVduo9TRWajgO7_DyZ3IJXEWWsA&usqp=CAU"
          alt=""
        />
        <img
          id="facebook-img"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNiFLPvJC-OqDZu9r2QvNvGUUqrQ6vc3L2rw&usqp=CAU"
          alt=""
        />
      </div>
      <div className="notes-2">
        <small>Contact us</small>
        <small>Privacy policies</small>
        <small>Help</small>
      </div>
    </footer>
  );
}

export default Footer;
