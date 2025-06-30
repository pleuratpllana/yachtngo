$(document).ready(function () {
  $("#mobileProfileIcon").on("click", function () {
    $("#mobileProfileDropdown").fadeToggle(); // Use the correct ID here
  });

  $(document).on("click", function (e) {
    if (
      !$(e.target).closest("#mobileProfileIcon, #mobileProfileDropdown").length
    ) {
      $("#mobileProfileDropdown").fadeOut(); // Use the correct ID here
    }
  });
});

// Show/Hide Password
$(document).ready(function () {
  $("#togglePassword, #togglePasswordConfirm").on("click", function () {
    const passwordField = $(this).prev("input");
    const type =
      passwordField.attr("type") === "password" ? "text" : "password";
    passwordField.attr("type", type);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const userLoggedIn = localStorage.getItem("userLoggedIn") === "true";

  // Desktop Header Links
  const loginLinkDesktop = document.getElementById("loginLinkDesktop");
  const logoutLinkDesktop = document.getElementById("logoutLinkDesktop");
  const registerLinkDesktop = document.getElementById("registerLinkDesktop");

  // Mobile Header Links
  const loginLinkMobile = document.getElementById("loginLinkMobile");
  const registerLinkMobile = document.getElementById("registerLinkMobile");
  const logoutLinkMobile = document.getElementById("logoutLinkMobile");

  // Desktop Header Logic
  if (userLoggedIn) {
    loginLinkDesktop.style.display = "none";
    registerLinkDesktop.style.display = "none";
    logoutLinkDesktop.style.display = "inline-block";
  } else {
    loginLinkDesktop.style.display = "inline-block";
    registerLinkDesktop.style.display = "inline-block";
    logoutLinkDesktop.style.display = "none";
  }

  // Mobile Header Logic
  if (userLoggedIn) {
    if (loginLinkMobile) loginLinkMobile.style.display = "none";
    if (registerLinkMobile) registerLinkMobile.style.display = "none";
    if (logoutLinkMobile) logoutLinkMobile.style.display = "inline-block";
  } else {
    if (loginLinkMobile) loginLinkMobile.style.display = "inline-block";
    if (registerLinkMobile) registerLinkMobile.style.display = "inline-block";
    if (logoutLinkMobile) logoutLinkMobile.style.display = "none";
  }

  // Attach event listener to desktop logout link
  if (logoutLinkDesktop) {
    logoutLinkDesktop.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default behavior of the link
      handleLogout();
    });
  }

  // Attach event listener to mobile logout link
  if (logoutLinkMobile) {
    logoutLinkMobile.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default behavior of the link
      handleLogout();
    });
  }
});

// ---------------------------------------------------------------

// Handle logout
function handleLogout() {
  localStorage.removeItem("userLoggedIn");
  localStorage.removeItem("email");
  window.location.href = "login.html";
}

// Main application logic using modular services
document.addEventListener("DOMContentLoaded", function () {
  console.log("Main.js loaded - initializing application");
  
  // Check if services are available
  if (typeof authService === 'undefined') {
    console.error("authService not found");
    return;
  }
  if (typeof formValidationService === 'undefined') {
    console.error("formValidationService not found");
    return;
  }
  if (typeof uiService === 'undefined') {
    console.error("uiService not found");
    return;
  }

  // Initialize forms with their handlers
  initializeForms();

  // Initialize real-time validation
  initializeRealTimeValidation();

  // Initialize social login handlers
  initializeSocialLoginHandlers();

  // Initialize newsletter subscription
  initializeNewsletterSubscription();

  // Initialize password toggles
  initializePasswordToggles();
});

// Initialize forms
function initializeForms() {
  const forms = [
    { id: "registerForm", handler: handleRegisterForm },
    { id: "loginForm", handler: handleLoginForm },
    { id: "forgotPasswordForm", handler: handleForgotPasswordForm },
    { id: "createPasswordForm", handler: handleCreatePasswordForm }
  ];

  forms.forEach(({ id, handler }) => {
    const form = document.getElementById(id);
    if (form) {
      console.log(`Initializing form: ${id}`);
      formValidationService.initializeForm(id, handler);
    }
  });
}

// Failsafe: Remove modal/backdrop on all non-homepage pages
// This prevents any accidental blocking
/*
document.addEventListener("DOMContentLoaded", function () {
  if (!window.location.pathname.endsWith("homepage.html")) {
    document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
    const thankYouModalEl = document.getElementById("thankYouModal");
    if (thankYouModalEl && thankYouModalEl.parentNode) {
      thankYouModalEl.parentNode.removeChild(thankYouModalEl);
    }
  }
});
*/

// Homepage: Show Thank You modal only if flag is set, then clear flag
/*
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.endsWith("homepage.html") && localStorage.getItem("showThankYouModal") === "1") {
    const thankYouModal = new bootstrap.Modal(document.getElementById("thankYouModal"), {
      backdrop: "static",
      keyboard: false
    });
    thankYouModal.show();
    // Immediately clear the flag so it never shows again
    localStorage.setItem("showThankYouModal", "0");
    // Only allow closing with the ship icon
    const closeBtn = document.querySelector("#thankYouModal .closeBtn");
    closeBtn.addEventListener("click", () => {
      thankYouModal.hide();
      setTimeout(() => {
        document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
      }, 500);
    });
    // Prevent closing with ESC or clicking outside
    const modalElement = document.getElementById("thankYouModal");
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") e.preventDefault();
    });
    modalElement.addEventListener("click", function (e) {
      if (e.target === modalElement) e.preventDefault();
    });
  }
});
*/

// Registration handler: set flag and redirect to homepage
async function handleRegisterForm(form) {
  const name = form.querySelector("#fullName")?.value.trim();
  const email = form.querySelector("#emailInput")?.value.trim();
  const password = form.querySelector("#passwordInput")?.value.trim();

  const isValid = await formValidationService.validateRegisterForm(name, email, password);
  
  if (isValid) {
    try {
      uiService.toggleButtonState("registerButton", true);
      const user = await authService.registerUser({ name, email, password });
      // Automatically log in the user after registration
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("email", email);
      // Set thank you modal flag (no longer needed)
      // localStorage.setItem("showThankYouModal", "1");
      uiService.redirectTo("homepage.html");
    } catch (error) {
      uiService.showErrorMessage("Registration failed. Please try again.");
    } finally {
      uiService.toggleButtonState("registerButton", false);
    }
  }
}

// Login handler
async function handleLoginForm(form) {
  // console.log("handleLoginForm called");
  const email = form.querySelector("#emailInput")?.value.trim();
  const password = form.querySelector("#passwordInput")?.value.trim();

  const isValid = await formValidationService.validateLoginForm(email, password);
  
  if (isValid) {
    try {
      uiService.toggleButtonState("loginButton", true);
      const result = await authService.loginUser(email, password);
      // Always clear thank you modal flag on login (no longer needed)
      // localStorage.setItem("showThankYouModal", "0");
      // Remove thank you modal element if present (no longer needed)
      // const thankYouModalEl = document.getElementById("thankYouModal");
      // if (thankYouModalEl && thankYouModalEl.parentNode) {
      //   thankYouModalEl.parentNode.removeChild(thankYouModalEl);
      // }
      // Remove all modal-backdrop elements (no longer needed)
      // document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
      if (result.success) {
        uiService.showSuccessMessage("Login successful!");
        uiService.redirectTo("homepage.html");
      } else {
        formValidationService.showError("passwordInput", result.message);
      }
    } catch (error) {
      uiService.showErrorMessage("Login failed. Please try again.");
    } finally {
      uiService.toggleButtonState("loginButton", false);
    }
  }
}

async function handleForgotPasswordForm(form) {
  const email = form.querySelector("#emailInput")?.value.trim();

  if (!email || !formValidationService.validateEmail(email)) {
    formValidationService.showError("emailInput", formValidationService.errorMessages.email);
    return;
  }

  try {
    uiService.toggleButtonState("forgotPasswordButton", true);

    // Generate a simple (not secure) token for demo
    const token = btoa(email + ':' + Date.now());
    const resetLink = `https://yachtngo.the-p-squared.com/createnewpassword.html?token=${token}`;

    await emailjs.send(
      window.APP_CONFIG.EMAILJS_SERVICE_ID,
      window.APP_CONFIG.EMAILJS_TEMPLATE_ID,
      {
        email: email,
        link: resetLink
      },
      window.APP_CONFIG.EMAILJS_PUBLIC_KEY
    );

    uiService.showSuccessMessage("Password reset instructions sent to your email.");
    uiService.redirectTo("checkemail.html");
  } catch (error) {
    uiService.showErrorMessage("Failed to send reset email. Please try again.");
  } finally {
    uiService.toggleButtonState("forgotPasswordButton", false);
  }
}

async function handleCreatePasswordForm(form) {
  const password = form.querySelector("#newPassword")?.value.trim();
  const confirmPassword = form.querySelector("#confirmPassword")?.value.trim();

  const isValid = formValidationService.validatePasswordCreationForm(password, confirmPassword);
  
  if (isValid) {
    try {
      uiService.toggleButtonState("createPasswordButton", true);
      // Here you would typically update the user's password
      uiService.showSuccessMessage("Password updated successfully!");
      uiService.redirectTo("login.html");
    } catch (error) {
      uiService.showErrorMessage("Failed to update password. Please try again.");
    } finally {
      uiService.toggleButtonState("createPasswordButton", false);
    }
  }
}

// Initialize real-time validation
function initializeRealTimeValidation() {
  // Real-time Email Validation on Blur (for Registration Only)
  const registerEmailInput = document.querySelector("#registerForm #emailInput");
  if (registerEmailInput) {
    registerEmailInput.addEventListener("blur", async function () {
      const email = registerEmailInput.value.trim();
      if (email && formValidationService.validateEmail(email)) {
        const emailInUse = await authService.checkIfEmailInUse(email);
        if (emailInUse) {
          formValidationService.showError("emailInput", formValidationService.errorMessages.emailInUse);
        } else {
          formValidationService.clearError("emailInput");
        }
      }
    });
  }

  // Real-time Email and Password Validation on Blur (for Login Form)
  const emailInput = document.querySelector("#loginForm #emailInput");
  const passwordInput = document.querySelector("#loginForm #passwordInput");

  if (emailInput) {
    emailInput.addEventListener("blur", async function () {
      const email = emailInput.value.trim();
      if (email && formValidationService.validateEmail(email)) {
        const emailInUse = await authService.checkIfEmailInUse(email);
        if (!emailInUse) {
          formValidationService.showError("emailInput", formValidationService.errorMessages.emailNotFound);
        } else {
          formValidationService.clearError("emailInput");
        }
      } else if (email) {
        formValidationService.showError("emailInput", formValidationService.errorMessages.email);
      } else {
        formValidationService.clearError("emailInput");
      }
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener("blur", function () {
      const password = passwordInput.value.trim();
      if (!password) {
        formValidationService.showError("passwordInput", formValidationService.errorMessages.required);
      } else {
        formValidationService.clearError("passwordInput");
      }
    });
  }
}

// Initialize social login handlers
function initializeSocialLoginHandlers() {
  // Facebook login handler
  const handleFacebookLogin = (event) => {
    event.preventDefault();
    // Open Facebook login in new window
    const facebookWindow = window.open(
      'https://www.facebook.com/dialog/oauth?client_id=' + window.APP_CONFIG.FACEBOOK_APP_ID + '&redirect_uri=' + encodeURIComponent(window.location.origin) + '&scope=email,public_profile',
      'facebook-login',
      'width=600,height=400,scrollbars=yes,resizable=yes'
    );
  };

  // Twitter login handler
  const handleTwitterLogin = (event) => {
    event.preventDefault();
    // Open Twitter login in new window
    const twitterWindow = window.open(
      'https://api.twitter.com/oauth/authorize?oauth_token=' + window.APP_CONFIG.TWITTER_TOKEN,
      'twitter-login',
      'width=600,height=400,scrollbars=yes,resizable=yes'
    );
  };

  // Attach event listeners if elements exist
  const facebookLoginBtn = document.querySelector(".facebook-btn");
  const twitterLoginBtn = document.querySelector(".twitter-btn");

  if (facebookLoginBtn) {
    facebookLoginBtn.addEventListener("click", handleFacebookLogin);
  }

  if (twitterLoginBtn) {
    twitterLoginBtn.addEventListener("click", handleTwitterLogin);
  }
}

// Initialize newsletter subscription
function initializeNewsletterSubscription() {
  const newsletterForm = document.getElementById("newsletterSubscription");
  const emailInput = document.getElementById("email");
  const subscribeButton = document.getElementById("subscribeButton");

  if (newsletterForm && emailInput && subscribeButton) {
    // Enable/disable button based on email input
    emailInput.addEventListener("input", function () {
      const email = this.value.trim();
      subscribeButton.disabled = !email || !formValidationService.validateEmail(email);
    });

    // Handle form submission
    newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = emailInput.value.trim();
      
      if (formValidationService.validateEmail(email)) {
        // Here you would typically send the email to your newsletter service
        uiService.showSuccessMessage("Thank you for subscribing to our newsletter!");
        emailInput.value = "";
        subscribeButton.disabled = true;
      } else {
        uiService.showErrorMessage("Please enter a valid email address.");
      }
    });
  }
}

// Resize and padding when the VH is exceeded on Register Page
document.addEventListener("DOMContentLoaded", function () {
  function adjustMainWrapperPadding() {
    const mainWrapper = document.querySelector("#mainWrapper");
    if (mainWrapper) {
      const wrapperHeight = mainWrapper.scrollHeight;
      const viewportHeight = window.innerHeight;
      if (wrapperHeight > viewportHeight) {
        mainWrapper.style.paddingBottom = "94px";
      } else {
        mainWrapper.style.paddingBottom = "10px";
      }
    }
  }
  adjustMainWrapperPadding();
  window.addEventListener("resize", adjustMainWrapperPadding);
});

// Newsletter button enable/disable
// Only add if elements exist
const emailInput = document.getElementById("email");
const subscribeButton = document.getElementById("subscribeButton");
if (emailInput && subscribeButton) {
  function toggleButtonState() {
    if (emailInput.value.trim() !== "") {
      subscribeButton.disabled = false;
      subscribeButton.classList.add("enabled");
    } else {
      subscribeButton.disabled = true;
      subscribeButton.classList.remove("enabled");
    }
  }
  emailInput.addEventListener("input", toggleButtonState);
}

// FAQs
document.addEventListener("DOMContentLoaded", () => {
  const accordionButtons = document.querySelectorAll(".accordion-button");

  accordionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const accordionItem = button.closest(".accordion-item");
      const accordionCollapse = accordionItem.querySelector(
        ".accordion-collapse"
      );

      // Remove 'expanded' class from all items
      document
        .querySelectorAll(".accordion-item")
        .forEach((item) => item.classList.remove("expanded"));

      // Add 'expanded' class to the clicked item if it is not collapsed
      if (!button.classList.contains("collapsed")) {
        accordionItem.classList.add("expanded");
      }
    });
  });
});

// Show button when scrolling down
const scrollToTopButton = document.getElementById("scrollToTop");
if (scrollToTopButton) {
  window.onscroll = function () {
    if (
      document.body.scrollTop > 200 ||
      document.documentElement.scrollTop > 200
    ) {
      scrollToTopButton.style.display = "block";
    } else {
      scrollToTopButton.style.display = "none";
    }
  };

  scrollToTopButton.onclick = function () {
    scrollToTopButton.classList.add("animate-up");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(function () {
      scrollToTopButton.classList.remove("animate-up");
    }, 1200);
  };
}

// Initialize password toggle functionality
function initializePasswordToggles() {
  const togglePasswordBtns = document.querySelectorAll("#togglePassword, #togglePasswordConfirm");
  
  togglePasswordBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      const passwordField = this.previousElementSibling;
      if (passwordField && passwordField.type === "password") {
        passwordField.type = "text";
      } else if (passwordField) {
        passwordField.type = "password";
      }
    });
  });
}
