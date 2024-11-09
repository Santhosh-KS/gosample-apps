import Dropzone from "dropzone";
import DropzoneWebSocket from "../dropzonewebsocket";

class DropzoneComponents extends HTMLElement {
  constructor() {
    super();
    this._files = [];
    this._websocket;
  }
  connectedCallback() {
    console.log("SANT: connectedCallback");
    this.render();
  }

  render() {
    const websocket = new DropzoneWebSocket();
    const myDropzone = new Dropzone("#my-form", {
      addRemoveLinks: true,
      ignoreHiddenFiles: true,
      maxFilesize: 2, // 2 MB
      // dictRemoveFileConfirmation: "Are you sure you want to remove?",
      /* accept: function (file, done) {
        var reader = new FileReader();
        reader.addEventListener("loadend", function (event) {
          console.log("New print ");
          console.log(event.target.result);
          websocket.SendFile(file, event.target.result);
        });
        reader.readAsArrayBuffer(file);
      }, */
    });

    const output = document.querySelector("#output");

    // myDropzone.on("drop", (file) => {
    myDropzone.on("addedfile", (file) => {
      // Add an info line about the added file for each file.
      output.innerHTML += `<div>File added: ${file.name}</div>`;
      if (this._files.find((item) => item.name === file.name) === undefined) {
        this._files.push(file);
        this.fileReader(file, websocket);
      }
      this.printFiles();
    });

    myDropzone.on("removedfile", (file) => {
      // Add an info line about the added file for each file.
      output.innerHTML += `<div>File deleted: ${file.name}</div>`;
      this._files = this._files.filter((item) => item.name === file.name);
      this.printFiles();
    });
  }

  printFiles() {
    this._files.map((x) => {
      console.log(x.name);
    });
    console.log(`file count: ${this._files.length}`);
  }

  fileReader(file, websocket) {
    // const websocket = new DropzoneWebSocket();
    // this._files.map((file) => {
    var reader = new FileReader();
    // reader.addEventListener("loadend", function (event) {
    reader.onload = function (event) {
      console.log("New print ");
      // console.log(event.target.result);
      let rawData = new ArrayBuffer();
      rawData = event.target.result;

      websocket.SendFile(file, rawData);
    };
    reader.readAsArrayBuffer(file);
    // });
  }

  /* fileReader() {
    console.log("insidefileReader");
  } */
}

window.customElements.define("dropzone-demo", DropzoneComponents);
