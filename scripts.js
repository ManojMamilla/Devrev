if (localStorage.getItem("devray" )== null) {
  window.location.href = "./index.html";
}

const locationDropdown = document.getElementById('locationDropdown');
const searchBtn = document.getElementById('searchBtn');
const centersList = document.getElementById('centersList');
const centers = document.getElementById('centers');
const bookingForm = document.getElementById('bookingForm');
const slotForm = document.getElementById('slotForm');
const selectedCenterInput = document.getElementById('selectedCenter');
const selectedDateInput = document.getElementById('selectedDate');

let bookedSlots = 0;

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  location.replace("./index.html");
});

fetchCenters();
async function fetchCenters() {
  const response = await fetch(`https://devray1.onrender.com/auth/getallcenter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const centersData = await response.json();
  displayLocations(centersData);
}

function displayLocations(centersData) {
  let vaccinationCenters = [];

  centersData.forEach(center => {
    vaccinationCenters.push(center.address);
  });

  const uniqueLocations = [...new Set(vaccinationCenters)];

  locationDropdown.innerHTML = '';

  uniqueLocations.forEach(location => {
    const optionElement = document.createElement('option');
    optionElement.textContent = location;
    locationDropdown.appendChild(optionElement);
  });
}

locationDropdown.addEventListener('change', () => {
  const selectedLocation = locationDropdown.value;
  searchBtn.disabled = selectedLocation === '';
});

searchBtn.addEventListener('click', async() => {
  const selectedLocation = locationDropdown.value;

  const response = await fetch(`https://devray1.onrender.com/auth/get_loc_center`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ "address": selectedLocation })
  });

  const selectedCenters = await response.json();

  if (selectedLocation !== '') {
    centers.innerHTML = '';

    selectedCenters.forEach(result => {
      const listItem = document.createElement('li');
      listItem.textContent = `${result.name} : Date: ${result.date} : Slots Available: ${result.slot}`;
      listItem.addEventListener('click', () => {
        selectedCenterInput.value = result.name;
        selectedDateInput.value = result.date;
        showBookingForm(result.name);
      });
      centers.appendChild(listItem);
    });

    centersList.classList.remove('hide');
  }
});

function showBookingForm() {
  centersList.classList.add('hide');
  bookingForm.classList.remove('hide');
}

function updateRemainingSlotsCount() {
  const remainingSlotsCount = 10 - bookedSlots;
  const remainingSlotsElement = document.getElementById('remainingSlots');
  remainingSlotsElement.textContent = remainingSlotsCount.toString();
}

slotForm.addEventListener('submit', async(event) => {
  event.preventDefault();

  if (bookedSlots >= 10) {
    alert("You have reached the maximum limit of 10 slots per day.");
    return;
  }

  const name = document.getElementById('name').value;
  const age = document.getElementById('age').value;
  const selectedCenter = selectedCenterInput.value;
  const selectedDate = selectedDateInput.value;
  const selectedLocation = locationDropdown.value;

  const bookingStatus = document.getElementById('bookingStatus');
  bookingStatus.innerHTML = `
    <h2 style="color: green;">Booking Successful!</h2>
    <div class="booking-details">
      <h3>Booking Details</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Age:</strong> ${age}</p>
      <p><strong>Vaccination Center:</strong> ${selectedCenter} , ${selectedLocation}</p>
      <p><strong>Date:</strong> ${selectedDate}</p>
    </div>
    <p>Do you want to book another slot?</p>
    <button id="bookAnotherBtn">Yes</button>
    <button id="cancelBookingBtn">No</button>
  `;
   const response = await fetch(`https://devray1.onrender.com/auth/bookslot`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },
   body: JSON.stringify({name:selectedCenter}),
  });
  centersData = await response.json();
  console.log(centersData)
  bookingStatus.classList.remove('hide');

  bookedSlots++;
  updateRemainingSlotsCount();

  const bookAnotherBtn = document.getElementById('bookAnotherBtn');
  bookAnotherBtn.addEventListener('click', () => {
    bookingStatus.innerHTML = '';
    bookingStatus.classList.add('hide');
    resetBookingForm();
  });

  const cancelBookingBtn = document.getElementById('cancelBookingBtn');
  cancelBookingBtn.addEventListener('click', () => {
    bookingStatus.innerHTML = '<p>Thank you for booking!</p>';
  });
});

function resetBookingForm() {
  slotForm.reset();
  selectedCenterInput.value = '';
  selectedDateInput.value = '';
}

updateRemainingSlotsCount();
