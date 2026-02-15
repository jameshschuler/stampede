import Stampede from "./components/Stampede";
import { Toaster } from "./components/ui/toaster";

export default function App() {
  return (
    <div className="min-h-screen font-sans antialiased">
      {/* We set the rows and columns here. 
          5x5 is the classic Bingo standard.
      */}
      <Stampede rows={5} cols={5} />

      {/* The Toaster component is vital. 
          Without this, the 'Link Copied' and 'Reset' notifications 
          won't appear on the screen.
      */}
      <Toaster />
    </div>
  );
}
