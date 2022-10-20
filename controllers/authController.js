const usersDB = {
    users: require('../testdb/users.json'),
    setUsers: function (data) { this.users = data}
}
const bcrypt = require('bcrypt');

const handleLogin = async (req, res) =>{
    const { user, pass} = req.body
    if(!user || !pass) return res.status(400).json({'message': 'Username and password are required'});
    const foundUser = usersDB.users.find(person => person.username === user);
    console.log(foundUser)
    if (!foundUser) return res.sendStatus(401);
    const match = await bcrypt.compare(pass, foundUser.password);
    if (match) {
         res.json({ 'success' : `User ${user} is logged in`, 'first':foundUser.firstName, 'last':foundUser.lastName})
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin }