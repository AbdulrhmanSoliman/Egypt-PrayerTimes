// All country needed
let countryArrow = document.querySelector(".country .arrow");
let countiesInput = document.querySelector(".country input");
let allCountries = document.querySelectorAll(".country ul li");
// All city needed
let cityArrow = document.querySelector(".city .arrow");
let citiesInput = document.querySelector(".city input");

if (citiesInput.disabled) {
  cityArrow.style.display = "none";
}
// related with country
countryArrow.addEventListener("click", () => {
  allCountries.forEach((e) => {
    e.parentElement.classList.toggle("active");
    countryArrow.classList.toggle("rotate");
  });
});

allCountries.forEach((li) => {
  li.addEventListener("click", () => {
    li.parentElement.classList.remove("active");
    countryArrow.classList.remove("rotate");
    countiesInput.value = li.innerText;
    citiesInput.disabled = false;
    cityArrow.style.display = "grid";
  });
});
// get city json data
fetch("https://abdulrhmansoliman.github.io/Egypt-PrayerTimes/cities.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    let allData = data[2].data;
    allData.forEach((e) => {
      let lis = document.createElement("li");
      lis.innerHTML = e.city_name_en;
      document.querySelector(".city ul").appendChild(lis);
    });
    // filter cities when typing in the input
    let allCities = document.querySelectorAll(".city ul li");
    citiesInput.addEventListener("input", () => {
      let regex = new RegExp(`^${citiesInput.value}(.)*`, "ig");
      allCities.forEach((c) => {
        if (c.innerText.match(regex) != c.innerText) {
          c.classList.add("hide");
        } else {
          c.classList.remove("hide");
        }
        c.parentElement.classList.add("active");
        cityArrow.classList.add("rotate");
      });
    });
    // Select city
    allCities.forEach((li) => {
      li.addEventListener("click", () => {
        li.parentElement.classList.remove("active");
        cityArrow.classList.remove("rotate");
        citiesInput.value = li.innerText;
        // get times
        getTimes(countiesInput.value, citiesInput.value);
      });
    });
  });

cityArrow.addEventListener("click", () => {
  document.querySelector(".city ul").classList.toggle("active");
  cityArrow.classList.toggle("rotate");
});

let allDays = document.querySelector(".days");

// get location by country and city
function getTimes(country, city) {
  allDays.innerHTML = "";
  let date = new Date();
  fetch(
    `https://api.aladhan.com/v1/calendarByCity/${date.getFullYear()}/${
      date.getMonth() + 1
    }?country=${country}&city=${city}&method=5`
  )
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      filtered(res);
    });
}

// get location by corrdination
let locationBtn = document.querySelector(".location_btn");
locationBtn.addEventListener("click", getLocation);

function getLocation() {
  allDays.innerHTML = "";
  navigator.geolocation.getCurrentPosition((position) => {
    let date = new Date();
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    fetch(
      `https://api.aladhan.com/v1/calendar/${date.getFullYear()}/${
        date.getMonth() + 1
      }?latitude=${lat}&longitude=${long}&method=5`
    )
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        filtered(res);
      });
  });
}

function filtered(res) {
  let date = new Date();
  let allData = res.data;
  let filtered = allData.filter((d) => {
    return d.date.gregorian.day >= date.getDate();
  });
  filtered.length = 7;
  filtered.forEach((f) => {
    setAllPrayers(f);
  });
}

function setAllPrayers(data) {
  let content = `
  <li class="day">
  <div class="date">
    <p>${data.date.gregorian.weekday.en}</p>
    <span>${data.date.readable}</span>
  </div>
  <ul class="prayers">
    <li>
      <p>Fajr</p>
      <span>${data.timings.Fajr}</span>
    </li>
    <li>
      <p>Sunrise</p>
      <span>${data.timings.Sunrise}</span>
    </li>
    <li>
      <p>Dhuhr</p>
      <span>${data.timings.Dhuhr}</span>
    </li>
    <li>
      <p>Asr</p>
      <span>${data.timings.Asr}</span>
    </li>
    <li>
      <p>Maghrib</p>
      <span>${data.timings.Maghrib}</span>
    </li>
    <li>
      <p>Isha</p>
      <span>${data.timings.Isha}</span>
    </li>
  </ul>
</li>
  `;
  allDays.innerHTML += content;
}
