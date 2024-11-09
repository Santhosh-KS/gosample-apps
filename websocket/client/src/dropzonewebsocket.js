export default class DropzoneWebSocket {
  connection;
  // url = "wss://discourse.vbuntu.in/upload";
  // url = "ws://127.0.0.1:5050/upload";
  url = "ws://127.0.0.1:4000/v1/ws";
  // url = 'ws://127.0.0.1:8888';
  //----------------------------------------------------------------------------
  constructor() {
    this.connection = new WebSocket(this.url);
    this.connection.onmessage = this.onMessage.bind(this);
    this.connection.onclose = this.onClose.bind(this);
    this.connection.onerror = this.onError.bind(this);
    this.connection.onopen = this.onOpen.bind(this);
  }
  //----------------------------------------------------------------------------
  onOpen(ev) {
    console.log("#### onOpen:");
    console.log(ev);
  }
  onMessage(ev) {
    console.log("#### onMessage:");
    console.log(ev);
  }
  onClose(ev) {
    console.log("#### onClose:");
    console.log(ev);
  }
  onError(ev) {
    console.log("#### onError:");
    console.log(ev);
  }

  SendFile(fileMeta, fileData) {
    // can't json.stringify a File object. go figure.
    const fileMetaJson = JSON.stringify({
      lastModified: fileMeta.lastModified,
      name: fileMeta.name,
      size: fileMeta.size,
      type: fileMeta.type,
    });
    console.log("Inside Send file");
    console.log(`stringfify json : ${fileMetaJson}`);

    // _must_ do this to encode as a ArrayBuffer / Uint8Array
    const enc = new TextEncoder(); // always utf-8, Uint8Array()
    const buf1 = enc.encode("!");
    const buf2 = enc.encode(fileMetaJson);
    const buf3 = enc.encode("\r\n\r\n");
    const buf4 = fileData;
    console.log("Text Encoder stuff ");
    let sendData = new Uint8Array(
      buf1.byteLength + buf2.byteLength + buf3.byteLength + buf4.byteLength,
      // buf1.length + buf2.length + buf3.length + buf4.length,
    );
    console.log(`senddata len : ${sendData.length} `);
    sendData.set(new Uint8Array(buf1), 0);
    sendData.set(new Uint8Array(buf2), buf1.byteLength);
    sendData.set(new Uint8Array(buf3), buf1.byteLength + buf2.byteLength);
    sendData.set(
      new Uint8Array(buf4),
      buf1.byteLength + buf2.byteLength + buf3.byteLength,
    );
    console.log("SendData prepared");

    this.connection.binaryType = "arraybuffer";
    // @TODO: try, catch (InvalidStateError)
    this.connection.send(sendData);
    console.log("Data Sent");
    this.connection.binaryType = "blob";
    // return bool, so our caller can update the interface?
    // or wait for websocket resopnse? both?
  }
}
