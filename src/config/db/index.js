const mongoose = require('mongoose');
async function connect() {
    await mongoose
        .connect(process.env.MONGODB_URI)
        .then(() => {
            console.log(`Kết nối csdl ${process.env.MONGODB_URI}`);
            console.log('Thành công');
        })
        .catch((err) => {
            console.error(`Lỗi kết nối đến csdl ${process.env.MONGODB_URI}\n` + err);
        });
}
module.exports = { connect };
