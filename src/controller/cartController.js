import cartSevice from '../services/cartSevice';

const getCartByUserId = async (req, res) => {
    try {
        const { user_id } = req.params
        let cart = await cartSevice.getCartByUserId(user_id);
        return res.status(200).json({
            EM: cart.EM,
            EC: cart.EC,
            DT: cart.DT,
            totalPrice: cart.totalPrice,
            totalSavings: cart.totalSavings
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: '',
        });
    }
};

const createCartItem = async (req, res) => {
    try {
        const { user_id } = req.params
        const data = req.body
        let cart = await cartSevice.createCartItem(user_id, data);
        return res.status(200).json({
            EM: cart.EM,
            EC: cart.EC,
            DT: cart.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: '',
        });
    }
}

const updateQuantityCartItem = async (req, res) => {
    try {
        const { id } = req.params
        const { quantity } = req.body;

        let cart = await cartSevice.updateQuantityCartItem(id, quantity);
        return res.status(200).json({
            EM: cart.EM,
            EC: cart.EC,
            DT: cart.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: '',
        });
    }
}

const deleteCartItem = async (req, res) => {
    try {
        const { id } = req.params
        let cart_item = await cartSevice.deleteCartItem(id);
        return res.status(200).json({
            EM: cart_item.EM,
            EC: cart_item.EC,
            DT: cart_item.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: '',
        });
    }
}

export default { getCartByUserId, createCartItem, updateQuantityCartItem, deleteCartItem };