const { User} = require("../dbconnect");
const app = require("../index"); 
const request = require('supertest');
const jwt = require('jsonwebtoken');
const jwtSecret = 'this is jwt scret';

describe("POST /user", () => {
    it("should return all users", async () => {
        return request(app)
            .get("/user")
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.statusCode).toBe(200);
            })
    });
});



describe('POST /user/sign_up', () => {
  it('should sign up a new user and return success', async () => {
    // Define user data for signing up
    const userData = {
      first_name: 'aman',
      last_name: 'gupta',
      age: 23,
      email_id: 'aman@example.com',
      password: 'password123',
    };

    // Send a POST request to the signup endpoint with user data
    const response = await request(app)
      .post('/user/sign_up')
      .send(userData);

    // Verify that the response status code is 201 (Created)
    expect(response.status).toBe(201);

    // Verify that the response body contains a success message
    expect(response.body).toHaveProperty('status', 'Succes');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toHaveProperty('first_name', userData.first_name);
    // Add more assertions as needed for other properties of the response body
  });

  it('should return 400 for invalid email during signup', async () => {
    // Define user data with invalid email for signing up
    const userData = {
      first_name: 'John',
      last_name: 'Doe',
      age: 30,
      email_id: 'invalid-email', // Invalid email format
      password: 'password123',
    };

    // Send a POST request to the signup endpoint with invalid user data
    const response = await request(app)
      .post('/user/sign_up')
      .send(userData);

    // Verify that the response status code is 400 (Bad Request)
    expect(response.status).toBe(400);

    // Verify that the response body contains a failure message
    expect(response.body).toHaveProperty('status', 'fail');
    expect(response.body).toHaveProperty('message', 'please provide valid email_id');
  });
});



describe('POST /user/login', () => {
    // Test case for successful login
    it('should login user and return a token', async () => {
      // Create a new user in the database
      await User.create({
        email_id: 'test@example.com',
        password: 'password123'
      });
  
      // Send a request to the login endpoint with valid credentials
      const response = await request(app)
        .post('/user/login')
        .send({
          email_id: 'test@example.com',
          password: 'password123'
        })
        .expect(200);
  
      // Extract the token from the response body
      const {token } = response.body;
      // Verify that the token is valid by decoding it
      const decodedToken = jwt.verify(token, jwtSecret);
  
      // Assert that the decoded token contains the correct email_id
      expect(decodedToken).toHaveProperty('email_id', 'test@example.com');
  
      // Assert that the response contains the success message
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('message', 'User login successful');
    });
  
    // Test case for invalid credentials
    it('should return 401 for invalid credentials during login', async () => {
      // Send a request to the login endpoint with invalid credentials
      const response = await request(app)
        .post('/user/login')
        .send({
          email_id: 'nonexistent@example.com',
          password: 'invalidpassword'
        })
        .expect(401);
  
      // Assert that the response contains the error message
      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });


//   Test case for missing email ID


  it('should return 400 if email ID is missing during login', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({
        password: 'password123'
      })
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Email ID is required');
  });


    //   Test case for missing password
  it('should return 400 if password is missing during login', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({
        email_id: 'test@example.com'
      })
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Password is required');
  });

// Test case for missing both password and email_id


  it('should return 400 if both email ID and password are missing during login', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Email ID and password are required');
  });
 
  });


  describe('GET /user/profiles', () => {
    // Helper function to generate JWT token for authentication
   
    const generateAuthToken = (email_id) => {
      return jwt.sign({ email_id }, jwtSecret);
    };
  
    // Test case for fetching user profile
    it('should fetch user profile', async () => {
      // Create a new user in the database
      const user = await User.create({
        email_id: 'aman@gmail.com',
        first_name: 'aman',
        last_name: 'gupta',
        age: 23
      });
  
      // Generate JWT token for authentication
      const token = generateAuthToken(user.email_id);
  
      // Send a request to the profile endpoint with authentication token
      const response = await request(app)
        .get('/user/profiles')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
  
      // Assert that the response contains the user's profile information
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('profile');
      expect(response.body.profile).toEqual({
        email_id: 'aman@gmail.com',
        first_name: 'aman',
        last_name: 'gupta',
        age: 23
      });
    });
  
    // Test case for unauthorized access
    it('should return 401 for unauthorized access', async () => {
      // Send a request to the profile endpoint without authentication token
      const response = await request(app)
        .get('/user/profiles')
        .expect(401);
  
      // Assert that the response contains an error message
      expect(response.body).toEqual({});
    });

});