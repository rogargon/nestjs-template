db.createUser({
    user: 'db',
    pwd: 'password',
    roles: [
        {
            role: 'readWrite',
            db: 'db'
        }
    ]
});
