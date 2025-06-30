// Authentication Service for handling user authentication
class AuthService {
  constructor() {
    this.apiUrl = window.APP_CONFIG.API_URL;
  }

  // Check if user is logged in
  isUserLoggedIn() {
    return localStorage.getItem("userLoggedIn") === "true";
  }

  // Get current user email
  getCurrentUserEmail() {
    return localStorage.getItem("email");
  }

  // Handle logout
  handleLogout() {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("email");
    window.location.href = "login.html";
  }

  // Check if email is in use
  async checkIfEmailInUse(email) {
    try {
      const response = await fetch(`${this.apiUrl}?email=${email}`);
      if (response.status === 404) {
        // 404 means not found, so email is NOT in use
        return false;
      }
      if (!response.ok) {
        // Other errors
        throw new Error(`API error: ${response.status}`);
      }
      const users = await response.json();
      return users.length > 0;
    } catch (error) {
      // If error is 404, treat as not in use
      if (error.message && error.message.includes('404')) {
        return false;
      }
      console.error("Error checking email:", error);
      return false;
    }
  }

  // Register user
  async registerUser(userData) {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      return await response.json();
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  // Login user
  async loginUser(email, password) {
    try {
      const response = await fetch(`${this.apiUrl}?email=${email}`);
      const users = await response.json();
      
      if (users.length > 0 && users[0].password === password) {
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("email", email);
        return { success: true, user: users[0] };
      } else {
        return { success: false, message: "Invalid email or password" };
      }
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  // Update user password
  async updatePassword(email, newPassword) {
    try {
      const response = await fetch(`${this.apiUrl}?email=${email}`);
      const users = await response.json();
      
      if (users.length > 0) {
        const user = users[0];
        const updateResponse = await fetch(`${this.apiUrl}/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...user, password: newPassword }),
        });
        return await updateResponse.json();
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  }
}

// Create a global instance
window.authService = new AuthService(); 