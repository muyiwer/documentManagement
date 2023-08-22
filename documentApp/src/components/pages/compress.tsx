import { AppHeader } from "../../components/header";
import { AppTitle } from "../../components/title";
import { AppUpload } from "../../components/upload";
import { ImageOptions } from "../../components/options";
import { CompressedImages } from "../../components/images";

export const CompressPage = () => {
  return (
    <section className="grid">
      <AppHeader />
      <main>
        <AppTitle
          description="Reduce the file size of your images with online image compression.
        Compress image files quickly without software installation."
          title="Home"
        />
        <AppUpload />
        <article>
          <ImageOptions />
          <CompressedImages />
        </article>
      </main>
      <footer style={{ textAlign: "center" }}>
        Powered by Oluwatosin Adeogun
      </footer>
    </section>
  );
};
