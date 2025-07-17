import React, { useState, useEffect } from "react";

function App() {
  const [location, setLocation] = useState(null);
  const [sunriseTime, setSunriseTime] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [tomorrowSunrise, setTomorrowSunrise] = useState(null);
  const [tomorrowStart, setTomorrowStart] = useState(null);
  const [tomorrowEnd, setTomorrowEnd] = useState(null);

  // Set document title on component mount
  useEffect(() => {
    document.title = "Brahm Muhurat Timing App";
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        (err) => {
          alert("Location permission denied. Please allow it to continue.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  useEffect(() => {
    if (location) {
      // Get today's sunrise and muhurta
      fetch(
        `https://api.sunrise-sunset.org/json?lat=${location.lat}&lng=${location.lon}&formatted=0`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("Sunrise API data:", data);
          const sunriseUTC = new Date(data.results.sunrise);
          const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const localStr = sunriseUTC.toLocaleString("en-US", { timeZone });
          const sunriseLocal = new Date(localStr);
          setSunriseTime(sunriseLocal);
          calculateMuhurta(sunriseLocal, setStartTime, setEndTime);

          // Calculate tomorrow's date
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowDateStr = tomorrow.toISOString().split('T')[0];

          // Get tomorrow's sunrise and muhurta
          fetch(
            `https://api.sunrise-sunset.org/json?lat=${location.lat}&lng=${location.lon}&formatted=0&date=${tomorrowDateStr}`
          )
            .then((res) => res.json())
            .then((data) => {
              const tomorrowSunriseUTC = new Date(data.results.sunrise);
              const tomorrowLocalStr = tomorrowSunriseUTC.toLocaleString("en-US", { timeZone });
              const tomorrowSunriseLocal = new Date(tomorrowLocalStr);
              setTomorrowSunrise(tomorrowSunriseLocal);
              calculateMuhurta(tomorrowSunriseLocal, setTomorrowStart, setTomorrowEnd);
            });
        })
        .catch((err) => {
          console.error("Failed to fetch sunrise:", err);
        });
    }
  }, [location]);

  const calculateMuhurta = (sunrise, setStart, setEnd) => {
    const start = new Date(sunrise.getTime() - 96 * 60000);
    const end = new Date(start.getTime() + 48 * 60000);
    setStart(start);
    setEnd(end);
  };

  const formatTime = (date) =>
    date?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDate = (date) =>
    date?.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "auto", fontFamily: "Arial" }}>
      <h2 style={{ textAlign: "center" }}>🕉️ Brahm Muhurat Finder</h2>

      {sunriseTime ? (
        <div>
          <div style={{ border: "1px solid #ccc", padding: "1rem", marginTop: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
            <h3 style={{ marginTop: 0, color: "#2c3e50" }}>Today ({formatDate(new Date())})</h3>
            <p><strong>📍 Location:</strong> {location.lat.toFixed(2)}, {location.lon.toFixed(2)}</p>
            <p><strong>🌅 Sunrise:</strong> {formatTime(sunriseTime)}</p>
            <p><strong>🔆 Brahm Muhurat Start:</strong> {formatTime(startTime)}</p>
            <p><strong>🔚 Brahm Muhurat End:</strong> {formatTime(endTime)}</p>
          </div>

          {tomorrowSunrise && (
            <div style={{ border: "1px solid #ccc", padding: "1rem", marginTop: "1rem", borderRadius: "8px" }}>
              <h3 style={{ marginTop: 0, color: "#2c3e50" }}>Tomorrow ({formatDate(new Date(Date.now() + 86400000))})</h3>
              <p><strong>🌅 Sunrise:</strong> {formatTime(tomorrowSunrise)}</p>
              <p><strong>🔆 Brahm Muhurat Start:</strong> {formatTime(tomorrowStart)}</p>
              <p><strong>🔚 Brahm Muhurat End:</strong> {formatTime(tomorrowEnd)}</p>
            </div>
          )}
        </div>
      ) : (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>Fetching location and sunrise time...</p>
      )}
    </div>
  );
}

export default App;




// import React, { useState, useEffect } from "react";

// function App() {
//   const [location, setLocation] = useState(null);
//   const [sunriseTime, setSunriseTime] = useState(null);
//   const [startTime, setStartTime] = useState(null);
//   const [endTime, setEndTime] = useState(null);

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           setLocation({
//             lat: pos.coords.latitude,
//             lon: pos.coords.longitude,
//           });
//         },
//         (err) => {
//           alert("Location permission denied. Please allow it to continue.");
//         }
//       );
//     } else {
//       alert("Geolocation is not supported by your browser.");
//     }
//   }, []);

//   useEffect(() => {
//     if (location) {
//       fetch(
//         `https://api.sunrise-sunset.org/json?lat=${location.lat}&lng=${location.lon}&formatted=0`
//       )
//         .then((res) => res.json())
//         .then((data) => {
//           console.log("Sunrise API data:", data);
//           const sunriseUTC = new Date(data.results.sunrise);
//           const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//           const localStr = sunriseUTC.toLocaleString("en-US", { timeZone });
//           const sunriseLocal = new Date(localStr);
//           setSunriseTime(sunriseLocal);
//           calculateMuhurta(sunriseLocal);
//         })
//         .catch((err) => {
//           console.error("Failed to fetch sunrise:", err);
//         });
//     }
//   }, [location]);

//   const calculateMuhurta = (sunrise) => {
//     const start = new Date(sunrise.getTime() - 96 * 60000);
//     const end = new Date(start.getTime() + 48 * 60000);
//     setStartTime(start);
//     setEndTime(end);
//   };

//   const formatTime = (date) =>
//     date?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

//   return (
//     <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto", fontFamily: "Arial" }}>
//       <h2 style={{ textAlign: "center" }}>🕉️ Brahm Muhurat Finder</h2>

//       {sunriseTime ? (
//         <div style={{ border: "1px solid #ccc", padding: "1rem", marginTop: "1rem", borderRadius: "8px" }}>
//           <p><strong>📍 Location:</strong> {location.lat.toFixed(2)}, {location.lon.toFixed(2)}</p>
//           <p><strong>🌅 Sunrise:</strong> {formatTime(sunriseTime)}</p>
//           <p><strong>🔆 Brahm Muhurat Start:</strong> {formatTime(startTime)}</p>
//           <p><strong>🔚 Brahm Muhurat End:</strong> {formatTime(endTime)}</p>
//         </div>
//       ) : (
//         <p style={{ textAlign: "center", marginTop: "2rem" }}>Fetching location and sunrise time...</p>
//       )}
//     </div>
//   );
// }

// export default App;
