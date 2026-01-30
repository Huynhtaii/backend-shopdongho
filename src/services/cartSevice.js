import db from '../models';

const getCartByUserId = async (user_id) => {
    try {
        const data = await db.Cart.findAll({
            include: [
                {
                    model: db.CartItem,
                    include: [
                        {
                            model: db.Product,
                            include: [
                                {
                                    model: db.ProductImage,
                                }
                            ],
                        }
                    ],
                },
            ],
            where: { user_id: user_id }
        });

        // Tính tổng giá
        let totalPrice = 0;// số tiền phải trả
        let totalSavings = 0;// tổng số tiền chk tính giảm giá
        data.forEach(cart => {
            cart.CartItems.forEach(item => {
                totalPrice += item.quantity * (item.Product.discount_price || item.Product.price);
            });
        });

        data.forEach(cart => {
            cart.CartItems.forEach(item => {
                if (item.Product.discount_price) {
                    totalSavings += item.quantity * item.Product.price;
                }
            });
        });


        return {
            EM: 'Get all cart successfully',
            EC: '0',
            DT: data,
            totalPrice: totalPrice,
            totalSavings: totalSavings
        };
    } catch (error) {
        console.error('Get all cart error:', error);
        return {
            EM: 'Get all cart error',
            EC: '-1',
            DT: '',
        };
    }
};

const createCartItem = async (user_id, data) => {
    try {
        // Kiểm tra xem user_id có tồn tại trong bảng Cart không
        const cart = await db.Cart.findOne({
            where: { user_id: user_id }
        });

        if (!cart) {
            return {
                EM: 'Cart not found for this user',
                EC: '1',
                DT: ''
            };
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingItem = await db.CartItem.findOne({
            where: {
                cart_id: cart.cart_id,
                product_id: data.product_id
            }
        });

        if (existingItem) {
            // Nếu sản phẩm đã tồn tại, cập nhật quantity
            existingItem.quantity += data.quantity || 1;
            await existingItem.save();

            return {
                EM: 'Updated cart item quantity successfully',
                EC: '0',
                DT: existingItem
            };
        } else {
            // Nếu chưa thêm sản phẩm vào giỏ hàng (CartItem)
            const newItem = await db.CartItem.create({
                cart_id: cart.cart_id, // Liên kết với giỏ hàng của user
                product_id: data.product_id,
                quantity: data.quantity || 1,
                created_at: data.created_at,
            });
            return {
                EM: 'Item added to cart successfully',
                EC: '0',
                DT: newItem
            };
        }


    } catch (error) {
        console.error('Add cart item error:', error);
        return {
            EM: 'Add cart item error',
            EC: '-1',
            DT: ''
        };
    }
};

const updateQuantityCartItem = async (id, new_quantity) => {
    try {
        // Tìm CartItem theo ID
        const cartItem = await db.CartItem.findByPk(id);

        if (!cartItem) {
            return {
                EM: 'Cart item not found',
                EC: '1',
                DT: ''
            };
        }

        // Cập nhật số lượng sản phẩm
        cartItem.quantity = new_quantity;
        await cartItem.save();

        return {
            EM: 'Cart item quantity updated successfully',
            EC: '0',
            DT: cartItem
        };
    } catch (error) {
        console.error('Update cart item quantity error:', error);
        return {
            EM: 'Update cart item quantity error',
            EC: '-1',
            DT: ''
        };
    }
};

const deleteCartItem = async (id) => {
    try {
        const cart_item = await db.CartItem.destroy({
            where: { cart_item_id: id },
        });
        if (!cart_item) {
            return {
                EM: 'cart_item not found',
                EC: '0',
                DT: [],
            };
        }
        return {
            EM: 'Delete cart_item successfully',
            EC: '0',
            DT: cart_item,
        };
    } catch (error) {
        return {
            EM: 'error from service',
            EC: '-1',
            DT: '',
        };
    }
};


export default {
    getCartByUserId,
    createCartItem,
    updateQuantityCartItem,
    deleteCartItem
}