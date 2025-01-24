const pool = require('../database');

async function getCartContents(userId) {
    const [rows] = await pool.query(`
        SELECT c.id, 
               c.product_id, 
               p.image AS imageUrl, 
               p.name AS productName,
               CAST(price AS DOUBLE) AS price,
               c.quantity 
               FROM cart_items AS c JOIN products AS p
          ON c.product_id = p.id
          WHERE user_id = ?
        `, [userId]);

    return rows;
}

// Data format
// Cart content: [{
//  product_id: ID of the product,
//  quantity: the number of the quantity
//}]
async function updateCart(userId, cartItems) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
       
        // 1. delete the old cart 
        connection.query('DELETE FROM cart_items WHERE user_id = ?', [userId])
       
        // 2. recreate the cart
        // this is an inefficent solution but you can try
        // creating an efficient solution where mutliple rows
        // are inserted with one query
        for (let cartItem of cartItems) {
            await connection.query(`
                INSERT INTO cart_items(user_id, product_id, quantity)
                    VALUES (?,?,?)
                
                `, [userId, cartItem.product_id, cartItem.quantity])
        }
        
        // finalize the changes to the database
        await connection.commit();

    } catch (e) {
        // any error when caught we rollback the database
        await connection.rollback();
    } finally {
        connection.release();
    }
}


module.exports = {
    getCartContents,
    updateCart
}