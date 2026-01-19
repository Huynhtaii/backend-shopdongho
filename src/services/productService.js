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
const getProductByCategories = async (name) => {
  try {
    const products = await db.Product.findAll({
      include: [
        {
          model: db.ProductImage,
        },
        {
          model: db.Category,
          where: { name: name },
          through: { attributes: [] }
        }
      ],
      limit: 10,
      order: [["created_at", "DESC"]],
    });
    if (!products) {
      return {
        EM: "product not found",
        EC: "0",
        DT: [],
      };
    }
    return {
      EM: "Get product by categories success",
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

const getResentProducts = async (arrId) => {
  try {
    const products = await db.Product.findAll({
      include: [
        {
          model: db.ProductImage,
        },
        {
          model: db.Category,
        }
      ],
    });

    const recentProduct = products.filter((product) => {
      return arrId.includes(product.product_id + '')
    })

    if (!recentProduct) {
      return {
        EM: "product not found",
        EC: "0",
        DT: [],
      };
    }
    return {
      EM: "Get product by categories success",
      EC: "0",
      DT: recentProduct,
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

const getProductByCategoriesWithPaginate = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;

    const { rows, count } = await db.Product.findAndCountAll({
      include: [
        {
          model: db.Category
        }
      ],
      limit: limit,
      offset: offset,
    })
    return {
      EM: "Get all product successfully",
      EC: 0,
      DT: {
        totalRows: count,  //tổng số sản phẩm hiện tại trong db
        totalPages: Math.ceil(count / limit),  //tính toán số nút trang 
        product: rows,    //toàn bộ sản phẩm
      },
    };
  } catch (error) {
    return {
      EM: "error from service",
      EC: "-1",
      DT: "",
    }
  }
}
export default { getAllProducts, getProductById, getProductByCategories, getProductByCategoriesWithPaginate, getResentProducts };
