function calculateReturnDate(startDate, daysToAdd) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split("T")[0];
}

document.addEventListener('DOMContentLoaded', async () => {
  const offersContainer = document.getElementById("offers-container");
  let flightCount = 0;
  const maxFlights = 3;
  const today = new Date().toISOString().split("T")[0];

  try {
    const offerRequestResponse = await fetch("http://localhost:3000/api/offer_requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          slices: [
            {
              origin: "NYC",
              destination: "ATL",
              departure_date: today,
            },
            {
              origin: "ATL",
              destination: "NYC",
              departure_date: calculateReturnDate(today, 11),
            },
          ],
          passengers: [
            { type: "adult" },
            { type: "adult" },
            { age: 1 },
          ],
          cabin_class: "business",
        },
      }),
    });

    const offerRequestData = await offerRequestResponse.json();
    const offerRequestId = offerRequestData.data.id;

    const response = await fetch(`http://localhost:3000/api/offers/${offerRequestId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await response.json();

    if (data.offers && data.offers.length > 0) {
      data.offers.forEach((offer) => {
        offer.slices.forEach((slice) => {
          slice.segments.forEach((segment) => {
            if (flightCount < maxFlights) {
              const flightCard = document.createElement('div');
              flightCard.classList.add('col-lg-4', 'col-md-6', 'wow', 'fadeInUp');
              flightCard.setAttribute('data-wow-delay', '0.1s');

              const { total_currency, total_amount } = offer;
              const { origin, destination, operating_carrier, duration, aircraft } = segment;

              flightCard.innerHTML = `
                <div class="room-item shadow rounded overflow-hidden">
                  <div class="position-relative">
                    <img class="img-fluid logo-image" src="${operating_carrier.logo_symbol_url}" alt="${operating_carrier.name}">
                    <small class="position-absolute start-0 top-100 translate-middle-y bg-primary text-white rounded py-1 px-3 ms-4">${total_currency} ${total_amount}</small>
                  </div>
                  <div class="p-4 mt-2">
                    <div class="d-flex justify-content-between mb-3">
                      <h5 class="mb-0">${operating_carrier.name}</h5>
                      <div class="ps-2">
                        <small class="fa fa-star text-primary"></small>
                        <small class="fa fa-star text-primary"></small>
                        <small class="fa fa-star text-primary"></small>
                        <small class="fa fa-star text-primary"></small>
                        <small class="fa fa-star text-primary"></small>
                      </div>
                    </div>
                    <div class="d-flex mb-3">
                      <small class="border-end me-3 pe-3"><i class="fa fa-bed text-primary me-2"></i>${aircraft.name}</small>
                      <small class="border-end me-3 pe-3"><i class="fa fa-bath text-primary me-2"></i>${duration}</small>
                      <small><i class="fa fa-wifi text-primary me-2"></i>Wifi</small>
                    </div>
                    <p class="text-body mb-3">Flight from ${origin.city_name} (${origin.iata_city_code}) to ${destination.city_name} (${destination.iata_city_code})</p>
                    <div class="d-flex justify-content-between">
                      <button class="btn btn-sm btn-primary rounded py-2 px-4">View Detail</button>
                      <button class="btn btn-sm btn-dark rounded py-2 px-4">Book Now</button>
                    </div>
                  </div>
                </div>
              `;
        
              offersContainer.appendChild(flightCard);
              flightCount++;
            }
          });
        });
      });
    } else {
      offersContainer.innerHTML = "<p>No offers found!</p>";
    }
  } catch (error) {
    console.error("Error fetching offers:", error);
    offersContainer.innerHTML = `<p>Error fetching offers: ${error.message}</p>`;
  }
});
