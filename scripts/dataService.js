// Data Service for handling yacht data
class YachtDataService {
  constructor() {
    this.yachts = [];
    this.isLoaded = false;
  }

  async loadYachts() {
    try {
      console.log("Loading yacht data from ./data/yachts.json");
      const response = await fetch('./data/yachts.json');
      if (!response.ok) {
        throw new Error(`Failed to load yacht data: ${response.status} ${response.statusText}`);
      }
      this.yachts = await response.json();
      this.isLoaded = true;
      console.log(`Successfully loaded ${this.yachts.length} yachts`);
      return this.yachts;
    } catch (error) {
      console.error('Error loading yacht data:', error);
      return [];
    }
  }

  getYachts() {
    return this.yachts;
  }

  getYachtsBySize() {
    const yachtsBySize = {
      "0-50": this.yachts.filter((yacht) => {
        const size = parseInt(yacht.details.size.text);
        return size >= 0 && size <= 50;
      }),
      "51-80": this.yachts.filter((yacht) => {
        const size = parseInt(yacht.details.size.text);
        return size >= 51 && size <= 80;
      }),
      "81+": this.yachts.filter((yacht) => {
        const size = parseInt(yacht.details.size.text);
        return size >= 81;
      }),
    };

    return [
      ...yachtsBySize["0-50"],
      ...yachtsBySize["51-80"],
      ...yachtsBySize["81+"],
    ];
  }
}

// Create a global instance
window.yachtDataService = new YachtDataService();
console.log("YachtDataService initialized"); 