import SiteChrome from "../_components/SiteChrome";

export default function About(){
  return (
    <SiteChrome>
      <h1>About</h1>
      <p><strong>Name:</strong> Brham Bhatia</p>
      <p><strong>Student Number:</strong> 21504199</p>
      <p><strong>How to use this website (video):</strong></p>
      <video controls width={560} aria-label="How to use this website">
        <source src="/how-to-use.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </SiteChrome>
  );
}
