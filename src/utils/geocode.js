// NOTE: geocode has been depricated from this project and is no longer in use.

const request = require("postman-request")

module.exports = (address, callback) => {
  const mb_key = `pk.eyJ1IjoiamdhbGljaWMiLCJhIjoiY2thMnc1cnJ2MGh3bDNncWtvdjZka3RsbCJ9.oQ6T79ZAHG3dC4aSS1HwCA`
  const mb_url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${mb_key}&limit=1`

  request({ url: mb_url, json: true }, function (error, response, body) {
    if (error) {
      callback("Error: Unable to connect to location services!", undefined)
    } else if (response.body.features.length === 0) {
      callback("Error: Location not found", undefined)
    } else {
      console.log(
        "Lat: ",
        response.body.features[0].center[1],
        "Long: ",
        response.body.features[0].center[0]
      )
      console.log("statusCode:", response && response.statusCode)
      callback(undefined, {
        latitude: response.body.features[0].center[1],
        longitude: response.body.features[0].center[0],
        location: response.body.features[0].text,
      })
    }
  })
}
