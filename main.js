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
    const offerRequestResponse = await fetch("https://nesterlify-server-6.onrender.com/api/offer_requests", {
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

    const response = await fetch(`https://nesterlify-server-6.onrender.com/api/offers/${offerRequestId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await response.json();

    if (data.offers && data.offers.length > 0) {
      const displayedCarriers = new Set();

      data.offers.forEach((offer, index) => {
        offer.slices.forEach((slice) => {
          slice.segments.forEach((segment) => {
            const { operating_carrier, departing_at, operating_carrier_flight_number } = segment;
    
            if (!displayedCarriers.has(operating_carrier_flight_number) && !displayedCarriers.has(departing_at)) {
              displayedCarriers.add(operating_carrier_flight_number);
              displayedCarriers.add(departing_at);
    
              const flightCard = document.createElement("div");
              flightCard.classList.add("col-lg-4", "col-md-6", "wow", "fadeInUp");
              flightCard.setAttribute("data-wow-delay", "0.1s");
    
              const { total_currency, total_amount } = offer;
              const { origin, destination, duration } = segment;
    
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
                      <button class="btn btn-sm btn-primary rounded py-2 px-4 view-detail" data-bs-toggle="modal" data-bs-target="#flightDetailModal" data-offer-index="${index}">View Detail</button>
                      <button class="btn btn-sm btn-dark rounded py-2 px-4 book-now" data-flight-number="${operating_carrier_flight_number}" data-departing-at="${departing_at}" data-origin="${origin}" data-destination="${destination}" data-amount="${total_amount}">Book Now</button>
                    </div>
                  </div>
                </div>
              `;
    
              offersContainer.appendChild(flightCard);
            }
          });
        });
      });

      document.querySelectorAll(".view-detail").forEach((button) => {
        button.addEventListener("click", (event) => {
          const offerIndex = event.target.getAttribute("data-offer-index");
          showFlightDetails(data.offers[offerIndex]);
        });
      });

       // Attach event listeners to "Book Now" buttons in cards
  document.querySelectorAll('.book-now').forEach(button => {
    button.addEventListener('click', (event) => {
      const flightNumber = event.target.getAttribute('data-flight-number');
      const departingAt = event.target.getAttribute('data-departing-at');
      const origin = event.target.getAttribute('data-origin');
      const flightAmount = event.target.getAttribute('data-amount');
      const destination = event.target.getAttribute('data-destination');

      const bookingFormModal = document.getElementById('bookingFormModal');

      const bookingFormModalInstance = new bootstrap.Modal(bookingFormModal, {
        backdrop: 'static',
        keyboard: false
      });
      bookingFormModalInstance.show();

      // Pass flightNumber and departingAt to displayBookingConfirmation
      displayBookingConfirmation(flightNumber, departingAt, destination, flightAmount, origin);
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

function showFlightDetails(offer) {
  const modalContent = document.getElementById("flightDetailsContent");
  modalContent.innerHTML = ""; // Clear previous details

  // Iterate through each slice and segment to find the selected flight details
  offer.slices.forEach((slice, sliceIndex) => {
    slice.segments.forEach((segment, segmentIndex) => {
      if (sliceIndex === 0 && segmentIndex === 0) {
        const { origin, destination, operating_carrier, duration, operating_carrier_flight_number } = segment;
        const segmentDetails = `
          <div class="segment-detail">
            <h5>${operating_carrier.name}</h5>
            <p>Flight Number: ${operating_carrier_flight_number}</p>
            <p>Duration: ${duration}</p>
            <p>From: ${origin.city_name} (${origin.iata_city_code})</p>
            <p>To: ${destination.city_name} (${destination.iata_city_code})</p>
            <button class="btn btn-sm btn-dark rounded py-2 px-4 book-now" data-flight-number="${operating_carrier_flight_number}" data-departing-at="${segment.departing_at}">Book Now</button>
          </div>
          <hr>
        `;
        modalContent.insertAdjacentHTML("beforeend", segmentDetails);
      }
    });
  });

  // Attach event listeners to "Book Now" buttons in flight details modal
  modalContent.querySelectorAll('.book-now').forEach(button => {
    button.addEventListener('click', (event) => {
      const flightNumber = event.target.getAttribute('data-flight-number');
      const departingAt = event.target.getAttribute('data-departing-at');

      const flightDetailModal = document.getElementById('flightDetailModal');
      const bookingFormModal = document.getElementById('bookingFormModal');

      // Hide the flight detail modal
      const flightDetailModalInstance = bootstrap.Modal.getInstance(flightDetailModal);
      flightDetailModalInstance.hide();

      // Show the booking form modal after a short delay to ensure backdrop is managed
      setTimeout(() => {
        const bookingFormModalInstance = new bootstrap.Modal(bookingFormModal, {
          backdrop: 'static',
          keyboard: false
        });
        bookingFormModalInstance.show();

        // Pass flightNumber and departingAt to displayBookingConfirmation
        displayBookingConfirmation(flightNumber, departingAt);
      }, 300);
    });
  });
}

async function handleBooking(formData) {
  try {
    const response = await fetch('https://nesterlify-server-6.onrender.com/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Booking data sent successfully:', responseData);   

    document.getElementById("bookingForm").reset();
  } catch (error) {
    console.error('Error sending booking data:', error);
    alert('Error sending booking data. Please try again later.');
  }
}

async function createInvoice(formData){
  const InvoiceData = {
    price_amount: formData.flightAmount,
    price_currency: 'btc', 
    order_id: formData.flightNumber,
    order_description: `Flight from ${formData.origin.city_name} (${formData.origin.iata_city_code}) to ${formData.destination.city_name} (${formData.destination.iata_city_code})`,
    pay_currency: 'btc',
    ipn_callback_url: "https://nowpayments.io",
    success_url: "https://nowpayments.io",
    cancel_url: "https://nowpayments.io",
    is_fixed_rate: true,
    is_fee_paid_by_user: false
  };

  try {
    const response = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'YJA2X3S-KHRMN22-P97DR57-XMSHMQG' 
      },
      body: JSON.stringify(InvoiceData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Invoice created successfully:', responseData);

    // Redirect user to the payment page
    window.location.href = responseData.invoice_url;
  } catch (error) {
    console.error('Error creating invoice:', error);
    // Handle error and inform user
  }
}

// Function to display booking confirmation modal
function displayBookingConfirmation(flightNumber, departingAt, destination, flightAmount, origin) {
  const bookingForm = document.getElementById("bookingForm");

  bookingForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const country = document.getElementById("country").value.trim();
    const gender = document.getElementById("gender").value.trim();
    const dob = document.getElementById("dob").value.trim();
    const passportNumber = document.getElementById("passportNumber").value.trim();

    const formData = {
      fullName,
      country,
      gender,
      dob,
      passportNumber,
      flightNumber,
      departingAt,
      destination,
      flightAmount,
      origin
    };

    const modalContent = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Booking Confirmation</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Full Name: ${formData.fullName}</p>
            <p>Country: ${formData.country}</p>
            <p>Gender: ${formData.gender}</p>
            <p>Date of Birth: ${formData.dob}</p>
            <p>Passport Number: ${formData.passportNumber}</p>
            <p>Flight Number: ${formData.flightNumber}</p>
            <p>Departing At: ${formData.departingAt}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="confirmReservation">Confirm Reservation</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>
    `;

    const bookingFormModal = document.getElementById('bookingFormModal');
    const bookingFormModalInstance = bootstrap.Modal.getInstance(bookingFormModal);
    bookingFormModalInstance.hide();

    const modalElement = document.createElement('div');
    modalElement.classList.add('modal', 'fade');
    modalElement.innerHTML = modalContent;

    document.body.appendChild(modalElement);

    const bootstrapModal = new bootstrap.Modal(modalElement);
    bootstrapModal.show();

    const confirmReservationButton = modalElement.querySelector('#confirmReservation');
    confirmReservationButton.addEventListener('click', () => {
      createInvoice(formData);

      handleBooking(formData);


      alert('Reservation confirmed!');
      console.log('Flight Number:', flightNumber);
      console.log('Departing At:', departingAt);
      bootstrapModal.hide();
    });
  });
}