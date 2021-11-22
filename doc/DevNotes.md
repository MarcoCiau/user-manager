# Development Notes


## Signup Workflow
1. verify if email exists
2. hash password : https://auth0.com/blog/hashing-in-action-understanding-bcrypt/
3. save to db : https://mongoosejs.com/docs/typescript.html
4. generate jwt : https://www.npmjs.com/package/bcrypt

## Signin Workflow
1. verify if email exists, if it exists, continue
2. compare password with hashed password : https://www.npmjs.com/package/bcrypt
3. if the password is valid, generate token : https://www.npmjs.com/package/bcrypt