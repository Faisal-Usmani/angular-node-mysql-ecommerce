const pool = require('../server');
var jwt = require('jsonwebtoken');


exports.addOrder = async (req, res) => {
    const { userName, userEmail, address, city, state, pin, total, orderDetails } = req.body;

    try {

        //Get userid from user Table
        const existingUser = await pool.promise().query(`SELECT Id FROM USERS WHERE EMAIL=?`, [userEmail]);

        if (existingUser[0].count == 0) {
            return res.status(200).send('User does not Exist');
        }
        const userId = existingUser[0][0].Id;

        //Inser into order table
        const [orderResult] = await pool.promise().query(
            `INSERT INTO estore.orders (userId, userName, address, city, state, pin, total)
   VALUES (?,?,?,?,?,?,?)`,
            [userId, userName, address, city, state, pin, total]
        );

        const orderId = orderResult.insertId;  // auto-incremented orderId


        //insert into table orderDetails
        const insertPromises = orderDetails.map((item) => {
            return pool
                .promise()
                .query(
                    `INSERT INTO estore.orderdetails (orderId, productId, qty, price, amount)
       VALUES (?,?,?,?,?)`,
                    [orderId, item.productId, item.qty, item.price, item.amount]
                );
        });

        await Promise.all(insertPromises);


        res.status(201).send({ message: 'order places successfully' });
    }
    catch (error) {
        res.status(500).send(error.message) || 'Something went wrong'
    }

}

exports.allOrder = async (req, res) => {
    const { userEmail } = req.query;

    try {

        //Get userid from user Table
        const [user] = await pool.promise().query(`SELECT Id FROM USERS WHERE EMAIL=?`, [userEmail]);

        if (user.length == 0) {
            return res.status(404).send('User does not Exist');
        }
        const userId = user[0].Id;

        const [orderData] = await pool.promise().query(
            `SELECT orderId,DATE_FORMAT(orderDate,'%m/%d,%y') as orderDate ,userName,address,city,state,pin,total FROM orders WHERE userId=?`, [userId]
        );

        const allOrder = orderData.map((order) => ({
            orderId: order.orderId,
            userName: order.userName,
            address: order.address,
            city: order.city,
            state: order.state,
            pin: order.pin,
            total: order.total,
            orderDate: order.orderDate
        }))


        res.status(200).json(allOrder);
    }
    catch (error) {
        res.status(500).send(error.message) || 'Something went wrong'
    }

}

exports.orderProducts = async (req, res) => {
    const { orderId } = req.query;

    try {

        //Get userid from user Table
        const [orderProducts] = await pool.promise().query(
            `SELECT
     od.productId,
     p.product_name,
     p.product_img,
     od.qty,
     od.price,
     od.amount
   FROM estore.orderdetails od
   JOIN estore.products p ON od.productId = p.id
   WHERE od.orderId = ?`,
            [orderId]
        );



        const orderDetails = orderProducts.map((item) => ({
            productId: item.productId,
            productName: item.product_name,
            productImage: item.product_img,
            qty: item.qty,
            price: item.price,
            amount: item.amount,


        }))

        res.status(200).json(orderDetails);
    }
    catch (error) {
        res.status(500).send(error.message) || 'Something went wrong'
    }

}


