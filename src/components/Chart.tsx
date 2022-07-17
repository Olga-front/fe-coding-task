import { useState, useEffect } from "react";
import IChartItemData from "../types/ChartItem";
import { useSearchParams } from "react-router-dom";
import NorwayStatistic from "../services/NorwayStatistic";
import {
  Line,
  XAxis,
  YAxis,
  ComposedChart,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import { Alert } from "@mui/material";

export default function Chart({ chartData }: any) {
  const [data, setData] = useState<IChartItemData[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const getDataFromLS = () => {
    const formInputs = localStorage.getItem("norway-statistic");

    if (!formInputs) {
      return {
        quartersRangeFrom: "",
        quartersRangeTo: "",
        houseType: "",
        comment: "",
      };
    }

    if (typeof formInputs === "string") {
      const parse = JSON.parse(formInputs);

      return parse;
    }
  };

  const {
    quartersRangeFrom: quartersRangeFromLS,
    quartersRangeTo: quartersRangeToLS,
    houseType: houseTypeLS,
    comment: commentLS,
  } = getDataFromLS();

  const quartersRangeFrom: string =
    chartData?.quartersRangeFrom ||
    searchParams.get("quarters_range_from") ||
    quartersRangeFromLS;
  const quartersRangeTo: string =
    chartData?.quartersRangeTo ||
    searchParams.get("quarters_range_to") ||
    quartersRangeToLS;
  const houseType: string =
    chartData?.houseType || searchParams.get("house_type") || houseTypeLS;
  const comment: string = chartData?.comment || commentLS;

  const getQuartersRange = () => {
    if (!quartersRangeFrom || !quartersRangeTo) return [];

    const [fromYear, fromQuarter] = quartersRangeFrom.split("K");
    const [toYear, toQuarter] = quartersRangeTo.split("K");

    let targetArr = [];

    for (let i = +fromYear; i <= +toYear; i++) {
      let from = i === +fromYear ? fromQuarter : 1;
      let to = i === +toYear ? toQuarter : 4;

      for (let j = +from; j <= to; j++) {
        targetArr.push(`${i}K${j}`);
      }
    }

    return targetArr;
  };

  const quartersRange: string[] = getQuartersRange();

  useEffect(() => {
    const getData = async () => {
      if (quartersRange.length === 0) return;

      const data = await fetchData();
      setLoading(false);

      if (data.error) {
        setError(data.error);
        return;
      }

      const value = data?.value;

      const res: IChartItemData[] = quartersRange.map((quarterName, index) => {
        return {
          name: quarterName,
          "Average price": value[index],
        };
      });
      setData(res);
    };

    getData();
  }, [chartData]);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    const res = await NorwayStatistic.getAll({
      houseType,
      quartersRange,
    })
      .then((response: any) => {
        return response?.data;
      })
      .catch((e: Error) => {
        return { error: e.message };
      });

    return res;
  };

  return (
    <>
      {quartersRange.length === 0 && <Alert severity="warning">No Data</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      {loading && !error && quartersRange.length > 0 && <p>Loading ... </p>}
      {!loading && !error && (
        <>
          {comment && <p>Comment: {comment}</p>}
          <ComposedChart
            width={500}
            height={300}
            data={data}
            margin={{ top: 55, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="name" scale="band" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Average price" barSize={20} fill="#413ea0" />
            <Line type="monotone" dataKey="Average price" stroke="#ff7300" />
          </ComposedChart>
        </>
      )}
    </>
  );
}
