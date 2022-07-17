import { useForm, SubmitHandler, Controller } from "react-hook-form";
import IFormInputsData from "./../types/FormInputs";
import { useSearchParams } from "react-router-dom";

import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  FormHelperText,
} from "@mui/material";

const Form = (props: any) => {
  const [searchParams, setSearchParams] = useSearchParams();

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
    searchParams.get("quarters_range_from") || quartersRangeFromLS || "";
  const quartersRangeTo: string =
    searchParams.get("quarters_range_to") || quartersRangeToLS || "";
  const houseType: string = searchParams.get("house_type") || houseTypeLS || "";
  const comment: string = commentLS || "";

  const houseTypes = [
    { label: "Boliger i alt", value: "00" },
    { label: "Småhus", value: "02" },
    { label: "03", value: "Blokkleiligheter" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<IFormInputsData>({
    defaultValues: {
      quartersRangeFrom,
      quartersRangeTo,
      houseType,
      comment,
    },
  });

  const onSubmit: SubmitHandler<IFormInputsData> = (data) => {
    const { quartersRangeFrom, quartersRangeTo, houseType, comment } = data;

    setSearchParams({
      quarters_range_from: quartersRangeFrom,
      quarters_range_to: quartersRangeTo,
      house_type: houseType,
    });

    props.passChildData({
      quartersRangeFrom,
      quartersRangeTo,
      houseType,
      comment,
    });

    localStorage.setItem("norway-statistic", JSON.stringify(data));
  };

  const setHelperText = (errors: any, field: string, v: any) => {
    if (Object.keys(errors).length === 0 || !errors[field]) return;

    switch (errors[field].type) {
      case "maxLength":
        return "Max characters limit is 6";
      case "minLength":
        return "Enter at least 6 characters";
      case "validate":
        return "Value is less that 2009K1";
      default:
        return "This is required";
    }
  };

  const quarterRangeFromIsAvailable = (quartersRangeFrom: string) => {
    let arr = quartersRangeFrom.split("K");

    if (arr.length < 2) return false;

    const [year] = arr;

    return +year > 2008;
  };

  const quarterRangeToIsAvailable = (quartersRangeTo: string) => {
    let arr = quartersRangeTo.split("K");

    if (arr.length < 2) return false;

    const [year] = arr;

    return +year > 2008;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} pb={2}>
        <Grid item xs={6}>
          <TextField
            {...register("quartersRangeFrom", {
              required: true,
              minLength: 6,
              maxLength: 6,
              validate: quarterRangeFromIsAvailable,
            })}
            label="Quarters range from"
            variant="standard"
            error={errors.hasOwnProperty("quartersRangeFrom")}
            helperText={setHelperText(
              errors,
              "quartersRangeFrom",
              quartersRangeFrom
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            {...register("quartersRangeTo", {
              required: true,
              minLength: 6,
              maxLength: 6,
              validate: quarterRangeToIsAvailable,
            })}
            label="Quarters range to"
            variant="standard"
            error={errors.hasOwnProperty("quartersRangeTo")}
            helperText={setHelperText(
              errors,
              "quartersRangeTo",
              quartersRangeTo
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="houseType"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <FormControl fullWidth variant="standard">
                <InputLabel>House type</InputLabel>
                <Select {...field} error={errors.hasOwnProperty("houseType")}>
                  {houseTypes.map((houseType) => (
                    <MenuItem value={houseType.value} key={houseType.value}>
                      {houseType.label}
                    </MenuItem>
                  ))}
                </Select>

                {errors.houseType?.type === "required" && (
                  <FormHelperText error>This is required</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            {...register("comment", {})}
            label="Comment"
            variant="standard"
            fullWidth
          />
        </Grid>
      </Grid>
      <Button variant="contained" type="submit">
        Send
      </Button>
    </form>
  );
};

export default Form;
