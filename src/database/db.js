const mongoose = require('mongoose');

function connect() {

    mongoose.connect(process.env.DB_URL)

    const db = mongoose.connection
    
    db.once('open', () => {
        console.log('connected to database!')
    })
    
    db.on('error', console.error.bind(console, 'connection error: '))

}

module.exports = {
    connect
}