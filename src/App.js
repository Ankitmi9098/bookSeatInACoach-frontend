import React, { useState, useEffect } from "react";
import "./styles/App.css";

function App() {
  const [seatsRequired, setSeatsRequired] = useState(1);
  const [seatDetails, setSeatDetails] = useState([]);
  const [numberOfAvailableSeats, setNumberOfAvailableSeats] = useState(0);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [errorMessage, setErrorMessages] = useState("");
  

  const seatHandler = (event) => {
    validateSeats(event.target.value);
    if (errorMessage === "") {
      setSeatsRequired(parseInt(event.target.value));
    }
  };

  const validateSeats = (seats) => {
    console.log("Seats ", seats);
    const maxSeatThatCanBeSelected =
      numberOfAvailableSeats < 7 ? numberOfAvailableSeats : 7;
    if (seats === "") {
      const message = "Number of Seats must be integer.";
      setErrorMessages(message);
    } else if (seats < 1) {
      const message = "Number of Seats must be greater than zero.";
      setErrorMessages(message);
    } else if (seats > maxSeatThatCanBeSelected) {
      if (maxSeatThatCanBeSelected === 7) {
        const message = "Only 7 seats can be booked in one go.";
        setErrorMessages(message);
      } else {
        const message = `Only ${numberOfAvailableSeats} seats are available.`;
        setErrorMessages(message);
      }
    } else {
      setErrorMessages("");
    }
  };

  const seatBookingHandler = async () => {
    const URL = "http://localhost:8001/bookings/bookSeats";
    const getResponse = await fetch(URL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seats: seatsRequired,
      }),
    }).then((req) => req.json());
    if (getResponse.status === "booked") {
      setBookedSeats(getResponse.seats);
    }
  };
  

  const getSeatDetails = async () => {
    const URL = "http://localhost:8001/bookings/getSeatDetails";
    const getResponse = await fetch(URL, {
      method: "GET",
    }).then((req) => req.json());
    console.log("seat Details ", getResponse);
    setSeatDetails(getResponse);
  };

  const fetchNumberOfAvailableSeats = async () => {
    const URL = "http://localhost:8001/bookings/countAvailableSeats";
    const getResponse = await fetch(URL, {
      method: "GET",
    }).then((req) => req.json());
    // const getJson = getResponse.json();
    console.log("Num of avail seats ", getResponse);
    setNumberOfAvailableSeats(getResponse.count);
  };

  useEffect(() => {
    getSeatDetails();
    fetchNumberOfAvailableSeats();
  }, [bookedSeats]);

  return (
    //Root Fragment
    <>
      <div className="center head place-items-center">
        <h3>
          Available Seats :{" "}
          <span className="availableSeats"> {numberOfAvailableSeats} </span>{" "}
        </h3>
        {/* <br /> */}
        <label className="inputLabel">Enter number of seats:</label>
        <br />
        {errorMessage !== "" && (
          <span className="validationError">{errorMessage}</span>
        )}
        <br />
        <input
          type="Number"
          placeholder="Enter Tickets To Book"
          onChange={seatHandler}
          value={seatsRequired}
          min={1}
          max={numberOfAvailableSeats < 7 ? numberOfAvailableSeats : 7}
          className="input"
        />
        <br />
        <br />

        <button
          type="button"
          onClick={seatBookingHandler}
          disabled={errorMessage !== ""}
          className="button"
        >
          Book Seats
        </button>
      </div>

      <div className="train">
        <div className="grid-container">
          {seatDetails.map((seat) => (
            <div>
              {seat.isBooked && (
                <div
                  className="grid-item booked"
                  title={seat.isBooked ? "Booked" : "Available"}
                >
                  {seat.seatNumber}
                </div>
              )}
              {!seat.isBooked && (
                <div
                  className="grid-item notBooked"
                  title={seat.isBooked ? "Booked" : "Available"}
                >
                  {seat.seatNumber}
                </div>
              )}
            </div>
          ))}
          <br></br>
          
        </div>
      </div>
      <div>
        {bookedSeats.length !== 0 && (
          <p className="bookedSeatsDetails">
            Your seats are:{" "}
            <span className="bookedSeats">{bookedSeats.join()}</span>
          </p>
        )}
      </div>
    </>
  );
}

export default App;
