import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import MaterialTable, { Column } from "@material-table/core";
import { createTheme } from "@material-ui/core/styles";

// components

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
        setErrorMessage(["Cannot load camera data"]);
        setIserror(true);
      });
  };
  const columns = [
    { title: "Location", field: "location" },
    { title: "First Name", field: "cameraname" },
    { title: "Password", field: "password" },
  ];
  const handleRowUpdate = (updateData, oldData, resolve) => {
    let errorList = [];
    if (updateData.cameraname === undefined) {
      errorList.push("Please enter camera name");
    }
    if (updateData.password === undefined) {
      errorList.push("Please enter password");
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
    if (newData.password === undefined) {
      errorList.push("Please enter password");
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
      <PageTitle title="Tables" />
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
