"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Insert Roles (giữ nguyên)
    await queryInterface.bulkInsert(
      "roles",
      [
        { role_id: 1, name: "Admin", description: "Quản trị hệ thống" },
        { role_id: 2, name: "Customer", description: "Khách hàng mua hàng" },
      ],
      {}
    );

    // 2. Insert Categories (bao gồm cả loại cũ và loại mới)
    await queryInterface.bulkInsert(
      "categories",
      [
        {
          category_id: 1,
          name: "Đồng hồ nam",
          description: "Danh mục đồng hồ nam cao cấp",
          image:
            "https://www.watchstore.vn/images/collections_home/2024/09/06/resized/small-web-banner-casio-mtp_1725589299.webp",
        },
        {
          category_id: 2,
          name: "Đồng hồ nữ",
          description: "Danh mục đồng hồ nữ thời trang",
          image:
            "https://www.watchstore.vn/images/collections_home/2024/09/06/resized/small-web-banner-casio-ltp_1725589299.webp",
        },
        {
          category_id: 3,
          name: "Xu hướng 2025",
          description: "Bộ sưu tập Xu hướng 2025",
          image:
            "https://www.watchstore.vn/images/collections_home/2024/09/06/resized/small-web-banner-xu-huong-2024_1725589299.webp",
        },
        {
          category_id: 4,
          name: "Cao cấp",
          description: "Bộ sưu tập đồng hồ cao cấp",
          image:
            "https://www.watchstore.vn/images/collections_home/2024/09/06/resized/small-web-banner-tissot_1725589299.webp",
        },
        {
          category_id: 5,
          name: "Nổi bật",
          description: "Bộ sưu tập đồng hồ nổi bật",
          image:
            "https://www.watchstore.vn/images/collections_home/2024/09/06/resized/small-web-banner-giong-rolex_1725589710.webp",
        },
        {
          category_id: 6,
          name: "Treo tường",
          description: "Bộ sưu tập đồng hồ treo tường",
          image:
            "https://www.watchstore.vn/images/products/2024/resized/thiet-ke-chua-co-ten-48-1128295870-41019441-1712499500.webp",
        },
      ],
      {}
    );

    // 3. Insert Products
    // Ví dụ: Dữ liệu cũ và bổ sung thêm sản phẩm mới theo các category đã tạo
    await queryInterface.bulkInsert(
      "products",
      [
        // Sản phẩm cũ:
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
        // Sản phẩm mới cho Xu hướng 2025
        {
          product_id: 201,
          name: "Đồng hồ Xu hướng 2025 - A",
          description: "Thiết kế độc đáo, bắt kịp xu hướng năm 2025",
          price: 600.0,
          discount_price: 580.0,
          rating: 5,
          created_at: new Date(),
          brand_id: 4,
          sku: "XTD-201",
        },
        // Sản phẩm mới cho Cao cấp
        {
          product_id: 202,
          name: "Đồng hồ Cao cấp - B",
          description: "Đồng hồ cao cấp với chất liệu sang trọng",
          price: 1200.0,
          discount_price: 1150.0,
          rating: 5,
          created_at: new Date(),
          brand_id: 5,
          sku: "CC-202",
        },
        // Sản phẩm mới cho Nổi bật
        {
          product_id: 203,
          name: "Đồng hồ Nổi bật - C",
          description: "Sản phẩm được khách hàng yêu thích và đánh giá cao",
          price: 800.0,
          discount_price: 750.0,
          rating: 4,
          created_at: new Date(),
          brand_id: 6,
          sku: "NB-203",
        },
        // Sản phẩm mới cho Treo tường
        {
          product_id: 204,
          name: "Đồng hồ Treo tường - D",
          description: "Sản phẩm trang trí treo tường độc đáo",
          price: 400.0,
          discount_price: null,
          rating: 4,
          created_at: new Date(),
          brand_id: 7,
          sku: "TT-204",
        },
      ],
      {}
    );

    // 4. Insert CategoriesHasProducts (quan hệ many-to-many)
    // Gán sản phẩm theo từng category:
    await queryInterface.bulkInsert(
      "categories_has_products",
      [
        // Sản phẩm cũ:
        { categories_category_id: 1, products_product_id: 101 },
        { categories_category_id: 1, products_product_id: 102 },
        { categories_category_id: 2, products_product_id: 103 },
        // Sản phẩm mới:
        { categories_category_id: 3, products_product_id: 201 }, // Xu hướng 2025
        { categories_category_id: 4, products_product_id: 202 }, // Cao cấp
        { categories_category_id: 5, products_product_id: 203 }, // Nổi bật
        { categories_category_id: 6, products_product_id: 204 }, // Treo tường
      ],
      {}
    );

    // 5. Insert ProductImages
    // Mỗi sản phẩm có 1 hoặc nhiều hình ảnh, dùng URL mẫu theo yêu cầu
    await queryInterface.bulkInsert(
      "product_images",
      [
        // Hình ảnh cho sản phẩm cũ
        {
          product_image_id: 1,
          url: "http://localhost:6969/uploads/product/product1.png",
          product_id: 101,
        },
        {
          product_image_id: 2,
          url: "http://localhost:6969/uploads/product/product2.png",
          product_id: 102,
        },
        {
          product_image_id: 3,
          url: "http://localhost:6969/uploads/product/product3.png",
          product_id: 103,
        },
        // Hình ảnh cho sản phẩm Xu hướng 2025 (4 ảnh mẫu)
        {
          product_image_id: 4,
          url: "https://www.watchstore.vn/images/products/2024/06/04/resized/caw211r-fc6401-1_tag-heuer_1717491547.webp",
          product_id: 201,
        },
        {
          product_image_id: 5,
          url: "https://www.watchstore.vn/images/products/2024/resized/424-1968262149-860594244-1712496235.webp",
          product_id: 201,
        },
        {
          product_image_id: 6,
          url: "https://www.watchstore.vn/images/products/2024/resized/l26285597-1-1712495070.webp",
          product_id: 201,
        },
        {
          product_image_id: 7,
          url: "https://www.watchstore.vn/images/products/2024/05/25/resized/l2-786-5-76-3-1_longines_1716604473.webp",
          product_id: 201,
        },
        // Hình ảnh cho sản phẩm Cao cấp (4 ảnh mẫu)
        {
          product_image_id: 8,
          url: "https://www.watchstore.vn/images/products/2024/06/04/resized/caw211r-fc6401-1_tag-heuer_1717491547.webp",
          product_id: 202,
        },
        {
          product_image_id: 9,
          url: "https://www.watchstore.vn/images/products/2024/resized/424-1968262149-860594244-1712496235.webp",
          product_id: 202,
        },
        {
          product_image_id: 10,
          url: "https://www.watchstore.vn/images/products/2024/resized/l26285597-1-1712495070.webp",
          product_id: 202,
        },
        {
          product_image_id: 11,
          url: "https://www.watchstore.vn/images/products/2024/05/25/resized/l2-786-5-76-3-1_longines_1716604473.webp",
          product_id: 202,
        },
        // Hình ảnh cho sản phẩm Nổi bật (4 ảnh mẫu)
        {
          product_image_id: 12,
          url: "https://www.watchstore.vn/images/products/2024/resized/nh8350-59l-1-1975983304-2071507878-1712483070.webp",
          product_id: 203,
        },
        {
          product_image_id: 13,
          url: "https://www.watchstore.vn/images/products/2024/resized/bf2011-01e-1712485173.webp",
          product_id: 203,
        },
        {
          product_image_id: 14,
          url: "https://www.watchstore.vn/images/products/2024/resized/bl8150-86l-1712483038.webp",
          product_id: 203,
        },
        {
          product_image_id: 15,
          url: "https://www.watchstore.vn/images/products/2024/resized/au1062-56e-112015096-579722830-1712485146.webp",
          product_id: 203,
        },
        // Hình ảnh cho sản phẩm Treo tường (4 ảnh mẫu)
        {
          product_image_id: 16,
          url: "https://www.watchstore.vn/images/products/2024/11/07/resized/dong-ho-treo-tuong-seiko-qxm604b_1730953080.webp",
          product_id: 204,
        },
        {
          product_image_id: 17,
          url: "https://www.watchstore.vn/images/products/2024/resized/iq-126-5df-1712494750.webp",
          product_id: 204,
        },
        {
          product_image_id: 18,
          url: "https://www.watchstore.vn/images/products/2024/12/05/resized/seiko-qha007kl_1733388037.webp",
          product_id: 204,
        },
        {
          product_image_id: 19,
          url: "https://www.watchstore.vn/images/products/2024/09/27/resized/qxc237b-png_1727440522.webp",
          product_id: 204,
        },
      ],
      {}
    );

    // Giữ nguyên các phần dữ liệu khác (Users, Cart, Orders, OrderItems, Payments, Feedbacks) nếu không có thay đổi
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
          payment_date: null,
          amount: 250.0,
          payment_method: "Bank Transfer",
          status: "Pending",
          order_id: 1002,
        },
      ],
      {}
    );

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
