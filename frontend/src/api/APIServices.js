import React, { Component } from "react";

export default class APIServices {
  constructor() {
    this.error = false;
    this.results = {};
  }

  /* Get headers for the request */
  getHeaders(type) {
    let headers = {};
    if (localStorage.getItem("grocery") !== null) {
      headers = {
        Accept: "application/json",
        Authorization: "Bearer "+localStorage.getItem("grocery")
      };
    } else {
      headers = {
        Accept: "application/json"
      };
    }

    if (type !== "form-data") {
      let contentType = { "content-type": "application/json" };
      headers = { ...headers, ...contentType };
    }
    return headers;
  }

  /* Checking for errors if any */
  checkErrors(response) {
    this.error = true;
    // var message = "";
    switch (this.status) {
      case 400:
        // this.getMessage(this.results);
        break;
      case 401:
        this.results = {
            message: "Auth Failed"
          };
          window.localStorage.clear();
          window.location.replace("/");
        break;
      case 403:
        this.results = {
          message: "Permission Denied"
        };
        break;
      case 404:
        this.results = {
          message: "Results not found."
        };
        break;
      default:
        this.results = {
          message: "Something went wrong"
        };
    }
  }

  /* GET method call with fetch */
  async get(url) {
    await fetch(url, {
      method: "GET",
      headers: this.getHeaders()
    })
      .then(response => {
        this.status = response.status;
        return response.json();
      })
      .then(jsonResponse => {
        this.results = jsonResponse;
      })
      .catch(e => {
        console.log(e);
      });
    if (this.status !== 200) {
      this.error = true;
      this.checkErrors();
    }
    return {
      error: this.error,
      results: this.results,
      status: this.status
    };
  }

  async getReport(url,fileName) {
    await fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/octet-stream',
        'Authorization': "Bearer "+localStorage.getItem("grocery"),
        'Access-Control-Expose-Headers': 'Content-Disposition'
      }
    }).then(response =>{
      response.blob()
        .then(blob => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          a.click();
        })
    })
    }

    async getImg(url) {
      await fetch(url, {
        method: "GET",
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization':"Bearer "+localStorage.getItem("grocery")
        }
      })
      .then(res=>res.json())
      .then(blob=>{
          let objectURL = URL.createObjectURL(blob);
          let myImage = new Image();
          myImage.src = objectURL;
      })
      }

  /* POST method call with fetch */
  async post(url, data, type) {
    // var dataToSend = data;
    if (type !== "form-data") {
      data = JSON.stringify(data);
    }
    await fetch(url, {
      method: "POST",
      body: data,
      headers: this.getHeaders(type)
    })
      .then(response => {
        this.status = response.status;
        return response.json();
      })
      .then(jsonResponse => {
        this.results = jsonResponse;
      })
      .catch(e => {
        console.log(e);
      });
    if (!(this.status === 201 || this.status === 200)) {
      this.error = true;
      this.checkErrors();
    }
    return {
      error: this.error,
      status: this.status,
      results: this.results
    };
  }

  /* PUT method call with fetch */
  async put(url, data, type) {
    if (type !== "form-data") {
      data = JSON.stringify(data);
    }
    await fetch(url, {
      method: "PUT",
      body: data,
      headers: this.getHeaders(type)
    })
      .then(response => {
        this.status = response.status;

        return response.json();
      })
      .then(jsonResponse => {
        this.results = jsonResponse;
      })
      .catch(e => {
        console.log(e);
      });
    if (this.status !== 200) {
      this.error = true;
      this.checkErrors();
    }

    return {
      error: this.error,
      results: this.results,
      status: this.status
    };
  }

  /* PATCH method call with fetch */
  async patch(url, data, type) {
    if (type !== "form-data") {
      data = JSON.stringify(data);
    }
    await fetch(url, {
      method: "PATCH",
      body: data,
      headers: this.getHeaders(type)
    })
      .then(response => {
        this.status = response.status;
        return response.json();
      })
      .then(jsonResponse => {
        this.results = jsonResponse;
      })
      .catch(e => {
        console.log(e);
      });
    if (this.status !== 200) {
      this.error = true;
      this.checkErrors();
    }
    return {
      error: this.error,
      results: this.results,
      status: this.status
    };
  }

  /* DELETE method call with fetch */
  async delete(url) {
    await fetch(url, {
      method: "DELETE",
      headers: this.getHeaders()
    })
      .then(response => {
        this.status = response.status;
        if (this.status !== 204) {
          return response.json();
        }
      })
      .then(jsonResponse => {
        this.results = jsonResponse;
      })
      .catch(e => {
        console.log(e);
      });
    if (this.status !== 204) {
      this.error = true;
      this.checkErrors();
    }
    return {
      error: this.error,
      results: this.results,
      status: this.status
    };
  }
}
