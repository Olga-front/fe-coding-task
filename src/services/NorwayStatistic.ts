import http from "../apis/norway-statistic";
import IStatisticData from "../types/Statistic";

export const getAll = (payload: IStatisticData) => {
  return http.post("", {
    query: [
      {
        code: "Boligtype",
        selection: {
          filter: "item",
          values: [payload.houseType],
        },
      },
      {
        code: "ContentsCode",
        selection: {
          filter: "item",
          values: ["KvPris"],
        },
      },
      {
        code: "Tid",
        selection: {
          filter: "item",
          values: payload.quartersRange,
        },
      },
    ],
  });
};

const NorwayStatistic = {
  getAll,
};

export default NorwayStatistic;
