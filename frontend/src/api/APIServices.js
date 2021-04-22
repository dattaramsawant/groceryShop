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

    async getReport(url){
      const csvData=await fetch(url,{
        method:"GET",
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
      })
      .then(res=>{
        this.status=res.status
        let reader = res.body.getReader();
        let decoder = new TextDecoder('utf-8');

        return reader.read().then(function (result) {
          return decoder.decode(result.value);
        });
      })
      .catch(e => {
          console.log(e);
      });
      const splitData=csvData.toString().split('\n')
      const headersData=splitData[0].split(',')
      const headers=[]
      const results=[]
      headersData.map(data=>{
        headers.push({headerName:data})
      })
      for(let i=1;i<splitData.length-1;i++){
        let obj={}
        let str=splitData[i]
        let flag=0
        let s = ''
        for(let ch of str){
            if(ch==='"' && flag===0){
                flag=1
            }else if (ch === '"' && flag == 1) {
                flag = 0
            }
            if (ch === ';' && flag === 0){
                ch = '|'
            }
            if (ch !== '"') {
                s += ch
            }
        }
        let properties = s.split("|")
        for(let j in headersData){
            console.log(properties[j])
            if(properties[j]!==undefined){
              if (properties[j].includes(";")) {
                  obj[headersData[j]] = properties[j].split(";").map(item => item.trim())
              }else obj[headersData[j]] = properties[j]
            }                
        }
        results.push(obj)
      }
      const csvDataReport={
        headers,
        results
      }
      return {
        error: this.error,
        results: csvDataReport,
        status: this.status
      };
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
