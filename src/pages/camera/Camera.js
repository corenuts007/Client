import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import MaterialTable, { Column } from "@material-table/core";
import { createTheme } from "@material-ui/core/styles";

// components

// components
import PageTitle from "../../components/PageTitle";
import Widget from "../../components/Widget";
import Table from "../dashboard/components/Table/Table";
import GetAppIcon from "@material-ui/icons/GetApp";
import AddIcon from "@material-ui/icons/Add";

export default function Camera() {
  console.log("****************************");
  const [data, setData] = useState([]);

  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const fetchData = () => {
    fetch("/cameras")
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((error) => {
        console.error("error in fetch cameras");
        setErrorMessages(["Cannot load camera data"]);
        setIserror(true);
      });
  };
  const columns = [
    { title: "Camera Name", field: "cameraname" },
    { title: "Camera Location", field: "cameralocation" },
    { title: "IP URL", field: "url" },
    { title: "Monday Alert Start Time", field: "monday_AlertStartTime" },
    { title: "Monday Alert End Time", field: "monday_AlertEndTime" },
  ];
  const handleRowUpdate = (updateData, oldData, resolve) => {
    let errorList = [];
    if (updateData.cameraname === undefined) {
      errorList.push("Please enter camera name");
    }

    if (errorList.length < 1) {
      fetch("/updateCameraByName", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          updateData,
        }),
      })
        .then((response) => {
          fetchData();
          setIserror(false);
          setErrorMessages([]);
          resolve();
        })
        .catch((error) => {
          setErrorMessages(["Update failed! Server error"]);
          setIserror(true);
          resolve();
        });
    } else {
      setErrorMessages(errorList);
      setIserror(true);
      resolve();
    }
  };

  const handleRowDelete = (oldData, resolve) => {
    console.log("in handle row delete ");
    var cameraname = oldData.cameraname;

    fetch("/deleteCameraByName", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cameraname,
      }),
    })
      .then((response) => {
        fetchData();
        setIserror(false);
        setErrorMessages([]);
        resolve();
      })

      .catch((error) => {
        setErrorMessages(["Cannot delete data. Server error!"]);
        setIserror(true);
        resolve();
      });
  };

  const handleRowAdd = (newData, resolve) => {
    console.log("in handle row add ");
    let errorList = [];
    if (newData.cameraname === undefined) {
      errorList.push("Please enter camera name");
    }
    console.log("in handle row add with no erros");
    if (errorList.length < 1) {
      //no error
      console.log("333333s");
      fetch("/createcamera", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newData,
        }),
      })
        .then((response) => {
          fetchData();
          setIserror(false);
          setErrorMessages([]);
          resolve();
        })

        .catch((error) => {
          setErrorMessages(["Cannot add data. Server error!"]);
          setIserror(true);
          resolve();
        });
    } else {
      setErrorMessages(errorList);
      setIserror(true);
      resolve();
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <PageTitle title="Camera" />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MaterialTable
            columns={columns}
            data={data}
            editable={{
              onBulkUpdate: (changes) => {
                return new Promise((resolve, reject) => {
                  setTimeout(() => {
                    let copyData = [...data];
                    setData(getNewDataBulkEdit(changes, copyData));
                    resolve();
                  }, 1000);
                });
              },
              onRowAddCancelled: (rowData) =>
                console.log("Row adding cancelled"),
              onRowUpdateCancelled: (rowData) =>
                console.log("Row editing cancelled"),
              onRowAdd: (newData) =>
                new Promise((resolve) => {
                  console.log("Row Adding"), handleRowAdd(newData, resolve);
                }),
              onRowUpdate: (updateData, oldData) =>
                new Promise((resolve) => {
                  handleRowUpdate(updateData, oldData, resolve);
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve) => {
                  handleRowDelete(oldData, resolve);
                }),
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
