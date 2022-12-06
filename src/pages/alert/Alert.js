import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import MaterialTable, { Column } from "@material-table/core";
import { createTheme } from "@material-ui/core/styles";
import ReactPlayer from 'react-player'
import {Link,Box, Typography} from "@material-ui/core";
// components

// components
import PageTitle from "../../components/PageTitle/PageTitle";
import Widget from "../../components/Widget/Widget";
import Table from "../dashboard/components/Table/Table";
import GetAppIcon from "@material-ui/icons/GetApp";
import AddIcon from "@material-ui/icons/Add";
import Popup from "../../components/Popup/Popup";

export default function Alert() {
  console.log("****************************");
  const [data, setData] = useState([]);

  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [videoLocation, setVideoLocation] = useState([]);
  
  const [openPopup, setOpenPopup] = useState(false)
  const openInPopup = item => {
        setOpenPopup(true)
  }

  const fetchData = () => {
    fetch("/alerts")
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((error) => {
        console.error("error in fetch cameras");
        setErrorMessages(["Cannot load camera data"]);
        setIserror(true);
      });
  };
  const columns = [
    { title: "Org Name", field: "org_name" },
    { title: "Camera Name", field: "camera_name" },
    { title: "Location", field: "camera_location" },
    { title: "Alert Time", field: "alert_time" },
    { title: "Video", field: "video_location",
    
    render:rowData=>
    <Link
    component="button"
    variant="body2"
    onClick={() =>
    { setOpenPopup(true);
      setVideoLocation(rowData.video_location)
    console.log("I'm a button.");
    }}
  >
  {rowData.video_location}
  </Link>
  }
  ];
  useEffect(() => {
    console.log('in featch method')
    fetchData();
  }, []);
  return (
    <>
      <PageTitle title="Alert" />
      
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MaterialTable
            columns={columns}
            data={data}
          />
        </Grid>
      </Grid>
      <Popup
          title='{videoLocation}'
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}>
          <ReactPlayer url= "https://drive.google.com/file/d/1nEJJSU5-j5hd8ubqU2RqJlhEhxrgVnjX/view?usp=share_link" controls = {true}/>
      </Popup>

    </>
  );
}
