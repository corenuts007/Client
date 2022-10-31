import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import MaterialTable, { Column } from "@material-table/core";
import { createTheme } from "@material-ui/core/styles";
import ReactPlayer from 'react-player'
import ReactWebMediaPlayer from 'react-web-media-player';
import {Link,Box,Modal, Typography} from "@material-ui/core";
import {Button,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle} from "@material-ui/core"
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

  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const data = [
    { name: "Mohammad", surname: "Faisal", video_locaion: "1995" },
    { name: "Nayeem Raihan ", surname: "Shuvo", video_locaion: "1994" },
  ];

  const [openPopup, setOpenPopup] = useState(false)
  const openInPopup = item => {
    setRecordForEdit(item)
    setOpenPopup(true)
}
  const columns = [
    { title: "Location", field: "name" },
    { title: "Alert Time", field: "surname" },
    { title: "Video", field: "video_locaion",

    render:rowData=>
    <Link
  component="button"
  variant="body2"
  onClick={() =>
  { setOpenPopup(true);
  console.log("I'm a button.");
  }}
>
{rowData.video_locaion}
</Link>
      }
  ];

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
                title="Alert Video"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
          <ReactPlayer
            url= './a2.webm'
            controls = {true}
            />



            </Popup>
    </>
  );
}
