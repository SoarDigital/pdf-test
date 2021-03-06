import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import './App.css';
let pdfjsLib;

function App() {
  const [pageNumber, setPageNumber] = useState(1);
  const [loadingPdf, setLoadingPdf] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    //handlePdf();
    pdfjsLib = window.pdfjsLib;
    handlePdf();
    // handleTry();
    return () => {
      clearState();
    };
  }, []);

  const handlePdf = () => {
    console.log(pdfjsLib);
    pdfjsLib.disableWorker = true;

    // Asynchronous download of PDF

    // 'http://localhost:3000/fetch?url=http://api-dev.thenewspaperstand.com/uploads/file-1610792719302.pdf'

    var loadingTask = pdfjsLib.getDocument(
      'https://tns-upload.s3.us-east-2.amazonaws.com/pdf/Nelson/2021-02-10/tests.pdf'
    );
    loadingTask.promise.then(
      function (pdf) {
        console.log('PDF loaded', pdf._pdfInfo.numPages);
        setLoadingPdf(pdf);

        // Fetch the first page
        //var pageNumber = 1;
        //let totalPages = pdf._pdfInfo.numPages;
        for (let i = 1; i < 10; i++) {
          //console.log('gets here');
          pdf.getPage(i).then(function (page) {
            //console.log('Page loaded', i);

            var scale = 1.5;
            var viewport = page.getViewport({ scale: scale });

            var canvas = document.createElement('canvas');
            document.getElementById('the-canvas').append(canvas);

            canvas.id = `the-canvas-${i}`;

            console.log(canvas);
            var context = canvas.getContext('2d');

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            var renderContext = {
              canvasContext: context,
              viewport: viewport,
            };
            var renderTask = page.render(renderContext);
            renderTask.promise.then(function () {
              console.log('Page rendered');
            });
          });
        }
      },
      function (reason) {
        // PDF loading error
        console.error(reason);
      }
    );
  };

  const clearState = () => {
    console.log('here');
  };

  var BASE64_MARKER = ';base64,';

  function convertDataURIToBinary(dataURI) {
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  function toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  return (
    <div className="App">
      <h1>PDF.js 'Hello, world!' example</h1>
      <div style={{ border: '1px solid #fff', margin: '10px' }}>
        <h3>Upload pdf</h3>
      </div>
      <div id="the-canvas"></div>
    </div>
  );
}

export default App;
