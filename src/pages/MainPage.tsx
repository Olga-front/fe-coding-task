import Chart from "./../components/Chart";
import Form from "./../components/Form";
import { Grid, Container, Paper, Typography } from "@mui/material";
import IFormInputsData from "./../types/FormInputs";
import { useState } from "react";

const MainPage = () => {
  const [childData, setChildData] = useState<IFormInputsData | undefined>(
    undefined
  );

  return (
    <div>
      <Container maxWidth="lg" sx={{ pb: 3, pt: 6 }}>
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Paper variant="outlined" sx={{ p: { xs: 2, md: 2 } }}>
              <Typography component="h2" variant="h5" mb={2}>
                Form
              </Typography>

              <Form passChildData={setChildData} />
            </Paper>
          </Grid>
          <Grid item xs={7}>
            <Chart chartData={childData} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default MainPage;
