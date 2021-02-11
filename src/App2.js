import React, { useEffect, useState } from 'react';

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
    console.log(window.pdfjsLib, window);

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
        console.log('PDF loaded', pdf);
        setLoadingPdf(pdf);

        // Fetch the first page
        //var pageNumber = 1;
        pdf.getPage(pageNumber).then(function (page) {
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
      <canvas id="the-canvas"></canvas>

      <div className="control-section">
        <button onClick={() => setPageNumber(pageNumber - 1)}>previous</button>
        <button
          onClick={() => {
            //setPageNumber(pageNumber + 1);
            getPage();
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
