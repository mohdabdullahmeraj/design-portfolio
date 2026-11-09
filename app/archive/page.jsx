import PlaygroundGrid from "@/components/PlaygroundGrid";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Archive — Abdullah",
  description: "Posters, social media, brand bits and experiments by Mohd. Abdullah Meraj.",
};

export default function ArchivePage() {
  return (
    <>
      <main>
        <PlaygroundGrid />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
