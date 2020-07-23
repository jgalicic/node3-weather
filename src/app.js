const path = require("path")
const express = require("express")
const hbs = require("hbs")
const geocode = require("./utils/geocode")
const forecast = require("./utils/forecast")

const app = express()

// Adjustible constants

let UNIT = "f"

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public")
const viewsPath = path.join(__dirname, "../templates/views")
const partialsPath = path.join(__dirname, "../templates/partials")

// Setup handlebars engine and views location
app.set("view engine", "hbs")
app.set("views", viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.use(express.urlencoded({ extended: true }))

app.get("", (req, res) => {
  res.redirect("/weather")
})

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Justin Galicic",
  })
})

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "This is some helpful text.",
    title: "Help",
    name: "Justin Galicic",
  })
})

app.get("/weather", (req, res) => {
  res.render("weather", {
    title: "Weather",
    name: "Justin Galicic",
  })
})

app.post("/submit-city", (req, res) => {
  const cityName = req.body.cityName.toLowerCase()
  res.redirect(`/weather/${cityName}`)
  res.end()
})

app.get("/weather/:city", (req, res) => {
  geocode(req.params.city, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return console.log(error)
    }
    // Today's Date //
    const date = new Date()
    let y = date.getFullYear()
    let m = date.getMonth()
    let d = date.getDate()
    let h = date.getHours()

    m += 1
    if (m < 10) m = "0" + m.toString()
    let todaysDate = y.toString() + "-" + m + "-" + d.toString()

    ////////////////////

    // Tomorrow's Date //

    const tomorrow = new Date(date)
    tomorrow.setDate(tomorrow.getDate() + 1)

    let ty = tomorrow.getFullYear()
    let tm = tomorrow.getMonth()
    let td = tomorrow.getDate()
    let th = tomorrow.getHours()

    tm += 1
    if (tm < 10) tm = "0" + tm.toString()
    let tomorrowsDate = ty.toString() + "-" + tm + "-" + td.toString()
    ////////////////////

    console.log("TODAY:", todaysDate)
    console.log("TOMOR:", tomorrowsDate)

    forecast(
      req.params.city,
      7,
      0,
      3,
      UNIT,
      "english",
      (error, forecastData) => {
        if (error) {
          return console.log(error)
        }

        let forecastAvailable = true
        let forecastUnavailable = false

        if (!forecastData) {
          forecastAvailable = false
          forecastUnavailable = true
        }

        res.render("weather", {
          title: "Weather",
          name: "Justin Galicic",
          unit: forecastData.request.unit.toUpperCase(),
          city: forecastData.location.name,
          region: forecastData.location.region,
          country: forecastData.location.country,

          lat: forecastData.location.lat,
          long: forecastData.location.lon,
          timezone_id: forecastData.location.timezone_id,
          localtime: forecastData.location.localtime,
          localtime_epoch: forecastData.location.localtime_epoch,
          utc_offset: forecastData.location.utc_offset,
          forecastAvailable: forecastAvailable,
          forecastUnavailable: forecastUnavailable,
          temperature: forecastData.current.temperature,
          observation_time: forecastData.current.observation_time,
          temperature: forecastData.current.temperature,
          weather_icons: forecastData.current.weather_icons,
          weather_descriptions: forecastData.current.weather_descriptions,
          wind_speed: forecastData.current.wind_speed,
          wind_degree: forecastData.current.wind_degree,
          wind_dir: forecastData.current.wind_dir,
          pressure: forecastData.current.pressure,
          precip: forecastData.current.precip,
          humidity: forecastData.current.humidity,
          cloudcover: forecastData.current.cloudcover,
          feelslike: forecastData.current.feelslike,
          uv_index: forecastData.current.uv_index,
          visibility: forecastData.current.visibility,
          is_day: forecastData.current.is_day,
          mintemp: forecastData.forecast[todaysDate].mintemp,
          maxtemp: forecastData.forecast[todaysDate].maxtemp,
          avgtemp: forecastData.forecast[todaysDate].avgtemp,
          sunhour: forecastData.forecast[todaysDate].sunhour,
          sunrise: forecastData.forecast[todaysDate].astro.sunrise,
          sunset: forecastData.forecast[todaysDate].astro.sunset,
          moonrise: forecastData.forecast[todaysDate].astro.moonrise,
          moonset: forecastData.forecast[todaysDate].astro.moonset,
          moon_phase: forecastData.forecast[todaysDate].astro.moon_phase,
          moon_illumination:
            forecastData.forecast[todaysDate].astro.moon_illumination,
          tmr_mintemp: forecastData.forecast[tomorrowsDate].mintemp,
          tmr_maxtemp: forecastData.forecast[tomorrowsDate].maxtemp,
          tmr_avgtemp: forecastData.forecast[tomorrowsDate].avgtemp,
          tmr_sunhour: forecastData.forecast[tomorrowsDate].sunhour,
          tmr_sunrise: forecastData.forecast[tomorrowsDate].astro.sunrise,
          tmr_sunset: forecastData.forecast[tomorrowsDate].astro.sunset,
          tmr_moonrise: forecastData.forecast[tomorrowsDate].astro.moonrise,
          tmr_moonset: forecastData.forecast[tomorrowsDate].astro.moonset,
          tmr_moon_phase: forecastData.forecast[tomorrowsDate].astro.moon_phase,
          tmr_moon_illumination:
            forecastData.forecast[tomorrowsDate].astro.moon_illumination,
        })
      }
    )
  })
})

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Justin Galicic",
    errorMessage: "Help article not found.",
  })
})

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Justin Galicic",
    errorMessage: "Page not found.",
  })
})

app.listen(3000, () => {
  console.log("Server is up on port 3000.")
})
