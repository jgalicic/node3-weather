const request = require("postman-request")
const { ws_key } = require("../config/ws_key")

module.exports = (
  city,
  num_days,
  hourly,
  interval,
  units,
  language,
  callback
) => {
  let ws_url = `http://api.weatherstack.com/forecast?access_key=${ws_key}`
  ws_url += `&query=${city}`
  ws_url += `&forecast_days=${num_days}`
  // ws_url += `&hourly=${hourly}`
  // ws_url += `&interval=${interval}`
  ws_url += `&units=${units}`
  // ws_url += `&language=${language}`

  // const ws_url2 = `http://api.weatherstack.com/current?access_key=${ws_key}&query=${latitude},${longitude}&units=f`

  request({ url: ws_url, json: true }, function (error, response) {
    console.log("statusCode:", response && response.statusCode)
    if (error) {
      callback("Error: Unable to retrieve weather data", undefined)
    } else if (!response) {
      callback("Error: no response", undefined)
    } else {
      callback(undefined, response.body)
    }
  })
}
