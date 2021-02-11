import { Viewer, Worker } from '@react-pdf-viewer/core';

// Plugins
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
const ExamplePDFViewer = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    //http://api-dev.thenewspaperstand.com/uploads/file-1612784318158.pdf
    <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js">
      <Viewer
        fileUrl="https://tns-upload.s3.us-east-2.amazonaws.com/pdf/Nelson/2021-02-10/tests.pdf"
        // withCredentials={true}
        plugins={[
          // Register plugins
          defaultLayoutPluginInstance,
        ]}
      />
    </Worker>
  );
};

export default ExamplePDFViewer;
