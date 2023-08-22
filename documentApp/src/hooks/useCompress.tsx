/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-var */
import { useCallback, useContext, useState } from "react";
import { CompressContext } from "../App";
import type { RcFile, UploadFile } from "antd/es/upload";
import imageCompression from "browser-image-compression";

export const useCompress = () => {
  const state = useContext(CompressContext);
  //console.log(state.fileList);
  const [image, setImage] = useState([]);
  const getDate = (lastModified: number) => {
    // Create a new Date object using the lastModified timestamp
    var date = new Date(lastModified);
    // Extract the components of the date
    var year = date.getFullYear();
    var month = date.getMonth() + 1; // Months are zero-based, so add 1
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    // Format the date as desired (e.g., YYYY-MM-DD HH:MM:SS)
    function pad(number: number) {
      return number < 10 ? "0" + number : number;
    }
    var formattedDate =
      year +
      "-" +
      pad(month) +
      "-" +
      pad(day) +
      " " +
      pad(hours) +
      ":" +
      pad(minutes) +
      ":" +
      pad(seconds);
    // Helper function to pad single digits with leading zeros
    return formattedDate;
  };
  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  const upload = useCallback(
    async (file: File, fileList: UploadFile<any>[]) => {
      let images: any = [];
      fileList.forEach(async (x, index) => {
        const image = await getBase64(x.originFileObj as RcFile);
        images.push(image);
        if (fileList.length - 1 === index) setImage(images);
      });
      state.setFileList(fileList);
      state.setFile({
        ...state.file,
        originalFile: {
          name: file.name,
          size: file.size,
          lastModifiedDate: new Date().toUTCString() as any,
          type: file.type,
          fileObj: file,
        },
      });
      const imageProp = await generateImage(file);
      state.setOptions({
        ...state.options,
        image: imageProp.image,
        originalHeight: imageProp?.img.height,
        originalWidth: imageProp?.img.width,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  );
  const generateFile = async (file: any) => {
    const width = (state.options?.originalHeight as number) / 2;
    const size = (state.options?.size ?? (1000 as number)) / 1000;
    var options = {
      maxSizeMB: size ?? 1,
      maxWidthOrHeight: width,
      useWebWorker: true,
    };
    const compressor = await imageCompression(file, options);
    return compressor;
  };
  const compress = useCallback(
    async (file: File) => {
      const files: any = [];
      await state.fileList?.forEach(async (x: any, index: number) => {
        const result = await generateFile(x.originFileObj);
        const imageProp = await generateImage(result);
        files.push({
          name: result.name,
          size: result.size,
          lastModifiedDate: getDate(result.lastModified),
          type: result.type,
          compressedImage: imageProp.image,
          compressedWidth: imageProp?.img?.width,
          compressedHeight: imageProp?.img?.height,
        });
        if (state.fileList?.length - 1 === index) {
          state.setFile({
            ...state.file,
            compressedFile: files,
          });
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  );
  const generateImage = async (file: any) => {
    const image = await getBase64(file as RcFile);
    //state.setCompressedFiles(image);
    const img = new Image();
    img.src = image;
    //console.log("height", img.height);
    img.onload = function () {
      console.log(img.width);
    };
    return { image, img };
  };

  const download = (base64Image: any) => {
    var base64Data = base64Image.replace(
      /^data:image\/(png|jpeg|jpg);base64,/,
      ""
    );
    // Convert the base64 string to bytes
    var byteCharacters = atob(base64Data);
    // Create an empty array to store the byte values
    var byteArrays = [];
    // Iterate through the byte characters and push them into the byte array
    for (var i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }
    // Create a Uint8Array from the byte array
    var uint8Array = new Uint8Array(byteArrays);
    // Create a Blob object from the Uint8Array
    var blob = new Blob([uint8Array], { type: "image/png" }); // Adjust the 'type' according to your image format
    // Create a download link
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    // Set the filename for the download
    link.download = "image.png"; // Adjust the filename and extension according to your image format
    // Trigger the download
    link.click();
  };

  const setOptions = useCallback(
    (key: string, value: any) => {
      state.setOptions({ ...state.options, [key]: value });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.options]
  );

  return {
    compressedImage: state.compressedImage,
    file: state.file,
    compress,
    getBase64,
    download,
    setOptions,
    options: state.options,
    upload,
    image,
    fileList: state.fileList,
  };
};
