export default function About() {
  return (
    <section className="max-w-5xl mx-auto py-16 px-6">
      <h1 className="text-5xl font-black mb-10">About This Project</h1>

      <div className="bg-slate-900 rounded-2xl border border-white/10 p-8 space-y-6">
        <p>
          This project predicts residential property prices using a Machine
          Learning model developed with Python and FastAPI.
        </p>

        <p>
          The frontend is built with React and Tailwind CSS, providing a
          responsive and modern interface for users.
        </p>

        <p>
          Users can estimate a single property's value or analyze an entire
          portfolio of properties.
        </p>

        <p>
          The system demonstrates the integration of Machine Learning with
          modern web development technologies.
        </p>
      </div>
    </section>
  );
}
