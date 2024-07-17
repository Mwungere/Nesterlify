// async function handleBooking(formData) {

//   try {
//     const response = await fetch('http://localhost:3000/api/bookings', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(formData)
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const responseData = await response.json();
//     console.log('Booking data sent successfully:', responseData);   

//     document.getElementById("bookingForm").reset();
//   } catch (error) {
//     console.error('Error sending booking data:', error);
//     alert('Error sending booking data. Please try again later.');
//   }
// }

// document.getElementById("bookingForm").addEventListener("submit", displayBookingConfirmation);

// function displayBookingConfirmation(event) {

//   event.preventDefault();


//   const fullName = document.getElementById("fullName").value.trim();
//   const country = document.getElementById("country").value.trim();
//   const gender = document.getElementById("gender").value.trim();
//   const dob = document.getElementById("dob").value.trim();
//   const passportNumber = document.getElementById("passportNumber").value.trim();

//   const formData = {
//     fullName,
//     country,
//     gender,
//     dob,
//     passportNumber
//   };

//   const modalContent = `
//     <div class="modal-dialog">
//       <div class="modal-content">
//         <div class="modal-header">
//           <h5 class="modal-title">Booking Confirmation</h5>
//           <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//         </div>
//         <div class="modal-body">
//           <p>Booking ID: ${formData._id}</p>
//           <p>Full Name: ${formData.fullName}</p>
//           <p>Country: ${formData.country}</p>
//           <p>Gender: ${formData.gender}</p>
//           <p>Date of Birth: ${formData.dob}</p>
//           <p>Passport Number: ${formData.passportNumber}</p>
//         </div>
//         <div class="modal-footer">
//           <button type="button" class="btn btn-primary" id="confirmReservation">Confirm Reservation</button>
//           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
//         </div>
//       </div>
//     </div>
//   `;


//   const bookingFormModal = document.getElementById('bookingFormModal');
//   const bookingFormModalInstance = bootstrap.Modal.getInstance(bookingFormModal);
//   bookingFormModalInstance.hide();

//   const modalElement = document.createElement('div');
//   modalElement.classList.add('modal', 'fade');
//   modalElement.innerHTML = modalContent;

//   document.body.appendChild(modalElement);

//   const bootstrapModal = new bootstrap.Modal(modalElement);
//   bootstrapModal.show();

//   const confirmReservationButton = modalElement.querySelector('#confirmReservation');
//   confirmReservationButton.addEventListener('click', () => {
//     handleBooking(formData);
//     alert('Reservation confirmed!');
//     bootstrapModal.hide(); 
//   });
// }
