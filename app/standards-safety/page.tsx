import Link from "next/link";

export const metadata = {
  title: "Standards & Safety | A.K. Robotics",
  description:
    "International standards, safety engineering and cybersecurity references informing A.K. Robotics.",
};

const references = [
  ["ISO 10218-1:2025", "Industrial robot safety and risk reduction."],
  ["ISO 10218-2:2025", "Industrial robot applications and robot cells."],
  ["ISO/TS 15066", "Collaborative robot applications where applicable."],
  ["ISO 3691-4", "Driverless industrial trucks and AMRs where applicable."],
  ["ISO 12100", "Machinery risk assessment and risk reduction."],
  ["IEC 62443", "Industrial automation and control-system cybersecurity."],
  ["NIST IR 8227", "Cybersecurity implementation for a robotic workcell."],
  ["Regulation (EU) 2023/1230", "EU machinery safety and market-access framework."],
];

export default function StandardsSafetyPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.22em] text-neutral-500">
          A.K. Robotics
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
          Standards &amp; Safety
        </h1>
        <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          Robotics should be engineered against real safety, cybersecurity and
          machinery requirements—not marketing language. A.K. Robotics uses
          international standards and authoritative guidance as design and
          governance references.
        </p>
      </div>

      <section className="mt-14 grid gap-8 md:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-3xl border border-neutral-200 p-7 dark:border-neutral-800">
          <h2 className="text-2xl font-semibold">Reference framework</h2>
          <div className="mt-6 space-y-5">
            {references.map(([name, description]) => (
              <div key={name}>
                <h3 className="font-medium">{name}</h3>
                <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 p-7 dark:border-neutral-800">
          <h2 className="text-2xl font-semibold">What this means</h2>
          <p className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            Each deployment is expected to have an applicability review,
            mapped controls and objective evidence before a compliance claim is
            made.
          </p>
          <p className="mt-4 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            The operator control plane complements physical safety systems. It
            does not replace machine risk assessment, safeguarding, competent
            integration, emergency procedures or statutory conformity
            assessment.
          </p>
          <div className="mt-7 border-t border-neutral-200 pt-6 text-sm dark:border-neutral-800">
            <p className="font-medium">Public claim</p>
            <p className="mt-2 leading-6 text-neutral-600 dark:text-neutral-400">
              A.K. Robotics is being developed with reference to applicable
              international robotics safety, industrial cybersecurity,
              machinery-safety and operational-control standards and guidance.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-neutral-200 p-7 dark:border-neutral-800">
        <h2 className="text-2xl font-semibold">Important distinction</h2>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-neutral-600 dark:text-neutral-400">
          References to standards and regulations do not constitute
          certification, accreditation, conformity assessment or a declaration
          that a particular robot, workcell or deployment complies with every
          referenced requirement. Product and jurisdiction scope must be
          assessed separately.
        </p>
        <p className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
          International references are maintained in the engineering evidence
          register and reviewed when product scope, robot class, safety
          function or deployment jurisdiction changes.
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-4 text-sm">
        <Link className="underline underline-offset-4" href="/">
          A.K. Robotics
        </Link>
        <Link className="underline underline-offset-4" href="/evidence">
          Evidence
        </Link>
      </div>
    </main>
  );
}
