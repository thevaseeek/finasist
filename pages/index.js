export default function Home(){
  return (
    <main style={{padding:"24px",fontFamily:"Inter,system-ui,Arial,sans-serif"}}>
      <h1>FinAsist – Chat náhled</h1>
      <p>Na Wix vlož buď <code>iframe</code> na <code>/chat</code>, nebo použij widget skript z <code>/public/widget.js</code>.</p>
      <iframe src="/chat" title="FinAsist" style={{width:"100%",height:"80vh",border:"1px solid #e6e6ef",borderRadius:18}} />
    </main>
  );
}
