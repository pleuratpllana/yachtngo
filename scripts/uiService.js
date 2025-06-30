// UI Service for handling UI interactions and DOM manipulations
class UIService {
  constructor() {
    this.initializeUI();
  }

  // Initialize UI components
  initializeUI() {
    this.initializeMobileProfile();
    this.initializePasswordToggles();
    this.initializeHeaderLinks();
    this.initializeScrollToTop();
  }

  // Initialize mobile profile dropdown
  initializeMobileProfile() {
    $("#mobileProfileIcon").on("click", function () {
      $("#mobileProfileDropdown").fadeToggle();
    });

    $(document).on("click", function (e) {
      if (!$(e.target).closest("#mobileProfileIcon, #mobileProfileDropdown").length) {
        $("#mobileProfileDropdown").fadeOut();
      }
    });
  }

  // Initialize password toggle functionality
  initializePasswordToggles() {
    $("#togglePassword, #togglePasswordConfirm").on("click", function () {
      const passwordField = $(this).prev("input");
      const type = passwordField.attr("type") === "password" ? "text" : "password";
      passwordField.attr("type", type);
    });
  }

  // Initialize header links based on authentication status
  initializeHeaderLinks() {
    const userLoggedIn = authService.isUserLoggedIn();

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
      if (loginLinkDesktop) loginLinkDesktop.style.display = "none";
      if (registerLinkDesktop) registerLinkDesktop.style.display = "none";
      if (logoutLinkDesktop) logoutLinkDesktop.style.display = "inline-block";
    } else {
      if (loginLinkDesktop) loginLinkDesktop.style.display = "inline-block";
      if (registerLinkDesktop) registerLinkDesktop.style.display = "inline-block";
      if (logoutLinkDesktop) logoutLinkDesktop.style.display = "none";
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

    // Attach logout event listeners
    this.attachLogoutListeners(logoutLinkDesktop, logoutLinkMobile);
  }

  // Attach logout event listeners
  attachLogoutListeners(logoutLinkDesktop, logoutLinkMobile) {
    if (logoutLinkDesktop) {
      logoutLinkDesktop.addEventListener("click", (event) => {
        event.preventDefault();
        authService.handleLogout();
      });
    }

    if (logoutLinkMobile) {
      logoutLinkMobile.addEventListener("click", (event) => {
        event.preventDefault();
        authService.handleLogout();
      });
    }
  }

  // Initialize scroll to top functionality
  initializeScrollToTop() {
    const scrollToTopButton = document.getElementById("scrollToTop");
    if (scrollToTopButton) {
      scrollToTopButton.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      });
    }
  }

  // Show success message
  showSuccessMessage(message) {
    // No default alert. Implement custom UI if needed.
    // alert(message);
  }

  // Show error message
  showErrorMessage(message) {
    // No default alert. Implement custom UI if needed.
    // alert(message);
  }

  // Redirect to page
  redirectTo(page) {
    window.location.href = page;
  }

  // Toggle button state
  toggleButtonState(buttonId, disabled = false) {
    const button = document.getElementById(buttonId);
    if (button) {
      button.disabled = disabled;
    }
  }

  // Adjust main wrapper padding
  adjustMainWrapperPadding() {
    const mainWrapper = document.querySelector(".mainWrapper");
    if (mainWrapper) {
      const headerHeight = document.querySelector("header")?.offsetHeight || 0;
      mainWrapper.style.paddingTop = `${headerHeight}px`;
    }
  }
}

// Create a global instance
window.uiService = new UIService(); 