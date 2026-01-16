"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Insert Roles
    await queryInterface.bulkInsert(
      "roles",
      [
        { role_id: 1, name: "Admin", description: "Quản trị hệ thống" },
        { role_id: 2, name: "Customer", description: "Khách hàng mua hàng" },
      ],
      {}
    );

    // 2. Insert Categories
    await queryInterface.bulkInsert(
      "categories",
      [
        { category_id: 1, name: "Đồng hồ nam", description: "Danh mục đồng hồ nam cao cấp" },
        { category_id: 2, name: "Đồng hồ nữ", description: "Danh mục đồng hồ nữ thời trang" },
      ],
      {}
    );

    // 3. Insert Products (Cập nhật sản phẩm thành sản phẩm đồng hồ)
    await queryInterface.bulkInsert(
      "products",
      [
        {
          product_id: 101,
          name: "Đồng hồ Casio G-Shock",
          description: "Đồng hồ bền bỉ, phong cách thể thao",
          price: 300.0,
          discount_price: 280.0,
          rating: 5,
          created_at: new Date(),
          brand_id: 1,
          sku: "CGS-101",
        },
        {
          product_id: 102,
          name: "Đồng hồ Citizen Eco-Drive",
          description: "Đồng hồ Citizen với công nghệ Eco-Drive, không cần thay pin",
          price: 500.0,
          discount_price: 450.0,
          rating: 4,
          created_at: new Date(),
          brand_id: 2,
          sku: "CIT-102",
        },
        {
          product_id: 103,
          name: "Đồng hồ Fossil",
          description: "Đồng hồ Fossil thiết kế hiện đại, chất lượng tốt",
          price: 250.0,
          discount_price: null,
          rating: 4,
          created_at: new Date(),
          brand_id: 3,
          sku: "FOS-103",
        },
      ],
      {}
    );

    // 4. Insert CategoriesHasProducts (quan hệ many-to-many)
    await queryInterface.bulkInsert(
      "categories_has_products",
      [
        { categories_category_id: 1, products_product_id: 101 },
        { categories_category_id: 1, products_product_id: 102 },
        { categories_category_id: 2, products_product_id: 103 },
      ],
      {}
    );

    // 5. Insert ProductImages (Giữ nguyên URL hình ảnh mẫu hoặc thay đổi URL đồng hồ)
    await queryInterface.bulkInsert(
      "product_images",
      [
        {
          product_image_id: 1,
          url: "http://localhost:6969/uploads/product/product1.png", // URL mẫu
          product_id: 101,
        },
        {
          product_image_id: 2,
          url: "http://localhost:6969/uploads/product/product2.png", // URL mẫu
          product_id: 102,
        },
        {
          product_image_id: 3,
          url: "http://localhost:6969/uploads/product/product3.png", // URL mẫu
          product_id: 103,
        },
      ],
      {}
    );

    // 6. Insert Users (có thể giữ nguyên nếu không cần thay đổi)
    await queryInterface.bulkInsert(
      "users",
      [
        {
          user_id: 1,
          name: "Nguyễn Văn A",
          email: "a@email.com",
          password: "hash12345",
          phone: "0123456789",
          address: "Hà Nội, Việt Nam",
          created_at: new Date(),
          role_id: 2,
        },
        {
          user_id: 2,
          name: "Trần Thị B",
          email: "b@email.com",
          password: "hash54321",
          phone: "0987654321",
          address: "TP. Hồ Chí Minh",
          created_at: new Date(),
          role_id: 1,
        },
      ],
      {}
    );

    // 7. Insert Cart
    await queryInterface.bulkInsert(
      "cart",
      [
        {
          cart_id: 2001,
          created_at: new Date(),
          updated_at: new Date(),
          user_id: 1,
        },
      ],
      {}
    );

    // 8. Insert CartItems
    await queryInterface.bulkInsert(
      "cart_items",
      [
        {
          cart_item_id: 1,
          quantity: 1,
          created_at: new Date(),
          cart_id: 2001,
          product_id: 101,
        },
        {
          cart_item_id: 2,
          quantity: 1,
          created_at: new Date(),
          cart_id: 2001,
          product_id: 102,
        },
      ],
      {}
    );

    // 9. Insert Orders
    await queryInterface.bulkInsert(
      "orders",
      [
        {
          order_id: 1001,
          order_date: new Date(),
          status: "Completed",
          total_amount: 280.0,
          user_id: 1,
          discount_id: null,
        },
        {
          order_id: 1002,
          order_date: new Date(),
          status: "Pending",
          total_amount: 250.0,
          user_id: 2,
          discount_id: null,
        },
      ],
      {}
    );

    // 10. Insert OrderItems
    await queryInterface.bulkInsert(
      "order_items",
      [
        {
          order_item_id: 1,
          quantity: 1,
          price: 280.0,
          order_id: 1001,
          product_id: 101,
        },
        {
          order_item_id: 2,
          quantity: 1,
          price: 250.0,
          order_id: 1002,
          product_id: 103,
        },
      ],
      {}
    );

    // 11. Insert Payments
    await queryInterface.bulkInsert(
      "payments",
      [
        {
          payment_id: 5001,
          payment_date: new Date(),
          amount: 280.0,
          payment_method: "Credit Card",
          status: "Success",
          order_id: 1001,
        },
        {
          payment_id: 5002,
          payment_date: null, // chưa thanh toán
          amount: 250.0,
          payment_method: "Bank Transfer",
          status: "Pending",
          order_id: 1002,
        },
      ],
      {}
    );

    // 12. Insert Feedbacks
    await queryInterface.bulkInsert(
      "feedbacks",
      [
        {
          feedback_id: 1,
          rating: 5,
          comments: "Sản phẩm rất tốt!",
          created_at: new Date(),
          is_resolved: 1,
          product_id: 101,
          user_id: 1,
          order_id: 1001,
        },
        {
          feedback_id: 2,
          rating: 4,
          comments: "Sản phẩm ổn nhưng giao chậm",
          created_at: new Date(),
          is_resolved: 0,
          product_id: 103,
          user_id: 2,
          order_id: 1002,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Xóa dữ liệu theo thứ tự phụ thuộc ngược lại
    await queryInterface.bulkDelete("feedbacks", null, {});
    await queryInterface.bulkDelete("payments", null, {});
    await queryInterface.bulkDelete("order_items", null, {});
    await queryInterface.bulkDelete("orders", null, {});
    await queryInterface.bulkDelete("cart_items", null, {});
    await queryInterface.bulkDelete("cart", null, {});
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("product_images", null, {});
    await queryInterface.bulkDelete("categories_has_products", null, {});
    await queryInterface.bulkDelete("products", null, {});
    await queryInterface.bulkDelete("categories", null, {});
    await queryInterface.bulkDelete("roles", null, {});
  },
};
