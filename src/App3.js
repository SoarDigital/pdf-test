import React, { useEffect, useState } from 'react';
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
    return () => {
      clearState();
    };
  }, []);

  const handlePdf = (e) => {
    console.log(pdfjsLib);
    pdfjsLib.disableWorker = true;

    // Asynchronous download of PDF

    let file = e.target.files[0];
    // console.log(file);
    setPdfFile(file);
    let fileReader = new FileReader();
    fileReader.onload = function (ev) {
      var loadingTask = pdfjsLib.getDocument(fileReader.result);
      loadingTask.promise.then(
        function (pdf) {
          console.log('PDF loaded', pdf._pdfInfo.numPages);
          setLoadingPdf(pdf);

          // Fetch the first page
          //var pageNumber = 1;
          //let totalPages = pdf._pdfInfo.numPages;
          for (let i = 1; i < 5; i++) {
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
                if (i === 1) {
                  var file = dataURLtoFile(
                    canvas.toDataURL('image/jpeg'),
                    'page1.png'
                  );
                  setThumbnail(file);
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
    fileReader.readAsArrayBuffer(file);
  };

  const clearState = () => {
    console.log('here');
  };

  function dataURLtoFile(dataurl, filename) {
    console.log(dataurl);
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
        <input type="file" id="pdf" onChange={handlePdf} />
        <button
          onClick={() => {
            console.log('>> thunbnail', thumbnail);
            console.log('>> pdf', pdfFile);
          }}
        >
          Post
        </button>
      </div>
      <div id="the-canvas"></div>
    </div>
  );
}

export default App;
