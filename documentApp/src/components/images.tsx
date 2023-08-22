import { useCompress } from "../hooks/useCompress";
import { Button } from "antd";

export const CompressedImages = () => {
  const { compressedImage, file, download, options } = useCompress();
  return (
    <div>
      <div className="image-box">
        <div className="image-box-header">
          <span>Input image (original image)</span>{" "}
        </div>
        <div className="image-box-main">
          <img
            height={200}
            width={200}
            className="image"
            src={options.image}
            alt=""
          />
          <div className="image-info">
            <div className="field">
              <label>Last Modified</label>
              <span>{file?.originalFile?.lastModifiedDate}</span>
            </div>
            <div className="field">
              <label>Name</label>
              <span>{file?.originalFile?.name}</span>
            </div>
            <div className="field">
              <label>Type</label>
              <span>{file?.originalFile?.type}</span>
            </div>
            <div className="field">
              <label>Height</label>
              <span>{options?.originalHeight}</span>
            </div>
            <div className="field">
              <label>Width</label>
              <span>{options?.originalWidth}</span>
            </div>
            <div className="field">
              <label>Size</label>
              <span>
                {file?.originalFile?.size
                  ? `${file?.originalFile?.size / 1000} KB`
                  : ""}{" "}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="image-box">
        <div className="image-box-header">
          <span>Output image (compressed image)</span>{" "}
        </div>
        {file?.compressedFile?.map((x: any, index: number) => (
          <div className="image-box-main">
            {" "}
            <img
              height={200}
              width={200}
              className="image"
              src={x.compressedImage}
              alt=""
            />
            <div className="image-info">
              <Button
                onClick={() => download(x.compressedImage)}
                className="button"
              >
                Download
              </Button>
              <div className="field">
                <label>Last Modified</label>
                <span>{x.lastModifiedDate}</span>
              </div>
              <div className="field">
                <label>Name</label>
                <span>{x.name}</span>
              </div>
              <div className="field">
                <label>Type</label>
                <span>{x.type}</span>
              </div>
              <div className="field">
                <label>Height</label>
                <span>{x.compressedHeight}</span>
              </div>
              <div className="field">
                <label>Width</label>
                <span>{x.compressedWidth}</span>
              </div>
              <div className="field">
                <label>Size</label>
                <span>{`${x.size / 1000} KB`} </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
