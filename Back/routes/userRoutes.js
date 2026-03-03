Router.use((req, res, next) => {
    console.log('Headers'),{
        'Authorization': req.headers.Authorization? '***' + res.headers.Authorization.slice(8): null,
        'x-access-token': req.headers,

    }
}

router.post('/',
    verifyToken,
    checRole('admin', 'coordinador'),
    userController.createUser
);

router.get('/',
    verifyToken,
    checRole('admin', 'coordinador')
)