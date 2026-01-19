import db from "../models";
const getCatgeories = async () => {
    try {
        const categories = await db.Category.findAll();
        if (!categories) {
            return {
                EM: "categories not found",
                EC: "0",
                DT: [],
            };
        }
        return {
            EM: "Get categories success",
            EC: "0",
            DT: categories,
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

export default { getCatgeories };