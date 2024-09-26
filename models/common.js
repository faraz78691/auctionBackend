const db = require('../utils/database');
module.exports={
    insertData :(async (table, where, data) => {
        
        return db.query(`insert into ${table} set ? ${where}` ,[data]);
    }),
    updateData:(async (table, where, data) => {
        return db.query(`update ${table} SET ? ${where}` ,[data]);
    }),
    getData: (async(table, where) => {
        return db.query(`select * from ${table} ${where}`);  
    }),
    getDataByPagination: (async(data, table, where) => {
        return db.query(`select ${data} from ${table} ${where}`);  
    }),
    deleteData :(async (table,where) => {
        return db.query(`Delete from ${table} ${where}`);
    }),
    fetchCount :(async (table,where) => {
        return db.query(`select  count(*) as total from ${table} ${where}`);
    }),
    //added on  28-06-2022
    getSelectedColumn :(async(table, where, column )=> {
        return db.query(`select ${column} from ${table} ${where}`);
    }) 
}