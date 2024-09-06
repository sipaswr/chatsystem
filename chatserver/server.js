const express = require('express');
const app = express();
app.use(express.json());

let users = [];

// Create User API
app.post('/api/users', (req, res) => {
    const { username, email } = req.body;

    const userExists = users.some(user => user.username === username);

    if (userExists) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new user
    const newUser = { id: Date.now(), username, email };
    users.push(newUser);
    return res.status(201).json({ message: 'User created successfully', user: newUser });
});

// Remove User API
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;

    users = users.filter(user => user.id !== parseInt(id));

    return res.status(200).json({ message: 'User removed successfully' });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
