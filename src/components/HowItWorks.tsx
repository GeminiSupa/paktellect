export function HowItWorks() {
  const steps = [
    {
      title: "Find an Expert",
      desc: "Browse through our curated list of experts in various fields."
    },
    {
      title: "Book a Session",
      desc: "Choose a time that works for you and provide your details."
    },
    {
      title: "Get 1:1 Advice",
      desc: "Join the video call and get personalized guidance."
    }
  ]

  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-slate-950 scroll-mt-32 md:scroll-mt-40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            How it <span className="text-primary">Works</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Three simple steps to connect with the best minds in the industry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center group">
              <div className="size-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-primary font-bold text-2xl mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                {i + 1}
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{step.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{step.desc}</p>
              {i < 2 && (
                 <div className="hidden lg:block absolute top-8 left-[calc(50%+4rem)] w-[calc(100%-8rem)] h-[2px] bg-slate-100 dark:bg-slate-800"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

