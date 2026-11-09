const pool=require('../server')

exports.getCategories=(req,res)=>{
    pool.query('SELECT * FROM categories', (err, results, fields) => {
    if (err) throw err;
    res.send(results)
    });
}
