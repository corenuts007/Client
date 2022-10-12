import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import MaterialTable, { Column } from "@material-table/core";
import UserService from "../../services/UserService";
import axios from "axios";
import { createTheme } from "@material-ui/core/styles";

// components
import PageTitle from "../../components/PageTitle";
import Widget from "../../components/Widget";
import Table from "../dashboard/components/Table/Table";
import GetAppIcon from "@material-ui/icons/GetApp";
import AddIcon from "@material-ui/icons/Add";
// data
import mock from "../dashboard/mock";

export default function Tables() {
  const [data, setData] = useState([]);

  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const fetchData = () => {
    fetch("/users")
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((error) => {
        console.error("error in fetch users");
        setErrorMessage(["Cannot load user data"]);
        setIserror(true);
      });
  };
  const columns = [
    { title: "id", field: "id", editable: false },
    { title: "First Name", field: "username" },
    { title: "Password", field: "password" },
  ];
  const handleRowUpdate = (newData, oldData, resolve) => {
    let errorList = [];
    if (newData.username === undefined) {
      errorList.push("Please enter user name");
    }
    if (newData.password === undefined) {
      errorList.push("Please enter password");
    }

    if (errorList.length < 1) {
      fetch("/createuser", {
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

  const handleRowAdd = (newData, resolve) => {
    console.log("11111111");
    let errorList = [];
    if (newData.username === undefined) {
      errorList.push("Please enter user name");
    }
    if (newData.password === undefined) {
      errorList.push("Please enter password");
    }
    console.log("2222");
    if (errorList.length < 1) {
      //no error
      console.log("333333s");
      fetch("/createuser", {
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
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve) => {
                  handleRowUpdate(newData, oldData, resolve);
                }),
              onRowDelete: (oldData) => {
                return new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const dataDelete = [...data];
                    const target = dataDelete.find(
                      (el) => el.id === oldData.tableData.id,
                    );
                    const index = dataDelete.indexOf(target);
                    dataDelete.splice(index, 1);
                    setData([...dataDelete]);
                    resolve();
                  }, 1000);
                });
              },
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
