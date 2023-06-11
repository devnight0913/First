// Create the map and center it on the first marker
function createMap(mapContainer1) {
  var map = new google.maps.Map(mapContainer1, {
    zoom: 9,
    center: new google.maps.LatLng(-34.397, 150.644),
  });
  return map;
}

// Add marker to the map
function addMarker(location, map) {
  var marker = new google.maps.Marker({
    position: location,
    map: map,
  });
  map.panTo(location);
}

// Geocode address and add marker to the map
function geocodeAddress(address, map) {
  var geocoder = new google.maps.Geocoder();

  if (!address || typeof address !== "object") {
    console.error("Invalid address:", address);
    return;
  }

  var fullAddress =
    address.street +
    ", " +
    address.city +
    ", " +
    address.state +
    ", " +
    address.postalCode;

  geocoder.geocode({ address: fullAddress }, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK || status === "OK") {
      var location = results[0].geometry.location;

      console.log(results);
      // Add marker to the map
      addMarker(location, map);
    } else {
      console.error("Geocoding failed. Status:", status);
    }
  });
}
// Get formatted address string
function getFormattedAddress(address) {
  if (!address || typeof address !== "object") {
    console.error("Invalid address:", address);
    return "";
  }

  var formattedAddress =
    address.street +
    ", " +
    address.city +
    ", " +
    address.state +
    ", " +
    address.postalCode;
  return formattedAddress;
}

// Fetch data and populate the record boxes
function fetchData() {
  var apiUrl = "https://www.care-wise.com:3000/account";
  var totalRecord = document.querySelector(".total-record");
  var mapContainer = document.querySelector(".map-container1");
  var map = createMap(mapContainer); // Create the map

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ city: "Mesa" }), // Pass the city as 'Mesa'
  })
    .then((response) => response.json())
    .then((data) => {
      totalRecord.innerHTML = "";
      if (Array.isArray(data) && data.length > 0) {
        data.forEach((account) => {
          // Create facility info elements
          var facilityName = document.createElement("h2");
          facilityName.textContent = account.Name;
          facilityName.className = "facility-name";

          var facilityAddress = document.createElement("p");
          facilityAddress.textContent = getFormattedAddress(
            account.Facility_Address__c
          );
          facilityAddress.className = "facility-address";
          var recordImage = document.createElement("img");
          recordImage.src = account.Short_Public_Image_URL__c;
          recordImage.className = "record-image1 rounded";

          // Select the image container element
          var imageContainer = document.createElement("div");
          imageContainer.className = "image-container1";

          // Append the record image to the image container
          imageContainer.appendChild(recordImage);

          var infoCol = document.createElement("div");
          infoCol.className = "column-info1";

          var imgCol = document.createElement("div");
          imgCol.className = "column-image1";

          // Append facility info elements to record container
          infoCol.appendChild(facilityName);
          infoCol.appendChild(facilityAddress);

          imgCol.appendChild(imageContainer);

          var recordRow = document.createElement("div");
          recordRow.className = "row";

          recordRow.appendChild(imgCol);
          recordRow.appendChild(infoCol);

          var containerFluid = document.createElement("div");
          containerFluid.className = "container-fluid";

          containerFluid.appendChild(recordRow);

          var recordContainer = document.createElement("div");
          recordContainer.className = "record-box1";

          recordContainer.appendChild(containerFluid);

          totalRecord.appendChild(recordContainer);

          // Geocode and add marker for each address
          geocodeAddress(account.Facility_Address__c, map);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Initialize the map after the Google Maps API script is loaded
function initMap() {
  // Call the fetchData function to populate the data and display the map
  fetchData();
}