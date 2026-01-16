import db from "../models";
const getAllProducts = async (limit) => {
  try {
    let options = {
      include: [
        {
          model: db.ProductImage,
        },
      ]
    };

    if (limit) {
      options.limit = parseInt(limit);
    }

    const products = await db.Product.findAll(options);
    
    if (!products) {
      return {
        EM: "product not found",
        EC: "0",
        DT: [],
      };
    }
    return {
      EM: "Get list product success", 
      EC: "0",
      DT: products,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "error from service",
      EC: "-1", 
      DT: "",
    };
  }
};

const getProductById = async (id) => {
  try {
    const product = await db.Product.findByPk(id, {
      include: [
        {
          model: db.ProductImage,
        },
        {
          model: db.Category,
        },
      ],
    });
    if (!product) {
      return {
        EM: "product not found",
        EC: "0",
        DT: [],
      };
    }
    return {
      EM: "Get product success",
      EC: "0",
      DT: product,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "error from service",
      EC: "-1",
      DT: "",
    };
  }
};

export default { getAllProducts, getProductById };
