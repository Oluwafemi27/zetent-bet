import Layout from "@/components/layout/Layout";

const Aviator = () => {
  return (
    <Layout>
      <div className="container py-4">
        <h1 className="mb-4 font-display text-2xl font-bold">Aviator</h1>
        <div className="overflow-hidden rounded-xl border border-border">
          <iframe
            src="https://spribe.co/games/aviator"
            className="h-[70vh] w-full"
            frameBorder="0"
            allowFullScreen
            title="Aviator"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Aviator;
