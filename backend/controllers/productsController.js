const pool = require("../server");

exports.getProducts = (req, res) => {
  // Will pause execution if debugger attached
  const mainCategoryId = req.query.maincategoryid;
  const subCategoryId = req.query.subcategoryid;
  const keyword = req.query.keyword;
  console.log("category filters:", mainCategoryId, subCategoryId, keyword);

  let query = "SELECT * FROM PRODUCTS";
  let queryParams = [];

  if (mainCategoryId) {
    query = `SELECT PRODUCTS.* FROM PRODUCTS 
             JOIN CATEGORIES ON PRODUCTS.category_id = CATEGORIES.id 
             WHERE CATEGORIES.parent_category_id = ?`;
    queryParams.push(mainCategoryId);
    if (keyword) {
      query += `AND keywords like '%${keyword}%'`;
    }
  } else if (subCategoryId) {
    query += ` WHERE category_id = ?`;
    queryParams.push(subCategoryId);
  }

  pool.query(query, queryParams, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.send(results);
  });
};

exports.getProduct = (req, res) => {
  const id = req.params.id;

  // Validate ID
  if (!id) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  const query = "SELECT * FROM PRODUCTS WHERE ID = ?";
  pool.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.send(results[0]);
  });
};

exports.getAllProduct = (req, res) => {
  const query = "SELECT * FROM PRODUCTS";
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Products not found" });
    }

    res.send(results[0]);
  });
};
