import axios from "axios";

const BASE_URL = "https://data.ssb.no/api/v0/no/table/07241";

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-type": "application/json",
  },
});
