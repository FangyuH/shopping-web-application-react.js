var createError = require("http-errors");
var express = require("express");
const bodyParser = require("body-parser");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
//const bcrypt = require("bcrypt");
//const jwt = require("jsonwebtoken");
const { randomBytes } = require("node:crypto");

//connect to database
const connectToMongoose = require("./database/connect");
const userModel = require("./database/model");
const productModel = require("./database/productModel");
const cartModel = require("./database/cartModel");
connectToMongoose();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.options("*", cors()); // include before other routes

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use(bodyParser.json());
//app.use(cors());

//Signup api
app.post("/signup", async (req, res) => {
  const { email, password, userSelector } = req.body;
  // Validate email and password
  if (!email || !password || !userSelector) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Create a new user account
  try {
    // Check whether the user is already existed
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User alreay existed!" });
    }

    const newUser = new userModel({ email, password, userSelector });
    await newUser.save();
    return res.status(200).json({ message: "Acount created successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

//signin api
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email." });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid password." });
    }

    //generate JSON Web Token for user
    //const token = randomBytes(256).toString("hex");
    //send token to the client
    res.status(200).json({ token: user._id, userSelector: user.userSelector });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

//get userStatus
app.get("/getuserStatus/:userId", async (req, res) => {
  const userId = req.params.userId;
  const userStatus = await userModel.findOne(
    { _id: userId },
    {
      userSelector: 1,
    }
  );
  if (!userStatus) {
    return res.status(404).json({ error: "Product not found!" });
  }
  res.json(userStatus);
});

//log out api
app.post("/logout", (req, res) => {
  //isLoggedIn = false;
  res.status(200).json({ message: "Logged out successfully" });
});

//add product api
app.post("/addproduct", async (req, res) => {
  const {
    productName,
    productDescription,
    categorySelector,
    price,
    inStock,
    imageURL,
  } = req.body;

  if (
    !productName ||
    !productDescription ||
    !categorySelector ||
    !price ||
    !inStock ||
    !imageURL
  ) {
    return res.status(400).json({ message: "Information is required" });
  }

  try {
    const newProduct = new productModel({
      productName,
      productDescription,
      categorySelector,
      price,
      inStock,
      imageURL,
    });
    await newProduct.save();
    return res.status(200).json({ message: "Product created successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

//list product api
app.get("/listproduct", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 8;
  const rankSelector = req.query.rankSelector || "last-add";

  try {
    const productsCount = await productModel.countDocuments();
    const totalPages = Math.ceil(productsCount / perPage);

    let sortQuery = { createdAt: -1 };
    if (rankSelector === "price-l-h") {
      sortQuery = { price: 1 };
    } else if (rankSelector === "price-h-l") {
      sortQuery = { price: -1 };
    } else {
      sortQuery = { createdAt: -1 };
    }

    const products = await productModel
      .find({}, { imageURL: 1, productName: 1, price: 1, _id: 1 })
      .sort(sortQuery)
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.json({ products, totalPages, currentPage: page });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//show detail api
app.get("/showdetail/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const products = await productModel.findOne(
      { _id: productId },
      {
        imageURL: 1,
        productName: 1,
        productDescription: 1,
        categorySelector: 1,
        price: 1,
        inStock: 1,
        _id: 0,
      }
    );
    if (!products) {
      return res.status(404).json({ error: "Product not found!" });
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//edit product api
app.put("/editproduct/:productId", async (req, res) => {
  const {
    productName,
    productDescription,
    categorySelector,
    price,
    inStock,
    imageURL,
  } = req.body;
  console.log(req.body);
  // Validate request body
  if (
    !productName ||
    !productDescription ||
    !categorySelector ||
    !price ||
    !inStock ||
    !imageURL
  ) {
    return res.status(400).json({ message: "Information is required" });
  }

  try {
    const productId = req.params.id;
    const product = await productModel.findOne({ productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product information
    product.productName = productName;
    product.productDescription = productDescription;
    product.categorySelector = categorySelector;
    product.price = price;
    product.inStock = inStock;
    product.imageURL = imageURL;

    await product.save();

    return res.status(200).json({ message: "Product updated successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

//updatecart api
app.put("/updatecart", async (req, res) => {
  const { userId, productId, productName, price, quantity, imageURL } =
    req.body;
  if (
    !userId ||
    !productId ||
    !quantity ||
    !price ||
    !productName ||
    !imageURL
  ) {
    return res.status(400).json({ message: "Invalid information!" });
  }
  try {
    let userCart = await cartModel.findOne({ userId });

    if (!userCart) {
      userCart = new cartModel({
        userId,
        items: [{ productId, productName, price, quantity, imageURL }],
      });
      await userCart.save();
      return res
        .status(200)
        .json({ message: "New cart created and item added successfully!" });
    } else {
      for (let i = 0; i < userCart.items.length; i++) {
        if (userCart.items[i].productId === productId) {
          userCart.items[i].quantity = quantity;
          await userCart.save();
          return res
            .status(200)
            .json({ message: "Cart updated successfully!" });
        }
      }
      userCart.items.push({
        productId,
        productName,
        price,
        quantity,
        imageURL,
      });
      await userCart.save();
      return res
        .status(200)
        .json({ message: "New item added to cart successfully!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

//listcart api
app.get("/listcart/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const cartInfo = await cartModel.findOne(
      { userId: userId },
      {
        items: 1,
        _id: 0,
      }
    );
    if (!cartInfo) {
      return res.status(404).json({ error: "Cart not found!" });
    }
    res.json(cartInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//listcart detail api
app.get("/listquantitydetail/:userId/:productId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;
    const cartInfo = await cartModel.findOne(
      { userId: userId, "items.productId": productId },
      {
        "items.$": 1,
        _id: 0,
      }
    );
    if (!cartInfo) {
      return res.status(404).json({ error: "Cart not found!" });
    }
    const item = cartInfo.items[0];
    res.json({ productId: item.productId, quantity: item.quantity });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

//deletecart api
app.delete("/deletecart/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;
  try {
    const user = await cartModel.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // find the index of the product to delete
    const productIndex = user.items.findIndex(
      (item) => item.productId === productId
    );
    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    // remove the product from the items array
    user.items.splice(productIndex, 1);
    await user.save();
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

//deletetempcart api
app.delete("/deletetempcart/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await cartModel.deleteMany({ userId: userId });
    return res
      .status(200)
      .json({ message: "Temporary cart delete successfully!" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
