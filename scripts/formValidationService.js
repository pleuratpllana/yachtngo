// Form Validation Service for handling form validation
class FormValidationService {
  constructor() {
    this.errorMessages = {
      required: "This field is required.",
      email: "Please enter a valid email address.",
      password: "Password must be at least 6 characters long.",
      name: "Name must be at least 2 characters long.",
      emailInUse: "This email is already in use. Please choose another one.",
      emailNotFound: "This email is not associated with any account. Please check the email address or register for a new account.",
      passwordMismatch: "Passwords do not match.",
      invalidCredentials: "Invalid email or password."
    };
  }

  // Show error message
  showError(inputId, message) {
    const input = document.querySelector(`#${inputId}`);
    if (input) {
      let errorElement = input.parentElement.querySelector(".error-message");
      if (!errorElement) {
        errorElement = document.createElement("span");
        errorElement.className = "error-message";
        input.parentElement.appendChild(errorElement);
      }
      errorElement.textContent = message;
    }
  }

  // Clear error message
  clearError(inputId) {
    const input = document.querySelector(`#${inputId}`);
    if (input) {
      const errorElement = input.parentElement.querySelector(".error-message");
      if (errorElement) {
        errorElement.remove();
      }
    }
  }

  // Clear all errors
  clearErrors() {
    const errorElements = document.querySelectorAll(".error-message");
    errorElements.forEach(element => element.remove());
  }

  // Validate email format
  validateEmail(email) {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }

  // Validate password strength
  validatePassword(password) {
    return password.length >= 6;
  }

  // Validate name
  validateName(name) {
    return name.length >= 2;
  }

  // Validate registration form
  async validateRegisterForm(name, email, password) {
    this.clearErrors();
    let isValid = true;

    if (!name || !this.validateName(name)) {
      this.showError("fullName", this.errorMessages.name);
      isValid = false;
    }

    if (!email || !this.validateEmail(email)) {
      this.showError("emailInput", this.errorMessages.email);
      isValid = false;
    } else {
      const emailInUse = await authService.checkIfEmailInUse(email);
      if (emailInUse) {
        this.showError("emailInput", this.errorMessages.emailInUse);
        isValid = false;
      }
    }

    if (!password || !this.validatePassword(password)) {
      this.showError("passwordInput", this.errorMessages.password);
      isValid = false;
    }

    return isValid;
  }

  // Validate login form
  async validateLoginForm(email, password) {
    this.clearErrors();
    let isValid = true;

    if (!email || !this.validateEmail(email)) {
      this.showError("emailInput", this.errorMessages.email);
      isValid = false;
    } else {
      const emailInUse = await authService.checkIfEmailInUse(email);
      if (!emailInUse) {
        this.showError("emailInput", this.errorMessages.emailNotFound);
        isValid = false;
      }
    }

    if (!password) {
      this.showError("passwordInput", this.errorMessages.required);
      isValid = false;
    }

    return isValid;
  }

  // Validate password creation form
  validatePasswordCreationForm(password, confirmPassword) {
    this.clearErrors();
    let isValid = true;

    if (!password || !this.validatePassword(password)) {
      this.showError("newPassword", this.errorMessages.password);
      isValid = false;
    }

    if (!confirmPassword) {
      this.showError("confirmPassword", this.errorMessages.required);
      isValid = false;
    } else if (password !== confirmPassword) {
      this.showError("confirmPassword", this.errorMessages.passwordMismatch);
      isValid = false;
    }

    return isValid;
  }

  // Initialize form with validation
  initializeForm(formId, formHandler) {
    const form = document.getElementById(formId);
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        formHandler(form);
      });
    }
  }
}

// Create a global instance
window.formValidationService = new FormValidationService(); 