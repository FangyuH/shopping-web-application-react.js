const signupApi = async (email, password, userSelector) => {
  const response = await fetch(`http://localhost:3007/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, userSelector }),
  });
  return response;
};

const signinApi = async (email, password) => {
  const response = await fetch(`http://localhost:3007/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return response;
};

const logoutApi = async (token) => {
  const response = await fetch(`http://localhost:3007/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

const addProductApi = async (
  productName,
  productDescription,
  categorySelector,
  price,
  inStock,
  imageURL
) => {
  const response = await fetch(`http://localhost:3007/addproduct`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productName,
      productDescription,
      categorySelector,
      price,
      inStock,
      imageURL,
    }),
  });
  return response;
};

const updateCartApi = async (
  userId,
  productId,
  productName,
  price,
  quantity,
  imageURL
) => {
  const response = await fetch("http://localhost:3007/updatecart", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      productId,
      productName,
      price,
      quantity,
      imageURL,
    }),
  });
  return response;
};

async function mergeTempAndUser(userId) {
  try {
    const tempItems = JSON.parse(localStorage.getItem("tempCart")) || [];
    let items;
    const res2 = await fetch(`http://localhost:3007/listcart/${userId}`);
    const userData = await res2.json();
    const userItems = userData.items ? userData.items : [];
    const mergedItems = [...tempItems, ...userItems];
    items = mergedItems.reduce((acc, curr) => {
      const existingItem = acc.find(
        (item) => item.productId === curr.productId
      );
      if (existingItem) {
        existingItem.quantity += curr.quantity;
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);
    console.log(items);
    for (let i = 0; i < items.length; i++) {
      try {
        const res = await updateCartApi(
          userId,
          items[i].productId,
          items[i].productName,
          items[i].price,
          items[i].quantity,
          items[i].imageURL
        );
      } catch (error) {
        console.error(error);
      }
    }
    localStorage.removeItem("tempCart");
  } catch (error) {
    console.error(error);
  }
}

function generateRandomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

export default {
  signupApi,
  signinApi,
  logoutApi,
  addProductApi,
  updateCartApi,
  mergeTempAndUser,
  generateRandomString,
};
