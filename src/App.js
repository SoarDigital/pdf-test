import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [pageNumber, setPageNumber] = useState(1);
  const [loadingPdf, setLoadingPdf] = useState(null);

  useEffect(() => {
    handlePdf();
    return () => {
      clearState();
    };
  }, []);

  const handlePdf = () => {
    console.log(window);

    const proxyurl = 'https://cors-anywhere.herokuapp.com/';
    var url =
      'http://api-dev.thenewspaperstand.com/uploads/file-1610792719302.pdf';

    let pdfjsLib = window.pdfjsLib;

    pdfjsLib.GlobalWorkerOptions.workerSrc =
      '//mozilla.github.io/pdf.js/build/pdf.worker.js';

    // Asynchronous download of PDF

    var loadingTask = pdfjsLib.getDocument(proxyurl + url);
    loadingTask.promise.then(
      function (pdf) {
        console.log('PDF loaded', pdf._pdfInfo.numPages);
        setLoadingPdf(pdf);

        // Fetch the first page
        //var pageNumber = 1;
        let totalPages = pdf._pdfInfo.numPages;
        for (let i = 1; i < 5; i++) {
          console.log('gets here');
          pdf.getPage(i).then(function (page) {
            console.log('Page loaded', i);

            var scale = 1.5;
            var viewport = page.getViewport({ scale: scale });

            // Prepare canvas using PDF page dimensions
            // var canvas = document.getElementById('the-canvas');
            // var context = canvas.getContext('2d');
            // console.log(canvas);
            // canvas.height = viewport.height;
            // canvas.width = viewport.width;

            var canvas = document.createElement('canvas');
            document.getElementById('the-canvas').append(canvas);

            canvas.id = `the-canvas-${i}`;
            //console.log(`the-canvas-${i}`);

            //var canvas = document.getElementById(`the-canvas-${i}`);
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
              if (i === 1) {
                //console.log(canvas.toDataURL('image/jpeg'));

                var file = dataURLtoFile(
                  canvas.toDataURL('image/jpeg'),
                  'page1.png'
                );
                console.log(file);
              }
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

  const converToImg = () => {
    const pdf = loadingPdf;
    pdf.getPage(1).then((page) => {
      var canvas = document.createElement('canvas');

      var dataURL = canvas.toDataURL();
      console.log(dataURL);
    });
  };

  const getPage = () => {
    const pdf = loadingPdf;
    setPageNumber(pageNumber + 1);
    pdf.getPage(pageNumber + 1).then(function (page) {
      console.log('Page loaded');

      var scale = 1.5;
      var viewport = page.getViewport({ scale: scale });

      // Prepare canvas using PDF page dimensions
      var canvas = document.getElementById('the-canvas');
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
  };

  return (
    <div className="App">
      <h1>PDF.js 'Hello, world!' example</h1>
      <div id="the-canvas"></div>

      <div className="control-section">
        <button onClick={() => setPageNumber(pageNumber - 1)}>previous</button>
        <button
          onClick={() => {
            //setPageNumber(pageNumber + 1);
            converToImg();
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
