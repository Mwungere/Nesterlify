
function calculateReturnDate(startDate, daysToAdd) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString().split("T")[0];
}
  
async function handleFlightSearch(event) {
    event.preventDefault(); 
  
    const origin = document.getElementById('origin1').value.trim();
    const destination = document.getElementById('destination1').value.trim();
    const departureDate = document.getElementById('departureDate1').value.trim();
    const returnDate = document.getElementById('departureDate2').value.trim();
    const adults = parseInt(document.getElementById('adults').value, 10);
    const childAge = parseInt(document.getElementById('childAge').value, 10) || undefined;
    const cabinClass = document.getElementById('cabinClass').value;
  
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
                            origin,
                            destination,
                            departure_date: departureDate,
                        },
                        {
                            origin: destination,
                            destination: origin,
                            departure_date: returnDate,
                        },
                    ],
                    passengers: Array(adults).fill({ type: "adult" }).concat(childAge ? [{ age: childAge }] : []),
                    cabin_class: cabinClass,
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
            console.log("Search Results:", data.offers);
            
            // Store results in localStorage
            localStorage.setItem('flightSearchResults', JSON.stringify(data.offers));

            if (!window.location.pathname.includes('booking.html')) {
                window.location.href = 'booking.html';
                // displayFlightResults(data.offers);
            } else {
                displayFlightResults(data.offers);
            }
        } else {
            console.log("No offers found!");
            alert("No offers found. Please try again.");
        }
  
    } catch (error) {
        console.error("Error fetching offers:", error);
        alert("Error fetching offers. Please try again later.");
    }
}
  
document.getElementById('bookingForm').addEventListener('submit', handleFlightSearch);

function displayFlightResults(results) {
    const offersContainer = document.getElementById("flights-container");
    offersContainer.innerHTML = ''; // Clear existing offers

    results.forEach((offer, index) => {
        offer.slices.forEach((slice) => {
            slice.segments.forEach((segment) => {
                const flightCard = document.createElement('div');
                flightCard.classList.add('col-lg-4', 'col-md-6', 'wow', 'fadeInUp');
                flightCard.setAttribute('data-wow-delay', '0.1s');

                const { total_currency, total_amount } = offer;
                const { origin, destination, operating_carrier, duration, operating_carrier_flight_number } = segment;

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
                        <small class="border-end me-3 pe-3"><i class="fa fa-bed text-primary me-2"></i>${operating_carrier_flight_number}</small>
                        <small class="border-end me-3 pe-3"><i class="fa fa-bath text-primary me-2"></i>${duration}</small>
                        <small><i class="fa fa-wifi text-primary me-2"></i>Wifi</small>
                      </div>
                      <p class="text-body mb-3">Flight from ${origin.city_name} (${origin.iata_city_code}) to ${destination.city_name} (${destination.iata_city_code})</p>
                      <div class="d-flex justify-content-between">
                        <a class="btn btn-sm btn-primary rounded py-2 px-4" href="#">View Detail</a>
                        <a class="btn btn-sm btn-dark rounded py-2 px-4" href="#">Book Now</a>
                      </div>
                    </div>
                  </div>
                `;

                offersContainer.appendChild(flightCard);
            });
        });
    });
}
