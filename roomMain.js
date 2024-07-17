document.addEventListener('DOMContentLoaded', async () => {
    const offersContainer = document.getElementById("offers-container");
    const maxRooms = 3; // Adjust the maximum number of rooms to display
    const today = new Date().toISOString().split("T")[0];
  
    try {
      // Step 1: Perform a request to initiate accommodation search
      const offerRequestResponse = await fetch("http://localhost:3000/api/accommodation_search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: {
            longitude: -0.1416,
            latitude: 51.5071,
            radius: 5
          },
          check_in_date: today,
          check_out_date: calculateReturnDate(today, 3)
        }),
      });
  
      const offerRequestData = await offerRequestResponse.json();
      const offerRequestId = offerRequestData.data.id;
  
      // Step 2: Retrieve offers based on the request ID
      const response = await fetch(`http://localhost:3000/api/accommodations/${offerRequestId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
  
      const data = await response.json();
  
      if (data.accommodations && data.accommodations.length > 0) {
        data.accommodations.slice(0, maxRooms).forEach(room => {
          const roomCard = createRoomCard(room); // Create a room card based on the returned data
          offersContainer.appendChild(roomCard);
        });
      } else {
        offersContainer.innerHTML = "<p>No accommodations found!</p>";
      }
    } catch (error) {
      console.error("Error fetching accommodations:", error);
      offersContainer.innerHTML = `<p>Error fetching accommodations: ${error.message}</p>`;
    }
  });
  
  // Function to calculate return date
  function calculateReturnDate(startDate, daysToAdd) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString().split("T")[0];
  }
  
  // Function to create a room card
  function createRoomCard(room) {
    const { name, description, price } = room;
  
    const roomCard = document.createElement('div');
    roomCard.classList.add('col-lg-4', 'col-md-6', 'wow', 'fadeInUp');
    roomCard.setAttribute('data-wow-delay', '0.1s');
  
    roomCard.innerHTML = `
      <div class="room-item shadow rounded overflow-hidden">
        <div class="p-4 mt-2">
          <div class="d-flex justify-content-between mb-3">
            <h5 class="mb-0">${name}</h5>
            <div class="ps-2">
              <small class="fa fa-dollar text-primary"></small>
              <small class="fa fa-dollar text-primary"></small>
              <small class="fa fa-dollar text-primary"></small>
              <small class="fa fa-dollar text-primary"></small>
              <small class="fa fa-dollar text-primary"></small>
            </div>
          </div>
          <p class="text-body mb-3">${description}</p>
          <div class="d-flex justify-content-between">
            <button class="btn btn-sm btn-primary rounded py-2 px-4">View Detail</button>
            <button class="btn btn-sm btn-dark rounded py-2 px-4">Book Now</button>
          </div>
        </div>
      </div>
    `;
  
    return roomCard;
  }
  