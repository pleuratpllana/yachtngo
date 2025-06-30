document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM Content Loaded - Starting boats.js");
  
  const yachtContainer = document.getElementById("yachtsContainer");
  const yachtCardTemplate = document.getElementById("yachtCardTemplate");
  const loadMoreButton = document.getElementById("loadMoreButton");
  const itemCountMessage = document.querySelector(".itemCountMessage");

  console.log("Elements found:", {
    yachtContainer: !!yachtContainer,
    yachtCardTemplate: !!yachtCardTemplate,
    loadMoreButton: !!loadMoreButton,
    itemCountMessage: !!itemCountMessage
  });

  const isMobile = () => window.innerWidth <= 768; // Function to check if the screen width is 768px or less
  let yachtsToShow = isMobile() ? 6 : 8; // Show 6 items on mobile, 8 on larger screens
  const yachtsPerLoad = 6;

  if (!yachtContainer || !yachtCardTemplate) {
    console.error("yachtCard not found.");
    return;
  }

  // Wait for yachtDataService to be available
  if (typeof yachtDataService === 'undefined') {
    console.error("yachtDataService not found. Make sure dataService.js is loaded before boats.js");
    return;
  }

  // Load yacht data from the data service
  let yachts = [];
  let orderedYachts = [];
  
  try {
    console.log("Attempting to load yacht data...");
    yachts = await yachtDataService.loadYachts();
    console.log("Raw yachts data:", yachts);
    
    if (!yachts || yachts.length === 0) {
      console.error("No yacht data loaded");
      return;
    }
    
    orderedYachts = yachtDataService.getYachtsBySize();
    console.log("Ordered yachts:", orderedYachts);
    console.log("Loaded yachts:", yachts.length);
  } catch (error) {
    console.error("Failed to load yacht data:", error);
    return;
  }

  const yachtsBySize = {
    "0-50": yachts.filter((yacht) => {
      const size = parseInt(yacht.details.size.text);
      return size >= 0 && size <= 50; // 0-50 inclusive
    }),
    "51-80": yachts.filter((yacht) => {
      const size = parseInt(yacht.details.size.text);
      return size >= 51 && size <= 80; // 51-80 inclusive
    }),
    "81+": yachts.filter((yacht) => {
      const size = parseInt(yacht.details.size.text);
      return size >= 81; // 81 and above
    }),
  };

  // --------------------------------------------------------------------

  // Create yacht card dynamically

  function createYachtCard(yacht) {
    const card = yachtCardTemplate.cloneNode(true);
    card.style.display = "block";

    const header = card.querySelector(".yachtCardHeader");
    header.style.backgroundImage = `url('${yacht.image}')`;
    card.querySelector(".yachtTitle").textContent = yacht.name;

    const detailsList = card.querySelector(".yachtDetails");
    detailsList.innerHTML = Object.entries(yacht.details)
      .filter(([key, { show }]) => show)
      .map(
        ([key, { text, icon }]) => `
          <li><img src="${icon}" class="detailIcon" alt="${key} icon"/> ${text}</li>
        `
      )
      .join("");

    const amenitiesList = card.querySelector(".yachtAmenities");
    const hasAmenities = Object.values(yacht.amenities).some(
      ({ show }) => show
    );

    amenitiesList.innerHTML = Object.entries(yacht.amenities)
      .filter(([key, { show }]) => show)
      .map(
        ([key, { text, icon }]) => `
          <li><img src="${icon}" class="detailIcon" alt="${key} icon"/> ${text}</li>
        `
      )
      .join("");

    if (hasAmenities) {
      amenitiesList.classList.add("has-amenities");
    } else {
      amenitiesList.classList.remove("has-amenities");
    }

    const extraAmenitiesList = card.querySelector(".yachtExtraAmenities");
    const hasExtraAmenities = Object.values(yacht.extraAmenities).some(
      ({ show }) => show
    );

    extraAmenitiesList.innerHTML = Object.entries(yacht.extraAmenities)
      .filter(([key, { show }]) => show)
      .map(
        ([key, { text, icon }]) => `
          <li><img src="${icon}" class="detailIcon" alt="${key} icon"/> ${text}</li>
        `
      )
      .join("");

    if (hasExtraAmenities) {
      extraAmenitiesList.classList.add("has-extra-amenities");
    } else {
      extraAmenitiesList.classList.remove("has-extra-amenities");
    }

    return card;
  }

  // --------------------------------------------------------------------

  // Handle and update display of Yachts

  function updateYachtDisplay(filter = null) {
    console.log("updateYachtDisplay called with filter:", filter);
    console.log("yachtsToShow:", yachtsToShow);
    console.log("orderedYachts length:", orderedYachts.length);
    
    yachtContainer.innerHTML = "";

    let yachtsToDisplay;

    if (filter) {
      const filteredYachts = yachts.filter((yacht) => {
        const yachtSize = parseInt(yacht.details.size.text);
        switch (filter) {
          case "1": // 0-50
            return yachtSize >= 0 && yachtSize <= 50;
          case "2": // 51-80
            return yachtSize >= 51 && yachtSize <= 80;
          case "3": // 81+
            return yachtSize >= 81;
          default:
            return true;
        }
      });

      yachtsToDisplay = filteredYachts.slice(0, yachtsToShow);

      itemCountMessage.textContent = `You have viewed ${yachtsToDisplay.length} of ${filteredYachts.length} so far.`;

      if (yachtsToShow >= filteredYachts.length) {
        loadMoreButton.textContent = "Show Less";
        loadMoreButton.removeEventListener("click", loadMore);
        loadMoreButton.addEventListener("click", showLess);
      } else {
        loadMoreButton.textContent = "Load more";
        loadMoreButton.removeEventListener("click", showLess);
        loadMoreButton.addEventListener("click", loadMore);
      }
    } else {
      yachtsToDisplay = orderedYachts.slice(0, yachtsToShow);

      itemCountMessage.textContent = `You have viewed ${yachtsToDisplay.length} of ${orderedYachts.length} so far.`;

      if (yachtsToShow >= orderedYachts.length) {
        loadMoreButton.textContent = "Show Less";
        loadMoreButton.removeEventListener("click", loadMore);
        loadMoreButton.addEventListener("click", showLess);
      } else {
        loadMoreButton.textContent = "Load more";
        loadMoreButton.removeEventListener("click", showLess);
        loadMoreButton.addEventListener("click", loadMore);
      }
    }

    console.log("yachtsToDisplay length:", yachtsToDisplay.length);
    console.log("yachtsToDisplay:", yachtsToDisplay);

    yachtsToDisplay.forEach((yacht, index) => {
      console.log(`Creating yacht card ${index + 1}:`, yacht.name);
      const yachtCard = createYachtCard(yacht);
      yachtContainer.appendChild(yachtCard);
    });

    console.log("Yacht cards created and appended to container");

    const yachtDetailsContainers = document.querySelectorAll(".yachtDetails");

    if (yachtDetailsContainers.length > 0) {
      yachtDetailsContainers[0].classList.add("firstYachtDetails");
    }
    if (yachtDetailsContainers.length > 3) {
      yachtDetailsContainers[3].classList.add("fourthYachtDetails");
    }
    if (yachtDetailsContainers.length > 5) {
      yachtDetailsContainers[5].classList.add("sixthYachtDetails");
    }
    if (yachtDetailsContainers.length > 6) {
      yachtDetailsContainers[6].classList.add("seventhYachtDetails");
    }
  }

  // --------------------------------------------------------------------

  // Handle loadMore button

  function loadMore() {
    yachtsToShow += yachtsPerLoad;
    updateYachtDisplay(
      document
        .querySelector(".dropdown-option.selected")
        ?.getAttribute("data-value")
    );
  }

  // --------------------------------------------------------------------

  // Handle showLess button

  function showLess() {
    yachtsToShow = isMobile() ? 6 : 8; // Reset based on screen size
    updateYachtDisplay(
      document
        .querySelector(".dropdown-option.selected")
        ?.getAttribute("data-value")
    );
  }

  // Handle filterYachtsDropdown options
  function setupDropdown() {
    const yachtContainer = document.getElementById("yachtsContainer"); // Ensure yachtContainer is defined here

    document
      .getElementById("dropdownHeader")
      .addEventListener("click", function () {
        const dropdown = document.getElementById("yachtsDropdown");
        const customDropdown = document.getElementById("filterYachtsDropdown");
        const displayElement = document.getElementById("selectedOptionDisplay");
        const arrow = document.querySelector(".arrow");

        dropdown.classList.toggle("open");

        if (dropdown.classList.contains("open")) {
          arrow.classList.add("open");
          customDropdown.style.maxHeight = customDropdown.scrollHeight + "px";
          displayElement.classList.add("hidden");

          // Push yachts down on mobile while considering the existing negative margin
          if (window.innerWidth <= 768) {
            const dropdownHeight = customDropdown.scrollHeight;
            const adjustedMargin = -100 + dropdownHeight + 10;
            yachtContainer.style.marginTop = `${adjustedMargin}px`;
          }
        } else {
          arrow.classList.remove("open");
          customDropdown.style.maxHeight = "40px";
          displayElement.classList.remove("hidden");

          // Reset margin on closing
          if (window.innerWidth <= 768) {
            yachtContainer.style.marginTop = "-100px";
          }
        }
      });

    document.querySelectorAll(".dropdown-option").forEach((option) => {
      option.addEventListener("click", function () {
        if (this.classList.contains("always-visible")) return;

        selectedOption = this.getAttribute("data-value");
        document
          .querySelectorAll(".dropdown-option")
          .forEach((opt) => opt.classList.remove("selected"));
        this.classList.add("selected");

        const displayElement = document.getElementById("selectedOptionDisplay");
        displayElement.classList.remove("hidden");
        displayElement.style.display = "block";
      });
    });

    document
      .getElementById("searchButton")
      .addEventListener("click", function () {
        const displayElement = document.getElementById("selectedOptionDisplay");
        const selectedOption = document.querySelector(
          ".dropdown-option.selected"
        );

        if (selectedOption) {
          const selectedValue = selectedOption.getAttribute("data-value");
          const selectedText = selectedOption.textContent;

          if (displayElement.textContent.includes(selectedText)) {
            displayElement.textContent = `The category you are searching for is already being displayed. ("${selectedText}")`;
          } else {
            displayElement.textContent = `Currently viewing: ${selectedText} sizes`;
          }

          yachtsToShow = isMobile() ? 6 : 8;
          updateYachtDisplay(selectedValue);

          document.getElementById("yachtsDropdown").classList.remove("open");
          document.getElementById("filterYachtsDropdown").style.maxHeight =
            "40px";
          displayElement.classList.remove("hidden");
          document.querySelector(".arrow").classList.remove("open");

          // Set margin to -50px after search button is clicked
          if (window.innerWidth <= 768) {
            yachtContainer.style.marginTop = "-80px";
          }
        } else {
          displayElement.textContent = "No option selected.";
          updateYachtDisplay();
        }
      });

    document
      .getElementById("filterYachtsDropdown")
      .addEventListener("click", function (event) {
        if (!event.target.classList.contains("dropdown-option")) {
          event.stopPropagation();
        }
      });
  }

  console.log("About to call updateYachtDisplay() for initial display");
  updateYachtDisplay(); // Initial display of yachts
  console.log("Initial updateYachtDisplay() called");
  
  console.log("About to call setupDropdown()");
  setupDropdown();
  console.log("setupDropdown() called");

  window.addEventListener("resize", () => {
    yachtsToShow = isMobile() ? 6 : 8;
    updateYachtDisplay(
      document
        .querySelector(".dropdown-option.selected")
        ?.getAttribute("data-value")
    );
  });
  
  console.log("boats.js initialization complete");
});
