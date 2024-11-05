const apiKey = 'dc0a940f8f01a7017283890312ace3c7';
    let data; // Declare data as a global variable

    async function getWeather() {
      const weatherContainer = document.getElementById('weather-container');
      const cityInput = document.getElementById('cityInput').value;

      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`);
        data = await response.json(); // Assign the response to the global data variable

        // Check if the city is found
        if (data.cod === '404') {
          document.getElementById('error-message').innerText = 'City not found. Please try again.';
          clearWeatherData();
          return;
        }

        // Check if essential properties are present in the response data
        if (!data.main || !data.main.temp || !data.weather || !data.weather[0]) {
          console.error('Unexpected response format:', data);
          document.getElementById('error-message').innerText = 'Unexpected response format. Please try again.';
          clearWeatherData();
          return;
        }

        // Update the UI with fetched data
        document.getElementById('error-message').innerText = '';
        document.getElementById('city-name').innerText = data.name;
        document.getElementById('temperature').innerText = `${Math.round(data.main.temp)}°C`;
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
        document.getElementById('weather-description').innerText = data.weather[0].description;

        // Display additional details by default
        displayDetails();

        // Display current date and month
        const currentDate = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = currentDate.toLocaleDateString('en-US', options);
        document.getElementById('date').innerText = formattedDate;

        // Set background based on weather conditions
        setSeasonalBackground(data.weather[0].main);

        // Set background image after fetching the details
        setDynamicBackground('https://t4.ftcdn.net/jpg/04/97/80/99/360_F_497809944_FMo3DO6j7XSlb9rZKOlnqaaWoJhuZXBm.jpg');

        // Trigger the 3D flip animation
        weatherContainer.classList.add('flip');

        // Reset the flip class after the animation completes
        setTimeout(() => {
          weatherContainer.classList.remove('flip');
        }, 500);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('error-message').innerText = 'An error occurred. Please try again.';
        clearWeatherData();
      }
    }

    function clearWeatherData() {
      document.getElementById('city-name').innerText = '';
      document.getElementById('temperature').innerText = '';
      document.getElementById('weather-icon').src = '';
      document.getElementById('weather-description').innerText = '';
      document.getElementById('date').innerText = '';
      // Clear info containers
      const infoContainers = document.querySelectorAll('.info-container');
      infoContainers.forEach(container => container.innerText = ''); // Clear the content of info containers
    }

    function setSeasonalBackground(weatherCondition) {
      const body = document.body;

      switch (weatherCondition) {
        case 'Clear':
          body.style.background = 'linear-gradient(to bottom, #f39c12, #e67e22)';
          break;
        case 'Clouds':
          body.style.background = 'linear-gradient(to bottom, #ecf0f1, #bdc3c7)';
          break;
        case 'Rain':
        case 'Drizzle':
          body.style.background = 'linear-gradient(to bottom, #3498db, #2980b9)';
          break;
        case 'Snow':
          body.style.background = 'linear-gradient(to bottom, #ecf0f1, #bdc3c7)';
          break;
        default:
          body.style.background = 'linear-gradient(to bottom, #3498db, #2980b9)';
      }
    }

    function setDynamicBackground(imageUrl) {
      document.body.style.background = `url('${imageUrl}')`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
    }

    // Additional functions for button-wise displaying
    function displayDetails() {
      displayInfo("Min Temp", `${Math.round(data.main.temp_min)}°C`, 'min-temp');
      displayInfo("Max Temp", `${Math.round(data.main.temp_max)}°C`, 'max-temp');
      displayInfo("Humidity", `${data.main.humidity}%`, 'humidity');
      displayInfo("Wind", `${data.wind.speed}m/s`, 'wind');
      // Removed pressure, visibility, sunrise, sunset from display
    }

    function displayInfo(title, content, containerId) {
      const infoContainer = document.getElementById(containerId);
      infoContainer.innerHTML = `<strong>${title}:</strong> ${content}`;
    }

    function toggleDetails() {
      const detailsContainers = document.querySelectorAll('.info-container');
      detailsContainers.forEach(container => container.classList.toggle('hidden'));
    }
