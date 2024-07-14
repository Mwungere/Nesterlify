function calculateReturnDate(startDate, daysToAdd) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString().split("T")[0];
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const offersContainer = document.getElementById("offers-container");
    const today = new Date().toISOString().split("T")[0];

    try {
      const response = await fetch("http://localhost:3000/api/offers", {
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

      const data = await response.json();

      if (data.offers && data.offers.length > 0) {
        data.offers.forEach((offer) => {
          const offerElement = document.createElement("div");
          offerElement.classList.add("offer");

          offerElement.innerHTML = `
            <h3>Total Price: ${offer.total_currency} ${offer.total_amount}</h3>
            <p>Departing from: ${offer.slices[0].origin.city_name} (${offer.slices[0].origin.iata_code}) - Arriving at: ${offer.slices[0].destination.city_name} (${offer.slices[0].destination.iata_code})</p>
            <p>Departing on: ${offer.slices[0].departing_at}</p>`;

          offersContainer.appendChild(offerElement);
        });
      } else {
        offersContainer.innerHTML = "<p>No offers found!</p>";
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
      offersContainer.innerHTML = `<p>Error fetching offers: ${error.message}</p>`;
    }
  });
