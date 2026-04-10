import db from '../models/index';

const getUserAddresses = async (userId) => {
   try {
      let addresses = await db.ShippingAddress.findAll({
         where: { user_id: userId },
         order: [['is_default', 'DESC'], ['createdAt', 'DESC']],
      });

      // Auto-migrate if empty
      if (addresses.length === 0) {
         const user = await db.User.findByPk(userId);
         if (user && user.address) {
            const newAddr = await db.ShippingAddress.create({
               user_id: userId,
               recipient_name: user.name,
               recipient_phone: user.phone,
               recipient_email: user.email,
               address: user.address,
               is_default: true,
            });
            addresses = [newAddr];
         }
      }

      return {
         EM: 'Get user addresses success',
         EC: 0,
         DT: addresses,
      };
   } catch (error) {
      console.error(error);
      return {
         EM: 'Error from service',
         EC: -1,
         DT: [],
      };
   }
};

const createAddress = async (data) => {
   try {
      // If this is the first address, make it default
      const count = await db.ShippingAddress.count({ where: { user_id: data.user_id } });
      let isDefault = data.is_default || count === 0;

      if (isDefault) {
         await db.ShippingAddress.update(
            { is_default: false },
            { where: { user_id: data.user_id } }
         );
      }

      const newAddress = await db.ShippingAddress.create({
         user_id: data.user_id,
         recipient_name: data.recipient_name,
         recipient_phone: data.recipient_phone,
         recipient_email: data.recipient_email,
         address: data.address,
         is_default: isDefault,
      });

      return {
         EM: 'Create address success',
         EC: 0,
         DT: newAddress,
      };
   } catch (error) {
      console.error(error);
      return {
         EM: 'Error from service',
         EC: -1,
         DT: null,
      };
   }
};

const updateAddress = async (id, data) => {
   try {
      const address = await db.ShippingAddress.findByPk(id);
      if (!address) {
         return { EM: 'Address not found', EC: 1, DT: null };
      }

      if (data.is_default && !address.is_default) {
         await db.ShippingAddress.update(
            { is_default: false },
            { where: { user_id: address.user_id } }
         );
      }

      await address.update(data);

      return {
         EM: 'Update address success',
         EC: 0,
         DT: address,
      };
   } catch (error) {
      console.error(error);
      return {
         EM: 'Error from service',
         EC: -1,
         DT: null,
      };
   }
};

const deleteAddress = async (id) => {
   try {
      const address = await db.ShippingAddress.findByPk(id);
      if (!address) {
         return { EM: 'Address not found', EC: 1, DT: null };
      }

      const wasDefault = address.is_default;
      const userId = address.user_id;

      await address.destroy();

      // If we deleted the default, set another one as default
      if (wasDefault) {
         const nextAddress = await db.ShippingAddress.findOne({
            where: { user_id: userId },
            order: [['createdAt', 'DESC']],
         });
         if (nextAddress) {
            await nextAddress.update({ is_default: true });
         }
      }

      return {
         EM: 'Delete address success',
         EC: 0,
         DT: null,
      };
   } catch (error) {
      console.error(error);
      return {
         EM: 'Error from service',
         EC: -1,
         DT: null,
      };
   }
};

const setDefaultAddress = async (userId, addressId) => {
   try {
      await db.ShippingAddress.update(
         { is_default: false },
         { where: { user_id: userId } }
      );
      await db.ShippingAddress.update(
         { is_default: true },
         { where: { id: addressId, user_id: userId } }
      );

      return {
         EM: 'Set default address success',
         EC: 0,
         DT: null,
      };
   } catch (error) {
      console.error(error);
      return {
         EM: 'Error from service',
         EC: -1,
         DT: null,
      };
   }
};

export default {
   getUserAddresses,
   createAddress,
   updateAddress,
   deleteAddress,
   setDefaultAddress,
};
