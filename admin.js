


const summary = document.getElementById("summary");
const centersList = document.getElementById("centersList");
const addCenterForm = document.getElementById("addCenterForm");
let currentCenterIndex = -1;

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  location.replace("./index.html");
});


fetchcenters()
let centersData=[];
async function fetchcenters() {
  const response = await fetch(`https://devray1.onrender.com/auth/getallcenter`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },
   
  });
  centersData = await response.json();
  console.log(centersData)
  displayCenters();
  displayDashboard()
}


// Display the admin dashboard summary
function displayDashboard() {
  summary.innerHTML = `
    <p>Total Centers: ${centersData.length}</p>
    <p>Total Slots Available: ${calculateTotalSlots()}</p>
  `;
}

// Calculate the total slots available across all centers
function calculateTotalSlots() {
  let totalSlots = 0;
  centersData.forEach((center) => {
    totalSlots += center.slot;
  });
  console.log(totalSlots)
  return totalSlots;
}

// Display the manage centers table
function displayCenters() {
  centersList.innerHTML = "";
  centersData.forEach((center, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${center.name}</td>
      <td>${center.address}</td>
      <td>${center.contact}</td>
      <td>${center.slot}</td>
      <td>${center.date}</td>
      <td>
        <button onclick="editCenter(${index})">Edit</button>
        <button onclick="deleteCenter('${center.name}')">Delete</button>
      </td>
    `;
    centersList.appendChild(row);
  });
}

// Add or update a vaccination center
async function addOrUpdateCenter(event) {
  event.preventDefault();

  // Get the form input values
  const name = document.getElementById("centerName").value;
  const address = document.getElementById("centerAddress").value;
  const contact = document.getElementById("centerContact").value;
  const date = document.getElementById("date").value;
  const slots = parseInt(document.getElementById("centerSlots").value);

  // Create a new center object
  const newCenter = {
    name: name,
    address: address,
    contact: contact,
    slot: slots,
    date:date
  };
  // async function addcenters() {
  const response = await fetch(`https://devray1.onrender.com/auth/addcenter`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },
   body: JSON.stringify(newCenter),
  });
  centersData = await response.json();
  console.log(centersData)
    fetchcenters();
// }

  // if (currentCenterIndex === -1) {
  //   // Add a new center
  //   centersData.push(newCenter);
  // } else {
  //   // Update an existing center
  //   centersData[currentCenterIndex] = newCenter;
  //   currentCenterIndex = -1; // Reset currentCenterIndex after update
  // }

  // // Clear the form fields
  // addCenterForm.reset();

  // // Display the updated centers table and dashboard summary

  // displayDashboard();
}

// Edit a vaccination center
function editCenter(index) {
  const center = centersData[index];
  currentCenterIndex = index; // Set the currentCenterIndex to the edited center index

  // Populate the form fields with the center details
  document.getElementById("centerName").value = center.name;
  document.getElementById("centerAddress").value = center.address;
  document.getElementById("centerContact").value = center.contact;
  document.getElementById("date").value = center.date;
  document.getElementById("centerSlots").value = center.slot;

  // Change the form button text to 'Update Center'
  document.getElementById("centerFormBtn").textContent = "Update Center";
}

// Delete a vaccination center
async function deleteCenter(index) {
  // centersData.splice(index, 1);
  console.log(index)

    const response = await fetch(`https://devray1.onrender.com/auth/deletecenter`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({ "name": index })
   
  });
  centersData = await response.json();
  console.log(centersData)
  // displayCenters();

  // Display the updated centers table and dashboard summary
  fetchcenters();
  // displayDashboard();
}

// Event listener for form submission
addCenterForm.addEventListener("submit", addOrUpdateCenter);

// Initial display on page load
displayDashboard();
displayCenters();
