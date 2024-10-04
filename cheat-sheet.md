# Express App Cheat Sheet

1. Initialize project
2. Nodemon

   - Install nodemon
   - Add start config

3. Express
   - Start initial express server
   - Add static route
   - Add resources to public folder
   - Add body parser
   - Add Routes
4. Handlebars
   - Install express-handlebars
   - Config handlebars with express
   - Add views folder with resources
   - Add home view
   - Add home controller
   - Add home controller to routes
   - Add main layout
     -Add partial dir
5. Database
   - Install mongoose
   - Setup db connection
   - Setup user model
6. Register
   - Fix navigation links
   * Add register page (view, controller, route)
   * Fix register form
   * Add post register action
   * Add authService
   * Install Bcrypt
   * Hash password
   * Check confirm password
   * Check if user exist
7. Login

   - Install jsonwebtoken
   - Install cookie-parser
   - Add cookie - parser middleware

   * Optionally: convert to promise based
   * Add login page

   - Fix login form
   - Add login post action
   - Add authService login method
     - Validate user
     - Validate password
     - Generate token

   * Return cookie
   * Modify register for auto login

8. Logout
9. Authentication and Authorization
   - Add auth middleware
   - Check token if token
   * Verify token
   * Attach user to request object
   * Use middleware in express
   * Add isAuth route guard
10. Error handling

    - Add notifications

    * Add getErrorMessage util
    * Add error handling in register
    * Add login error handling

11. Last fixes
    - Dynamic navigation
