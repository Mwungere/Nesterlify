function formatStayDate(date) {
    return new Date(date).toISOString().split("T")[0];
  }
  
  document.addEventListener('DOMContentLoaded', async () => {
    const offersContainer = document.getElementById("offers-container");
    let stayCount = 0;
    const maxStays = 3;
    const today = formatStayDate(new Date());
    const checkoutDate = formatStayDate(new Date().setDate(new Date().getDate() + 3)); // example: 3 days stay
  
    try {
      // Fetch room offers
      const roomOfferRequestResponse = await fetch("http://localhost:3000/api/room_offer_requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            location: "NYC",
            checkin_date: today,
            checkout_date: checkoutDate,
            guests: [
              { type: "adult" },
              { type: "adult" },
              { age: 1 },
            ],
            room_type: "double",
          },
        }),
      });
  
      const roomOfferRequestData = await roomOfferRequestResponse.json();
      const roomOfferRequestId = roomOfferRequestData.data.id;
  
      const response = await fetch(`http://localhost:3000/api/room_offers/${roomOfferRequestId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
  
      const data = await response.json();
  
      if (data.offers && data.offers.length > 0) {
        data.offers.forEach((offer) => {
          if (stayCount < maxStays) {
            const roomCard = document.createElement('div');
            roomCard.classList.add('col-lg-4', 'col-md-6', 'wow', 'fadeInUp');
            roomCard.setAttribute('data-wow-delay', '0.1s');
  
            const { total_currency, total_amount } = offer;
            const { hotel, room_type, amenities, checkin_date, checkout_date } = offer.details;
  
            roomCard.innerHTML = `
              <div class="room-item shadow rounded overflow-hidden">
                <div class="position-relative">
                  <img class="img-fluid logo-image" src="${hotel.logo_url}" alt="${hotel.name}">
                  <small class="position-absolute start-0 top-100 translate-middle-y bg-primary text-white rounded py-1 px-3 ms-4">${total_currency} ${total_amount}</small>
                </div>
                <div class="p-4 mt-2">
                  <div class="d-flex justify-content-between mb-3">
                    <h5 class="mb-0">${hotel.name}</h5>
                    <div class="ps-2">
                      <small class="fa fa-star text-primary"></small>
                      <small class="fa fa-star text-primary"></small>
                      <small class="fa fa-star text-primary"></small>
                      <small class="fa fa-star text-primary"></small>
                      <small class="fa fa-star text-primary"></small>
                    </div>
                  </div>
                  <div class="d-flex mb-3">
                    <small class="border-end me-3 pe-3"><i class="fa fa-bed text-primary me-2"></i>${room_type}</small>
                    <small class="border-end me-3 pe-3"><i class="fa fa-bath text-primary me-2"></i>${amenities.bathroom}</small>
                    <small><i class="fa fa-wifi text-primary me-2"></i>${amenities.wifi ? 'Wifi' : 'No Wifi'}</small>
                  </div>
                  <p class="text-body mb-3">Stay from ${formatStayDate(checkin_date)} to ${formatStayDate(checkout_date)} at ${hotel.location}</p>
                  <div class="d-flex justify-content-between">
                    <button class="btn btn-sm btn-primary rounded py-2 px-4">View Detail</button>
                    <button class="btn btn-sm btn-dark rounded py-2 px-4">Book Now</button>
                  </div>
                </div>
              </div>
            `;
      
            offersContainer.appendChild(roomCard);
            stayCount++;
          }
        });
      } else {
        offersContainer.innerHTML = "<pNo room offers found!</p>";
      }
    } catch (error) {
      console.error("Error fetching room offers:", error);
      offersContainer.innerHTML = `<p>Error fetching room offers: ${error.message}</p>`;
    }
  });
  