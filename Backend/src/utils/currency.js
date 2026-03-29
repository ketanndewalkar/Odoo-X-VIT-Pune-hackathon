import axios from "axios";

export const getCurrencyByCountry = async (countryName) => {
  const response = await axios.get(
    "https://restcountries.com/v3.1/all?fields=name,currencies"
  );

  const countries = response.data;

  const matchedCountry = countries.find(
    (country) =>
      country?.name?.common?.toLowerCase() === countryName.toLowerCase()
  );

  if (!matchedCountry) {
    throw new Error("Invalid country selected");
  }
  console.log("Matched Country:", matchedCountry); // Debug log to check the matched country data
  const currencies = matchedCountry.currencies;

  if (!currencies || Object.keys(currencies).length === 0) {
    throw new Error("Currency not found for selected country");
  }

  return Object.keys(currencies)[0];
};